import { handleLogout } from '@/utils/commonFunctions';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../styles';
import APP_CONSTANTS from '../utils/appConstants/AppConstants';
import { Button } from '../utils/reusableComponents';

const {
  IMAGES: { iconDrawerHome, iconTabBooking, iconWallet },
} = APP_CONSTANTS;

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: colors.WHITE,
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  userName: {
    color: colors.WHITE,
    fontSize: 18,
  },
  divider: {
    borderBottomColor: colors.WHITE,
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    width: 60,
    height: 60,
    borderColor: colors.WHITE,
    borderWidth: 1,
    borderRadius: 30,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 10,
    marginBottom: 10,
  },
});

const drawerData = [
  {
    name: 'Home',
    path: 'home',
    icon: iconDrawerHome,
  },
  {
    name: 'My Orders',
    path: 'my-orders',
    icon: iconTabBooking,
  },
  {
    name: 'My Cart',
    path: 'cart',
    icon: <Icon name="cart-plus" color="white" size={15} containerStyle={styles.padRight} />,
  },
  {
    name: 'Address Book',
    path: 'edit-address',
    icon: iconWallet,
  },
];

export default function RenderDrawer(props) {
  const {
    IMAGES: { iconLogout, background },
  } = APP_CONSTANTS;
  const { navigation, authenticated, user } = props;
  return (
    <ImageBackground source={background} style={{ width: '100%', height: '100%' }}>
      <DrawerContentScrollView {...props}>
        <View>
          {authenticated ? (
            <View style={styles.avatarContainer}>
              <Pressable onPress={() => navigation.navigate('profile')}>
                {user?.photoURL ? (
                  <Avatar.Image style={styles.avatar} source={{ uri: user?.photoURL }} />
                ) : (
                  <Avatar.Text
                    style={styles.avatarText}
                    label={user?.displayName && user?.displayName.slice(0, 1)}
                  />
                )}
              </Pressable>
              <View style={{ paddingLeft: 15 }}>
                <Text style={styles.userName}>{`Hi! ${user?.displayName}`}</Text>
                <Text style={{ color: '#4BC1FD' }}>{user?.phoneNumber}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <TouchableHighlight onPress={() => navigation.navigate('login')}>
                <Avatar.Icon style={styles.avatarText} icon="account" />
              </TouchableHighlight>
              <View style={{ paddingLeft: 15 }}>
                <Text style={styles.userName}>Welcome, Guest!</Text>
              </View>
            </View>
          )}
          {authenticated ? (
            <View style={styles.buttonContainer}>
              <Button
                bordered
                rounded
                caption="Logout"
                icon={iconLogout}
                onPress={() => handleLogout(props)}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.divider} />
        {drawerData.map((item, idx) => (
          <DrawerItem
            key={`drawer_item-${idx + 1}`}
            label={() => (
              <View style={styles.menuLabelFlex}>
                {typeof item?.icon === 'object' ? (
                  item?.icon
                ) : (
                  <Image style={{ width: 20, height: 20 }} source={item.icon} />
                )}
                <Text style={styles.menuTitle}>{item.name}</Text>
              </View>
            )}
            onPress={() => navigation.navigate(item.path)}
          />
        ))}
        {/* <View style={styles.divider} />
        <DrawerItem
          label={() => (
            <View style={styles.menuLabelFlex}>
              <Image style={{ width: 20, height: 20 }} source={iconSettings} />
              <Text style={styles.menuTitle}>Settings</Text>
            </View>
          )}
          onPress={() => navigation.navigate('setting')}
        /> */}
      </DrawerContentScrollView>
    </ImageBackground>
  );
}

RenderDrawer.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
