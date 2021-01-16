import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

// Register background handler
messaging().setBackgroundMessageHandler(async () => {
  console.log('FCM Backgroound Handler');
});

AppRegistry.registerComponent(appName, () => App);
