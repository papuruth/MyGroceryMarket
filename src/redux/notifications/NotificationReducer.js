import { NOTIFICATION_CONSTANTS } from './NotificationConstants';

const initialState = {
  notificationSent: {},
  notificationSentError: {},
  serverIsWake: false,
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notificationSent: action.payload.data,
        notificationSentError: {},
      };
    case NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_FAILURE:
      return {
        ...state,
        notificationSentError: action.error,
      };
    case NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_SUCCESS:
      return {
        ...state,
        serverIsWake: action.payload,
      };
    case NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_FAILURE:
      return {
        ...state,
        serverIsWake: false,
      };
    default:
      return { ...state };
  }
}
