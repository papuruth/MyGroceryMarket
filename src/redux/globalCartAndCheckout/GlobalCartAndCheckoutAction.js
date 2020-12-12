import { GLOBALCARTANDCHECKOUTCONSTANTS } from './GlobalCartAndCheckoutConstants';

export const fetchMyCartItemsAction = (userId) => ({
  type: GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_REQUEST,
  payload: { userId },
});
