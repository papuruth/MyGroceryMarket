import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import ENV from '@/utils/appConstants/Environment';
import firestore from '@react-native-firebase/firestore';
import { getAPIData, postAPIData } from '@/utils/webServiceHandler/Backend';
import { NOTIFICATION_CONSTANTS } from './NotificationConstants';

const { checkEmpty } = require('@/utils/commonFunctions');
const { call, put, takeEvery, takeLatest } = require('redux-saga/effects');

const success = (type, payload) => ({
  type,
  payload,
});

const failure = (type, error) => ({
  type,
  error,
});

const sendNewOrderRequestNotificationService = async ({ data, userId }) => {
  try {
    const {
      URLS: { sendNotification },
    } = APP_CONSTANTS;
    const res = await postAPIData(sendNotification, data);
    if (!checkEmpty(res) && res?.status) {
      if (!checkEmpty(res.payload) && !checkEmpty(res?.payload?.failedTokens)) {
        const { failedTokens } = res?.payload;
        const userRef = await firestore()
          .collection('distributors')
          .doc(userId)
          .get();
        const userDetails = userRef.data();
        const updateUserPayload =
          !checkEmpty(userDetails) && !checkEmpty(userDetails?.tokens)
            ? userDetails?.tokens.filter((token) => !failedTokens.includes(token))
            : [];
        await firestore()
          .collection('distributors')
          .doc(userId)
          .update({ tokens: updateUserPayload });
      }
      return {
        response: {
          status: true,
          data: res.payload,
          message: 'success',
        },
      };
    }
    throw new Error(JSON.stringify(res?.payload));
  } catch (error) {
    console.log(error);
    return {
      error: {
        data: {},
        status: false,
        error: JSON.parse(error?.message),
      },
    };
  }
};

function* sendNewOrderRequestNotificationSaga(action) {
  const { response, error } = yield call(sendNewOrderRequestNotificationService, action.payload);
  if (!checkEmpty(response) && response?.status) {
    yield put(
      yield call(success, NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_SUCCESS, response),
    );
  } else {
    yield put(
      yield call(failure, NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_FAILURE, error),
    );
    if (error?.error?.status === 503) {
      yield delay(60000);
      yield sendNewOrderRequestNotificationSaga(action);
    }
  }
}

export function* sendNewOrderRequestNotificationWatcherSaga() {
  yield takeEvery(
    NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_REQUEST,
    sendNewOrderRequestNotificationSaga,
  );
}

const wakeNotificationServerService = async () => {
  try {
    const { API_HOST } = ENV;
    const res = await getAPIData(API_HOST);
    if (!checkEmpty(res) && res?.status) {
      return {
        response: {
          status: true,
        },
      };
    }
    throw Error(JSON.stringify(res?.payload));
  } catch (error) {
    return {
      error,
    };
  }
};

function* wakeNotificationServerSaga() {
  const { response, error } = yield call(wakeNotificationServerService);
  if (!checkEmpty(response) && response?.status) {
    yield put(
      yield call(
        success,
        NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_SUCCESS,
        response?.status,
      ),
    );
  } else {
    yield put(yield call(failure, NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_FAILURE, error));
  }
}

export function* wakeNotificationServerWatcherSaga() {
  yield takeLatest(
    NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_REQUEST,
    wakeNotificationServerSaga,
  );
}
