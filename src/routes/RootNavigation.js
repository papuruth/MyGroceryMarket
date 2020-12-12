import { getAllAddressAction } from '@/redux/user/userAction';
import { colors } from '@/styles';
import { checkEmpty } from '@/utils/commonFunctions';
import { Text } from '@/utils/reusableComponents/StyledText';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import messaging from '@react-native-firebase/messaging';
import React, { PureComponent } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon as RNEIcon } from 'react-native-elements';
import { mountSearchAction } from '@/redux/products/ProductsAction';
import IconWithBadge from '../utils/reusableComponents/IconWithBadge';
import StackNavigationData from './StackNavigationData';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: `100%`,
    height: 57,
  },
  padRight: {
    marginRight: 10,
  },
  headerRightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  chooseLocation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  menuIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  mapTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: colors.white,
  },
});

export default class NavigatorView extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      initialRoute: '',
    };
    const { dispatch, user } = props;
    dispatch(getAllAddressAction(user?.uid));
  }

  componentDidMount() {
    const { navigation, authenticated } = this.props;
    if (authenticated) {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        navigation.navigate(remoteMessage?.data?.route);
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            this.setState(
              {
                initialRoute: remoteMessage?.data?.route,
              },
              () => navigation.navigate(remoteMessage?.data?.route),
            );
          }
        });
    }
  }

  mountSearch = () => {
    const { dispatch } = this.props;
    dispatch(mountSearchAction(true));
  };

  headerLeftComponentMenu = () => {
    const { navigation, addressData } = this.props;
    const defaultAddress = !checkEmpty(addressData)
      ? addressData.filter((item) => item?.isDefault)[0]
      : null;
    return (
      <SafeAreaView style={styles.headerLeftContainer}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuIcon}>
          <RNEIcon name="menu" type="material-community" color="white" size={30} />
        </TouchableOpacity>
        <Pressable style={styles.chooseLocation}>
          <RNEIcon
            name="map-marker"
            type="material-community"
            color="white"
            size={30}
            containerStyle={styles.padRight}
          />
          <View style={{ justifyContent: 'flex-end' }}>
            <Text style={{ color: colors.white, fontSize: 12 }}>Delivery Location</Text>
            <Text style={styles.mapTextStyle}>{defaultAddress?.street}</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    );
  };

  headerRightComponent = () => {
    const { navigation, myCartItems, route } = this.props;
    let isHome = false;
    let isCart = false;
    let isCheckout = false;
    let isPayment = false;
    if (this.props) {
      const { state } = !checkEmpty(route) ? route : {};
      const { routes } = state || {};
      isHome = !checkEmpty(routes) ? routes[routes.length - 1].name === 'home' : false;
      isCart = !checkEmpty(routes) ? routes[routes.length - 1].name === 'cart' : false;
      isCheckout = !checkEmpty(routes) ? routes[routes.length - 1].name === 'checkout' : false;
      isPayment = !checkEmpty(routes) ? routes[routes.length - 1].name === 'payment' : false;
    }
    return (
      <SafeAreaView style={styles.headerRightContainer}>
        {!checkEmpty(route?.state?.routes) && !isHome && !isCheckout && !isPayment ? (
          <TouchableOpacity
            onPress={() => this.mountSearch()}
            style={{
              paddingLeft: 10,
            }}
          >
            <RNEIcon name="search" color="white" size={30} containerStyle={styles.padRight} />
          </TouchableOpacity>
        ) : null}
        {!isCart && !isCheckout && !isPayment ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('cart')}
            style={{
              paddingLeft: 10,
              marginRight: 10,
            }}
          >
            <IconWithBadge badgeValue={myCartItems?.length}>
              <RNEIcon
                name="cart-plus"
                type="font-awesome"
                color="white"
                size={30}
                containerStyle={styles.padRight}
              />
            </IconWithBadge>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  };

  render() {
    const { authenticated } = this.props;
    const { initialRoute } = this.state;
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: authenticated,
        }}
        initialRouteName={initialRoute}
      >
        {StackNavigationData.map((item) => {
          if (authenticated && item.path !== 'login' && item.path !== 'verify-otp') {
            return (
              <Stack.Screen
                key={`stack_item-${item.path}`}
                name={item.path}
                component={item.component}
                options={{
                  headerLeft: item.headerLeft || this.headerLeftComponentMenu,
                  headerRight: this.headerRightComponent,
                  headerBackground: () => (
                    <Image style={styles.headerImage} source={item.headerBackground.source} />
                  ),
                  headerTitleStyle: item.headerTitleStyle,
                  headerTitle: item.name,
                }}
              />
            );
          }
          if (!authenticated && (item.path === 'login' || item.path === 'verify-otp')) {
            return (
              <Stack.Screen
                key={`stack_item-${item.path}`}
                name={item.path}
                component={item.component}
                options={{
                  headerLeft: item.headerLeft || this.headerLeftComponentMenu,
                  headerRight: this.headerRightComponent,
                  headerBackground: () => (
                    <Image style={styles.headerImage} source={item.headerBackground.source} />
                  ),
                  headerTitleStyle: item.headerTitleStyle,
                  headerTitle: item.name,
                }}
              />
            );
          }
          return null;
        })}
      </Stack.Navigator>
    );
  }
}

NavigatorView.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
  authenticated: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  myCartItems: PropTypes.oneOfType([PropTypes.array]).isRequired,
  addressData: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
