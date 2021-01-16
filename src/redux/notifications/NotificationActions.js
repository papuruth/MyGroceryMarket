import { NOTIFICATION_CONSTANTS } from './NotificationConstants';

export const sendNewOrderRequestNotificationAction = (data, userId) => ({
  type: NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_REQUEST,
  payload: { data, userId },
});

export const wakeNotificationServerAction = () => ({
  type: NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_REQUEST,
});
