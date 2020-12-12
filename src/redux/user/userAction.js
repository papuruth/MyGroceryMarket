import { USER_CONSTANTS } from './userConstants';

export const sendOTPAction = (phone) => ({
  type: USER_CONSTANTS.SEND_OTP_REQUEST,
  payload: { phone },
});

export const userLogout = () => ({
  type: USER_CONSTANTS.USER_LOGOUT_REQUEST,
});

export const addAddressAction = (data, userId) => ({
  type: USER_CONSTANTS.ADD_ADDRESS_REQUEST,
  payload: { data, userId },
});

export const updateAddressById = (docId, userId, data) => ({
  type: USER_CONSTANTS.UPDATE_ADDRESS_REQUEST,
  payload: { docId, userId, data },
});

export const getAllAddressAction = (id) => ({
  type: USER_CONSTANTS.GET_ALL_ADDRESS_REQUEST,
  payload: id,
});

export const deleteAddressById = (docId, userId) => ({
  type: USER_CONSTANTS.DELETE_ADDRESS_REQUEST,
  payload: { docId, userId },
});

export const fetchAllOrdersAction = (userId) => ({
  type: USER_CONSTANTS.GET_MY_ORDERS_REQUEST,
  payload: { userId },
});
