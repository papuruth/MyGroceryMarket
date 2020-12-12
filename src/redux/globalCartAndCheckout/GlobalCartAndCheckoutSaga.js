import firestore from '@react-native-firebase/firestore';
import { put, call, takeEvery } from 'redux-saga/effects';
import { LOADER_CONSTANTS } from '../loaderService/LoaderConstants';
import { GLOBALCARTANDCHECKOUTCONSTANTS } from './GlobalCartAndCheckoutConstants';

const success = (type, payload) => ({
  type,
  payload,
});

const failure = (type, error) => ({
  type,
  error,
});

const fetchMyCartItemsService = async ({ userId }) => {
  try {
    const docSnap = await firestore()
      .collection('my-cart')
      .doc(userId)
      .collection('cart-items')
      .get();
    return {
      response: {
        data: docSnap.docs.map((doc) => doc.data()) || [],
        status: true,
        message: 'success',
      },
    };
  } catch (e) {
    return {
      error: {
        data: [],
        status: false,
        message: e?.message,
      },
    };
  }
};

function* fetchMyCartItemsSaga(action) {
  const { response, error } = yield call(fetchMyCartItemsService, action.payload);
  if (response?.status) {
    yield put(
      yield call(success, GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_SUCCESS, response),
    );
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(
      yield call(failure, GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_FAILURE, error),
    );
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchMyCartItemsWatcherSaga() {
  yield takeEvery(GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_REQUEST, fetchMyCartItemsSaga);
}
