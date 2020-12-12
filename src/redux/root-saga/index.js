import { all } from 'redux-saga/effects';
import { fetchMyCartItemsWatcherSaga } from '../globalCartAndCheckout/GlobalCartAndCheckoutSaga';
import { loaderStartWatcherSaga, loaderStopWatcherSaga } from '../loaderService/LoaderSaga';
import {
  sendNewOrderRequestNotificationWatcherSaga,
  wakeNotificationServerWatcherSaga,
} from '../notifications/NotificationSagas';
import {
  fetchAllCategoriesWatcherSaga,
  fetchAllDistributorsWatcherSaga,
  fetchAllProductsWatcherSaga,
  fetchProductDetailsWatcherSaga,
  fetchProductsWatcherSaga,
  mountSearchWatcherSaga,
} from '../products/ProductSaga';
import {
  addAddressWatcherSaga,
  deleteAddressByIdWatcherSaga,
  getAllAddressWatcherSaga,
  getAllMyOrdersWatcherSaga,
  sendOTPWatcherSaga,
  updateAddressByIdWatcherSaga,
  userLogoutWatcherSaga,
} from '../user/UserSaga';

export default function* rootSaga() {
  yield all([
    sendOTPWatcherSaga(),
    loaderStopWatcherSaga(),
    userLogoutWatcherSaga(),
    loaderStartWatcherSaga(),
    addAddressWatcherSaga(),
    mountSearchWatcherSaga(),
    getAllAddressWatcherSaga(),
    fetchProductsWatcherSaga(),
    getAllMyOrdersWatcherSaga(),
    fetchAllProductsWatcherSaga(),
    fetchMyCartItemsWatcherSaga(),
    updateAddressByIdWatcherSaga(),
    deleteAddressByIdWatcherSaga(),
    fetchAllCategoriesWatcherSaga(),
    fetchProductDetailsWatcherSaga(),
    fetchAllDistributorsWatcherSaga(),
    wakeNotificationServerWatcherSaga(),
    sendNewOrderRequestNotificationWatcherSaga(),
  ]);
}
