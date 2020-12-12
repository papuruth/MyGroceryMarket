import { NOTIFICATION_CONSTANTS } from './NotificationConstants';

export const sendNewOrderRequestNotificationAction = (data) => ({
  type: NOTIFICATION_CONSTANTS.SEND_NEW_ORDER_NOTIFICATION_REQUEST,
  payload: { data },
});

export const wakeNotificationServerAction = () => ({
  type: NOTIFICATION_CONSTANTS.WAKE_NOTIFICATION_SERVER_REQUEST,
});
