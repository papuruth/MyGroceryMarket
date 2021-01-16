import Storage from '@/utils/Storage';
import { call, put, takeEvery } from 'redux-saga/effects';
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

const fetchMyCartItemsService = async () => {
  try {
    const cartItems = await Storage.getCartItems();
    return {
      response: {
        data: JSON.parse(cartItems) ?? [],
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

function* fetchMyCartItemsSaga() {
  const { response, error } = yield call(fetchMyCartItemsService);
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
