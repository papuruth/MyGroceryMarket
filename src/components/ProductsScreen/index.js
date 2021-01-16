import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { fetchProductsAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter, handleCartLogic } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  AddToCartButtonContainer,
  ProductsContainer,
  StyledContainer,
  StyledFlatList,
  StyledTitle,
} from './styles';

export default class ProductsScreen extends React.PureComponent {
  componentDidMount() {
    this.fetchProducts(this.props);
  }

  fetchProducts = (props) => {
    const { route, dispatch, user } = props;
    const { params } = route || {};
    const { data } = params || {};
    if (!checkEmpty(data)) {
      const { category } = data || {};
      if (category) {
        dispatch(loaderStartAction());
        dispatch(fetchProductsAction(category));
        dispatch(fetchMyCartItemsAction(user?.uid));
      }
    }
  };

  keyExtractor = (item, index) => index.toString();

  showProductDetais = (data) => {
    const { navigation } = this.props;
    navigation.navigate('product-details', { productId: data?._id });
  };

  renderList = (item) => (
    <ListItem
      bottomDivider
      pad={10}
      containerStyle={{ marginVertical: 5, zIndex: -1, borderRadius: 5, flex: 1 }}
      accessible
      onPressOut={() => this.showProductDetais(item)}
      onPress={() => {}}
      linearGradientProps={{
        colors: [colors.primaryGradientStart, colors.primary],
        start: { x: 1, y: 0 },
        end: { x: 0.2, y: 0 },
      }}
      ViewComponent={LinearGradient}
    >
      {item.image ? (
        <Avatar rounded size={100} title={item.product} source={{ uri: item.image }} />
      ) : (
        <Avatar
          rounded
          size={100}
          icon={{ name: 'image-broken', type: 'material-community', color: colors.black }}
          iconStyle={{ color: colors.black }}
          avatarStyle={{ backgroundColor: '#ededed', zIndex: -1 }}
        />
      )}
      <ListItem.Content style={{ marginLeft: 20 }}>
        <ListItem.Title style={{ color: colors.white }}>
          {currencyFormatter(item.price)}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: colors.white }}>{item.product}</ListItem.Subtitle>
        <ListItem.Subtitle style={{ color: colors.white }}>
          {`${item.quantity} ${item.unit}`}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content
        style={{
          marginLeft: 20,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          height: '100%',
          width: '100%',
        }}
      >
        <AddToCartButtonContainer>
          {item?.cart?.itemCount ? (
            <Button
              bgColor={colors.yellow}
              textColor={colors.black}
              caption="-"
              onPress={() => this.removeFromCart(item)}
            />
          ) : null}
          {item?.cart?.itemCount ? (
            <StyledTitle style={{ paddingHorizontal: 15 }}>{item?.cart?.itemCount}</StyledTitle>
          ) : null}
          {!item?.cart?.itemCount ? (
            <Button
              bgColor={colors.yellow}
              textColor={colors.black}
              caption="Add"
              onPress={() => this.addToCartPlus(item)}
            />
          ) : null}
          <Button
            bgColor={colors.yellow}
            textColor={colors.black}
            caption="+"
            onPress={() => this.addToCartPlus(item)}
          />
        </AddToCartButtonContainer>
      </ListItem.Content>
    </ListItem>
  );

  conditionalRenderItem = ({ item }) => {
    const { myCartItems } = this.props;
    const itemaddedToCart = !checkEmpty(myCartItems)
      ? myCartItems.findIndex((cartItem) => cartItem?.productId === item?._id)
      : -1;
    let copyItem = {};
    if (itemaddedToCart > -1) {
      copyItem = { ...item };
      copyItem.cart = myCartItems[itemaddedToCart];
    }
    return !checkEmpty(copyItem) ? this.renderList(copyItem) : this.renderList(item);
  };

  addToCartPlus = async (item) => {
    try {
      const { myCartItems, dispatch } = this.props;
      const res = await handleCartLogic(item, myCartItems, 'add');
      if (res?.status) {
        dispatch(fetchMyCartItemsAction());
      } else {
        throw Error(res?.message);
      }
    } catch (e) {
      Alert.alert('Info', e?.message);
    }
  };

  removeFromCart = async (item) => {
    try {
      const { myCartItems, dispatch } = this.props;
      const res = await handleCartLogic(item, myCartItems, 'remove');
      if (res?.status) {
        dispatch(fetchMyCartItemsAction());
      } else {
        throw Error(res?.message);
      }
    } catch (e) {
      console.log(e?.message);
    }
  };

  render() {
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const { products, route } = this.props;
    const { params } = route || {};
    const { data } = params || {};
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        {!checkEmpty(products) ? (
          <ProductsContainer style={{ flex: 1 }}>
            <StyledFlatList
              keyExtractor={this.keyExtractor}
              data={products}
              renderItem={this.conditionalRenderItem}
            />
          </ProductsContainer>
        ) : (
          <StyledTitle style={{ textAlign: 'center' }}>
            No Products in the catgory {data?.category}
          </StyledTitle>
        )}
      </StyledContainer>
    );
  }
}

ProductsScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  myCartItems: PropTypes.oneOfType([PropTypes.array]).isRequired,
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
  products: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
