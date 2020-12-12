import { USER_CONSTANTS } from './userConstants';

const initialState = {
  otpSentStatus: false,
  otpConfirm: {},
  otpSentError: {},
  addAddress: {},
  addAddressError: {},
  updateAddress: {},
  updateAddressError: {},
  addressData: [],
  myOrders: [],
  myOrdersError: {},
  addressDataError: {},
  addressDeleteStatus: {},
  addressDeleteError: {},
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_CONSTANTS.SEND_OTP_REQUEST:
      return {
        otpSentStatus: false,
        otpConfirm: {},
        otpSentError: {},
      };
    case USER_CONSTANTS.SEND_OTP_SUCCESS:
      return {
        ...state,
        otpSentStatus: action?.payload?.status,
        otpConfirm: action?.payload?.data,
      };
    case USER_CONSTANTS.SEND_OTP_FAILURE:
      return {
        ...state,
        otpSentError: action.error,
      };
    case USER_CONSTANTS.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        otpSentStatus: false,
        otpConfirm: {},
        otpSentError: {},
      };
    case USER_CONSTANTS.ADD_ADDRESS_REQUEST:
      return {
        ...state,
        addAddressError: {},
        addAddress: {},
      };
    case USER_CONSTANTS.ADD_ADDRESS_SUCCESS:
      return {
        ...state,
        addAddress: action.payload,
      };
    case USER_CONSTANTS.ADD_ADDRESS_FAILURE:
      return {
        ...state,
        addAddressError: action.error || {},
      };
    case USER_CONSTANTS.UPDATE_ADDRESS_REQUEST:
      return {
        ...state,
        updateAddress: {},
        updateAddressError: {},
      };
    case USER_CONSTANTS.UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        updateAddress: action.payload,
      };
    case USER_CONSTANTS.UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        updateAddressError: action.error || {},
      };
    case USER_CONSTANTS.GET_ALL_ADDRESS_SUCCESS:
      return {
        ...state,
        addressData: action.payload.data || [],
      };
    case USER_CONSTANTS.GET_ALL_ADDRESS_FAILURE:
      return {
        ...state,
        addressDataError: action.error,
      };
    case USER_CONSTANTS.DELETE_ADDRESS_REQUEST:
      return {
        ...state,
        addressDeleteStatus: {},
        addressDeleteError: {},
      };
    case USER_CONSTANTS.DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        addressDeleteStatus: action.payload,
        addressDeleteError: {},
      };
    case USER_CONSTANTS.DELETE_ADDRESS_FAILURE:
      return {
        ...state,
        addressDeleteStatus: {},
        addressDeleteError: action.error,
      };
    case USER_CONSTANTS.GET_MY_ORDERS_SUCCESS:
      return {
        ...state,
        myOrders: action.payload.data,
        myOrdersError: {},
      };
    case USER_CONSTANTS.GET_MY_ORDERS_FAILURE:
      return {
        ...state,
        myOrdersError: action.error,
      };
    default:
      return { ...state };
  }
}
