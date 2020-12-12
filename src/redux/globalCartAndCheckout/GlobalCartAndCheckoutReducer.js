import { GLOBALCARTANDCHECKOUTCONSTANTS } from './GlobalCartAndCheckoutConstants';

const initialState = {
  myCartItems: [],
  myCartItemsError: {},
};

export default function globalCartReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_SUCCESS:
      return { ...state, myCartItems: payload.data };
    case GLOBALCARTANDCHECKOUTCONSTANTS.FETCH_MY_CART_ITEMS_FAILURE:
      return { ...state, myCartItemsError: payload.error };
    default:
      return state;
  }
}
