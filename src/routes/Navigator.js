import NavigatorView from '@/containers/NavigatorView';
import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { getAllAddressAction } from '@/redux/user/userAction';
import { checkEmpty, equalityChecker, handleLogout } from '@/utils/commonFunctions';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Progress from 'react-native-progress';
import { sessionService } from 'redux-react-native-session';
import RenderDrawer from './DrawerNavigation';

const Drawer = createDrawerNavigator();

export default class App extends React.PureComponent {
  async componentDidMount() {
    const { user, dispatch } = this.props;
    dispatch(fetchMyCartItemsAction(user?.uid));
    this.unsubscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
    await RNBootSplash.hide({ fade: true });
  }

  componentDidUpdate(prevProps) {
    const { user, dispatch } = this.props;
    if (!equalityChecker(user, prevProps.user) && !checkEmpty(user)) {
      dispatch(fetchMyCartItemsAction(user?.uid));
      dispatch(getAllAddressAction(user?.uid));
    }
  }

  componentWillUnmount() {
    if (this.subscriber) {
      this.unsubscribe();
    }

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = auth().currentUser?.uid;
    // Add the token to the users datastore
    if (userId) {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          tokens: firestore.FieldValue.arrayUnion(token),
        });

      const orderSnap = await firestore()
        .collection('orders')
        .get();
      const { docs } = orderSnap;
      const orders = docs.map((item) => item.data());
      const myOrders = !checkEmpty(orders) ? orders.filter((item) => item?.userId === userId) : [];
      if (!checkEmpty(myOrders)) {
        myOrders.forEach((item) => {
          firestore()
            .collection('orders')
            .doc(item?.orderId)
            .update({ 'userDetails.tokens': firestore.FieldValue.arrayUnion(token) })
            .then(() => 'OrderDetails Updated with new token')
            .catch((e) => console.log(e?.message));
        });
      }
    }
  };

  saveFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        return this.saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    this.unsubscribe = messaging().onTokenRefresh((token) => {
      this.saveTokenToDatabase(token);
    });
  };

  onAuthStateChanged = async (user) => {
    if (!checkEmpty(user) && !checkEmpty(user._user)) {
      const storedUser = await firestore()
        .collection('users')
        .doc(user?._user?.uid)
        .get();
      if (storedUser?.data() && storedUser?.data()?.user_type) {
        if (storedUser?.data()?.user_type !== 2 && !storedUser?.data()?.status) {
          Alert.alert('Info', 'Sorry you are not allowed to use this app. Please contact support.');
          await handleLogout(this.props);
          return;
        }
        await sessionService.saveSession(storedUser?.data());
        await sessionService.saveUser(storedUser?.data());
        this.saveFCMToken();
      } else {
        await firestore()
          .collection('users')
          .doc(user?._user.uid)
          .set({ ...user?._user, user_type: 2 });
        await sessionService.saveSession({ ...user?._user, user_type: 2 });
        await sessionService.saveUser({ ...user?._user, user_type: 2 });
      }
    }
  };

  render() {
    const { loaderService, authenticated, user, dispatch } = this.props;
    return (
      <>
        <Spinner
          visible={loaderService}
          cancelable
          customIndicator={(
            <Progress.CircleSnail
              size={70}
              thickness={5}
              progress={1}
              color={['red', 'green', 'blue']}
            />
          )}
          overlayColor="rgba(0,0,0,0.4)"
          animation="fade"
        />
        <Drawer.Navigator
          drawerStyle={{
            backgroundColor: '#3C38B1',
            width: '80%',
          }}
          openByDefault={false}
          screenOptions={{
            swipeEnabled: authenticated,
          }}
          drawerContent={(props) => (
            <RenderDrawer
              {...props}
              authenticated={authenticated}
              user={user}
              dispatch={dispatch}
            />
          )}
        >
          <Drawer.Screen name="root" component={NavigatorView} />
        </Drawer.Navigator>
      </>
    );
  }
}

App.propTypes = {
  loaderService: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
