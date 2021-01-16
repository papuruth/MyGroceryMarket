import { userLogout } from '@/redux/user/userAction';
import auth from '@react-native-firebase/auth';
import cc from 'currency-formatter';
import _ from 'lodash';
import moment from 'moment';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { sessionService } from 'redux-react-native-session';
import Storage from '../Storage';

export const checkEmpty = (data) => {
  return _.isEmpty(data);
};

export const equalityChecker = (param1, param2) => _.isEqual(param1, param2);

export const dateTimeFormater = (date, format) => moment(date).format(format);

const options = {
  maxWidth: 300,
  maxHeight: 200,
  mediaType: 'photo',
  quality: 1,
};

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info in the API Reference)
 */
export const imageSelector = () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        resolve(false);
      } else if (response.error) {
        reject(response.error);
      } else {
        resolve(response?.uri);
      }
      reject(new Error('Error picking photo'));
    });
  });
};

export const currencyFormatter = (price) => cc.format(price, { code: 'INR' });

export const handleLogout = async (props) => {
  try {
    const { dispatch, navigation } = props;
    dispatch(userLogout());
    await sessionService.deleteSession();
    await sessionService.deleteUser();
    await Storage.removeToken();

    await auth().signOut();
    Alert.alert(
      'Success',
      'You have logged out successfully!',
      [{ text: 'OK', onPress: () => navigation.navigate('login') }],
      { cancelable: false },
    );
  } catch (e) {
    console.log(e?.message);
  }
};

export const multiFilter = (item, condition) => {
  const filterKeys = Object.keys(condition);
  return item.filter((eachObj) =>
    filterKeys.some((eachKey) => {
      if (!condition[eachKey].length) {
        return true; // passing an empty filter means that filter is ignored.
      }
      // Checking for case and as well as matching the filter condition with items
      // if matches returns true else false
      return eachObj[eachKey]
        .toString()
        .toLowerCase()
        .includes(condition[eachKey].toString().toLowerCase());
    }),
  );
};

/**
 *
 * @param {object} item The product to add to cart
 * @param {array} cartItems My Cart items list
 * @param {string} action Action to perform either add to cart or remove from cart
 * @returns {promise} Return a promise the cart is updated.
 * @async
 */
export const handleCartLogic = async (item, cartItems, action) => {
  try {
    if (action === 'add') {
      const itemExist = 'cart' in item;
      if (itemExist) {
        const { cart } = item;
        if (cart.itemCount < 5) {
          cart.itemCount += 1;
          const copyCartItems = cartItems;
          const itemInCart = copyCartItems.findIndex((ele) => ele?.productId === cart?.productId);
          copyCartItems.splice(itemInCart, 1, cart);
          await Storage.addToCart(copyCartItems);
          return {
            status: true,
            message: 'success',
          };
        }
        throw Error('You can only add 5 of this product.');
      }
      const newCartItem = {
        productId: item?._id,
        name: item?.product,
        price: item?.price,
        image: item?.image,
        total: item?.total,
        itemCount: 1,
      };
      const myCartItem = cartItems ?? [];
      await Storage.addToCart([...myCartItem, newCartItem]);
      return {
        status: true,
        message: 'success',
      };
    }
    const itemExist = 'cart' in item;
    if (itemExist) {
      const { cart } = item;
      const copyCartItems = cartItems;
      cart.itemCount -= 1;
      if (cart?.itemCount > 0) {
        const itemInCart = copyCartItems.findIndex((ele) => ele?.productId === cart?.productId);
        copyCartItems.splice(itemInCart, 1, cart);
        await Storage.addToCart(copyCartItems);
        return {
          status: true,
          message: 'success',
        };
      }
      const itemInCart = copyCartItems.findIndex((ele) => ele?.productId === cart?.productId);
      copyCartItems.splice(itemInCart, 1);
      await Storage.addToCart(copyCartItems);
      return {
        status: true,
        message: 'success',
      };
    }
    throw Error('Cart Update Failed.');
  } catch (e) {
    return {
      status: false,
      message: e?.message,
    };
  }
};
