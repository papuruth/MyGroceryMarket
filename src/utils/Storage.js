import AsyncStorage from '@react-native-community/async-storage';

const storageKeys = {
  token: 'accessToken',
  cartItems: 'myCartItems',
};

export default {
  // Token
  setToken: async (token) => {
    try {
      await AsyncStorage.setItem(storageKeys.token, token);
    } catch (e) {
      console.log('Token saving error', e);
    }
  },
  getToken: async () => {
    try {
      const value = await AsyncStorage.getItem(storageKeys.token);
      return value;
    } catch (e) {
      return null;
    }
  },
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(storageKeys.token);
    } catch (e) {
      console.log('Error removing token', e);
    }
  },
  addToCart: async (data) => {
    try {
      await AsyncStorage.setItem(storageKeys.cartItems, JSON.stringify(data));
      return true;
    } catch (e) {
      console.log(e?.message);
      return false;
    }
  },
  getCartItems: async () => {
    try {
      return await AsyncStorage.getItem(storageKeys.cartItems);
    } catch (e) {
      console.log(e?.message);
      return false;
    }
  },
  clearCart: async () => {
    try {
      await AsyncStorage.removeItem(storageKeys.cartItems);
      return true;
    } catch (e) {
      console.log(e?.message);
      return false;
    }
  },
  clearStorage: async () => {
    try {
      await AsyncStorage.multiRemove(['root', 'accessToken']);
    } catch (e) {
      console.log('Error clearing storage');
    }
  },
};
