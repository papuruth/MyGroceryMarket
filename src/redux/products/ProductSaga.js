import firestore from '@react-native-firebase/firestore';

const { checkEmpty } = require('@/utils/commonFunctions');
const { call, put, takeEvery } = require('redux-saga/effects');
const { LOADER_CONSTANTS } = require('../loaderService/LoaderConstants');
const { PRODUCTS_CONSTANTS } = require('./ProductConstants');

const success = (type, payload) => ({
  type,
  payload,
});

const failure = (type, error) => ({
  type,
  error,
});

const fetchAllCategoriesService = async () => {
  try {
    const response = await firestore()
      .collection('categories')
      .get();
    const docSnapShot = response.docs;
    const allCategories = docSnapShot.map((doc) => doc.data());
    const uniqueCategoriesLabel = [...new Set(allCategories.map((item) => item.category))];
    const uniqueCategories = [];
    uniqueCategoriesLabel.forEach((key) => {
      uniqueCategories.push(allCategories.filter((item) => item.category === key)[0]);
    });
    return {
      response: {
        data: uniqueCategories,
        status: true,
        message: 'success',
      },
    };
  } catch (error) {
    console.log(error);
    return {
      response: {
        data: {},
        status: false,
        message: error?.message,
      },
    };
  }
};

function* fetchAllCategoriesSaga() {
  const { response, error } = yield call(fetchAllCategoriesService);
  if (!checkEmpty(response) && response?.status) {
    yield put(yield call(success, PRODUCTS_CONSTANTS.FETCH_CATEGORIES_SUCCESS, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(yield call(failure, PRODUCTS_CONSTANTS.FETCH_CATEGORIES_FAILURE, error));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchAllCategoriesWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.FETCH_CATEGORIES_REQUEST, fetchAllCategoriesSaga);
}

const fetchProductsService = async ({ category }) => {
  console.log(category);
  try {
    const response = await firestore()
      .collection('products')
      .get();
    const docSnapShot = response.docs;
    const allProducts = docSnapShot.map((doc) => doc.data());
    const filteredProducts = !checkEmpty(allProducts)
      ? allProducts.filter((item) => item?.category === category)
      : [];
    return {
      response: {
        data: filteredProducts,
        status: true,
        message: 'success',
      },
    };
  } catch (error) {
    console.log(error);
    return {
      response: {
        data: [],
        status: false,
        message: error?.message,
      },
    };
  }
};

function* fetchProductsSaga(action) {
  const { response, error } = yield call(fetchProductsService, action.payload);
  if (!checkEmpty(response) && response?.status) {
    yield put(yield call(success, PRODUCTS_CONSTANTS.FETCH_PRODUCTS_SUCCESS, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(yield call(failure, PRODUCTS_CONSTANTS.FETCH_PRODUCTS_FAILURE, error));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchProductsWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
}

const fetchProductDetailsService = async ({ productId }) => {
  try {
    const response = await firestore()
      .collection('products')
      .doc(productId.trim())
      .get({ source: 'server' });
    return {
      response: {
        data: response.data(),
        status: true,
        message: 'success',
      },
    };
  } catch (error) {
    return {
      response: {
        data: [],
        status: false,
        message: error?.message,
      },
    };
  }
};

function* fetchProductDetailsSaga(action) {
  const { response, error } = yield call(fetchProductDetailsService, action.payload);
  if (!checkEmpty(response) && response?.status) {
    yield put(yield call(success, PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_SUCCESS, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(yield call(failure, PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_FAILURE, error));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchProductDetailsWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_REQUEST, fetchProductDetailsSaga);
}

const fetchAllProductsService = async () => {
  try {
    const response = await firestore()
      .collection('products')
      .get();
    const docSnapShot = response.docs;
    const allProducts = docSnapShot.map((doc) => doc.data());
    return {
      response: {
        data: allProducts || [],
        status: true,
        message: 'success',
      },
    };
  } catch (error) {
    return {
      response: {
        data: [],
        status: false,
        message: error?.message,
      },
    };
  }
};

function* fetchAllProductsSaga() {
  const { response } = yield call(fetchAllProductsService);
  if (!checkEmpty(response) && response?.status) {
    yield put(yield call(success, PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_SUCCESS, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(yield call(failure, PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_FAILURE, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchAllProductsWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_REQUEST, fetchAllProductsSaga);
}

function* mountSearchSaga(action) {
  yield put(yield call(success, PRODUCTS_CONSTANTS.MOUNT_SEARCH_SUCCESS, action?.payload));
}

export function* mountSearchWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.MOUNT_SEARCH_REQUEST, mountSearchSaga);
}

const fetchAllDistributorsService = async () => {
  try {
    const response = await firestore()
      .collection('distributors')
      .get();
    const docSnapShot = response.docs;
    const allDistributors = docSnapShot.map((doc) => doc.data());
    console.log(allDistributors);
    const optimizedData = !checkEmpty(allDistributors)
      ? allDistributors.map((item) => {
          return {
            name: item?.displayName,
            distributorId: item?.uid,
            fcm_token: item?.tokens,
          };
        })
      : [];
    return {
      response: {
        data: optimizedData,
        status: true,
        message: 'success',
      },
    };
  } catch (error) {
    return {
      response: {
        data: [],
        status: false,
        message: error?.message,
      },
    };
  }
};

function* fetchAllDistributorsSaga() {
  const { response } = yield call(fetchAllDistributorsService);
  if (!checkEmpty(response) && response?.status) {
    yield put(yield call(success, PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_SUCCESS, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  } else {
    yield put(yield call(failure, PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_FAILURE, response));
    yield put({ type: LOADER_CONSTANTS.LOADER_STOP_REQUEST });
  }
}

export function* fetchAllDistributorsWatcherSaga() {
  yield takeEvery(PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_REQUEST, fetchAllDistributorsSaga);
}
