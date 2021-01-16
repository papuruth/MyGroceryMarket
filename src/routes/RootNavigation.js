import { loaderStartAction, loaderStopAction } from '@/redux/loaderService/LoaderAction';
import { mountSearchAction } from '@/redux/products/ProductsAction';
import { getAllAddressAction } from '@/redux/user/userAction';
import { colors } from '@/styles';
import { checkEmpty } from '@/utils/commonFunctions';
import { Dropdown } from '@/utils/reusableComponents';
import { Text } from '@/utils/reusableComponents/StyledText';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon as RNEIcon } from 'react-native-elements';
import 'react-native-gesture-handler';
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
    alignContent: 'center',
    justifyContent: 'center',
    height: 57,
  },
  padRight: {
    marginRight: 0,
  },
  headerRightContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'space-between',
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
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  menuIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
      mountAddressDropdown: false,
      selectedAddressIndex: -1,
    };
    const { dispatch, user } = props;
    dispatch(getAllAddressAction(user?.uid));
  }

  componentDidMount() {
    const { navigation, authenticated } = this.props;
    if (authenticated) {
      messaging().onNotificationOpenedApp((remoteMessage) => {
        navigation.navigate('root', { screen: remoteMessage?.data?.route });
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
              () => navigation.navigate('root', { screen: remoteMessage?.data?.route }),
            );
          }
        })
        .catch((e) => console.log(e?.message));
    }
  }

  mountSearch = () => {
    const { dispatch } = this.props;
    dispatch(mountSearchAction(true));
  };

  changeAddress = () => {
    this.setState(
      {
        mountAddressDropdown: true,
      },
      () => this.forceUpdate(),
    );
  };

  updateDefaultAddress = async () => {
    const { user, addressData, dispatch } = this.props;
    try {
      dispatch(loaderStartAction());
      const { selectedAddressIndex } = this.state;
      const defaultExist = !checkEmpty(addressData)
        ? addressData.findIndex((item) => item.isDefault)
        : -1;
      const selectedAddress = !checkEmpty(addressData) ? addressData[selectedAddressIndex] : [];
      if (defaultExist > -1) {
        const isDefaultAddress = addressData[defaultExist]._id === selectedAddress?._id;
        if (isDefaultAddress) {
          this.setState({
            mountAddressDropdown: false,
          });
        } else {
          const res = await firestore()
            .collection('Address')
            .doc(user?.uid)
            .collection('user_address')
            .doc(addressData[defaultExist]._id)
            .update({
              isDefault: false,
            });
          if (!res) {
            const res1 = await firestore()
              .collection('Address')
              .doc(user?.uid)
              .collection('user_address')
              .doc(selectedAddress?._id)
              .update({
                isDefault: true,
              });
            if (!res1) {
              this.setState({
                mountAddressDropdown: false,
              });
              dispatch(getAllAddressAction(user?.uid));
            }
          }
        }
      } else {
        const res = await firestore()
          .collection('Address')
          .doc(user?.uid)
          .collection('user_address')
          .doc(selectedAddress?._id)
          .update({
            isDefault: true,
          });
        if (!res) {
          dispatch(getAllAddressAction(user?.uid));
          this.setState({
            mountAddressDropdown: false,
          });
        }
      }
      dispatch(loaderStopAction());
    } catch (e) {
      console.log(e?.message);
      dispatch(loaderStopAction());
    }
  };

  handleAddressSelected = (index) => {
    this.setState(
      {
        selectedAddressIndex: index,
      },
      this.updateDefaultAddress,
    );
  };

  conditionallyRenderDeliveryAddres = (data) => {
    const { navigation } = this.props;
    const { mountAddressDropdown, selectedAddressIndex } = this.state;
    if (!checkEmpty(data)) {
      const defaultAddress = data.filter((item) => item?.isDefault)[0] || {};
      const addressOptions = data.map((item) => item?.street) || [];
      if (!mountAddressDropdown && !checkEmpty(defaultAddress)) {
        return (
          <TouchableOpacity onPress={this.changeAddress}>
            <View style={styles.chooseLocation}>
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={{ color: colors.white, fontSize: 12 }}>Delivery Location</Text>
                <Text style={styles.mapTextStyle}>{defaultAddress?.street}...</Text>
              </View>
              <RNEIcon
                style={{ paddingLeft: 5 }}
                name="pencil"
                type="material-community"
                color="white"
                size={20}
                containerStyle={styles.padRight}
              />
            </View>
          </TouchableOpacity>
        );
      }
      if (mountAddressDropdown && data?.length > 1) {
        return (
          <View style={styles.chooseLocation}>
            <Dropdown
              items={addressOptions}
              onSelect={this.handleAddressSelected}
              selectedIndex={selectedAddressIndex}
              placeholder="Change Address"
              borderColor="#fff"
              height={40}
              outerColor="#fff"
              color="#000"
            />
          </View>
        );
      }
      if (data?.length > 0 && checkEmpty(defaultAddress)) {
        return (
          <Pressable style={styles.chooseLocation} onPress={this.changeAddress}>
            <Text style={{ color: colors.white, fontSize: 12 }}>Select Delivery Address</Text>
          </Pressable>
        );
      }
    }
    return (
      <Pressable style={styles.chooseLocation} onPress={() => navigation.navigate('edit-address')}>
        <Text style={{ color: colors.white, fontSize: 12 }}>Select Delivery Address</Text>
      </Pressable>
    );
  };

  headerLeftComponentMenu = () => {
    const { navigation } = this.props;
    return (
      <View style={styles.headerLeftContainer}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuIcon}>
          <RNEIcon name="menu" type="material-community" color="white" size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  headerRightComponent = () => {
    const { navigation, myCartItems, route, addressData } = this.props;
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const isHome = routeName === 'home';
    const isCart = routeName === 'cart';
    const isPrivacy = routeName === 'privacy-policy' || routeName === 'tos';
    const isCheckout = routeName === 'checkout';
    const isPayment = routeName === 'payment';
    return (
      <View style={styles.headerRightContainer}>
        {!routeName || isHome ? this.conditionallyRenderDeliveryAddres(addressData) : null}
        {!isHome && !isCheckout && !isPayment && !isPrivacy ? (
          <TouchableOpacity
            onPress={() => this.mountSearch()}
            style={{
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <RNEIcon name="search" color="white" size={30} containerStyle={styles.padRight} />
          </TouchableOpacity>
        ) : null}
        {!isCart && !isCheckout && !isPayment && !isPrivacy ? (
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
      </View>
    );
  };

  render() {
    const { authenticated, route } = this.props;
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    const authRoutes = routeName === 'login' || routeName === 'verify-otp';
    const { initialRoute } = this.state;
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: (routeName && !authRoutes) || authenticated }}
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
          if (
            !authenticated &&
            (item.path === 'login' ||
              item.path === 'verify-otp' ||
              item.path === 'privacy-policy' ||
              item.path === 'tos')
          ) {
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
