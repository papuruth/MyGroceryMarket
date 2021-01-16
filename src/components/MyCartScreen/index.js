import cartEmpty from '@/assets/animation/cart.json';
import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter, handleCartLogic } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { Avatar, ButtonGroup, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AddToCartButtonContainer,
  CartItemsContainer,
  CheckoutPriceContainer,
  StyledCardActions,
  StyledCardContent,
  StyledCardContentLeft,
  StyledCardContentRight,
  StyledCartCardContainer,
  StyledCartContainer,
  StyledCheckoutButton,
  StyledCheckoutContainer,
  StyledContainer,
  StyledEmptyCartAction,
  StyledEmptyCartContainer,
  StyledTitle,
} from './styles';

export default class MyCartScreen extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      deliveryCharges: 15,
      productsDiscount: 0,
    };
  }

  componentDidMount() {
    this.fetchMyCartItem(this.props);
  }

  fetchMyCartItem = (props) => {
    const { dispatch, user } = props;
    dispatch(loaderStartAction());
    dispatch(fetchMyCartItemsAction(user?.uid));
  };

  keyExtractor = (item) => item?.productId.toString();

  showProductDetais = ({ productId }) => {
    const { navigation } = this.props;
    navigation.navigate('product-details', { productId });
  };

  addToCartPlus = async (item) => {
    try {
      const { myCartItems, dispatch } = this.props;
      const res = await handleCartLogic({ cart: item }, myCartItems, 'add');
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
      const res = await handleCartLogic({ cart: item }, myCartItems, 'remove');
      if (res?.status) {
        dispatch(fetchMyCartItemsAction());
      } else {
        throw Error(res?.message);
      }
    } catch (e) {
      console.log(e?.message);
    }
  };

  renderList = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        pad={20}
        containerStyle={{
          marginVertical: 5,
          zIndex: -1,
          height: 120,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
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
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: colors.white,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {currencyFormatter(item?.price)}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: colors.white, marginTop: 10 }}>
            {item.name}
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
            {item.itemCount ? (
              <Button
                bgColor={colors.yellow}
                textColor={colors.black}
                caption="-"
                onPress={() => this.removeFromCart(item)}
              />
            ) : null}
            {item.itemCount ? (
              <StyledTitle style={{ paddingHorizontal: 15 }}>{item.itemCount}</StyledTitle>
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
  };

  render() {
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const { myCartItems, navigation } = this.props;
    const { deliveryCharges, productsDiscount } = this.state;
    const totalCartMRP = !checkEmpty(myCartItems)
      ? myCartItems.reduce((acc, currVal) => acc + currVal.price * currVal.itemCount, 0)
      : 0;
    const subTotal = totalCartMRP + deliveryCharges - productsDiscount;
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        <StyledCartContainer style={{ flex: 1 }}>
          {!checkEmpty(myCartItems) ? (
            <CartItemsContainer style={{ flex: 1 }}>
              <FlatList
                style={{ width: '100%' }}
                data={myCartItems}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderList}
                ListHeaderComponent={(
                  <CartItemsContainer>
                    <StyledCartCardContainer
                      colors={['gray', 'black']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <StyledCardContent>
                        <StyledCardContentLeft>
                          <StyledTitle>M.R.P.</StyledTitle>
                          <StyledTitle>Products Discount</StyledTitle>
                          <StyledTitle>Delivery Charges</StyledTitle>
                        </StyledCardContentLeft>
                        <StyledCardContentRight>
                          <StyledTitle>{currencyFormatter(totalCartMRP)}</StyledTitle>
                          <StyledTitle>{currencyFormatter(productsDiscount)}</StyledTitle>
                          <StyledTitle
                            style={{ color: deliveryCharges > 0 ? colors.white : colors.SUCCESS }}
                          >
                            {deliveryCharges > 0 ? currencyFormatter(deliveryCharges) : 'Free'}
                          </StyledTitle>
                        </StyledCardContentRight>
                      </StyledCardContent>
                      <Divider style={{ backgroundColor: colors.white }} />
                      <StyledCardActions>
                        <StyledTitle>Sub total</StyledTitle>
                        <StyledTitle>{currencyFormatter(subTotal)}</StyledTitle>
                      </StyledCardActions>
                    </StyledCartCardContainer>
                    <ButtonGroup
                      buttons={['Cart Items']}
                      containerStyle={{ height: 50, width: '100%' }}
                      selectedIndex={0}
                    />
                  </CartItemsContainer>
                )}
              />
            </CartItemsContainer>
          ) : (
            <StyledEmptyCartContainer>
              <LottieView source={cartEmpty} autoPlay style={{ height: 100, width: '100%' }} />
              <StyledEmptyCartAction>
                <StyledTitle>No items in your cart</StyledTitle>
                <StyledTitle>Your favourite items are just a click away</StyledTitle>
                <Button
                  bordered
                  caption="Start Shopping"
                  onPress={() => navigation.navigate('home')}
                />
              </StyledEmptyCartAction>
            </StyledEmptyCartContainer>
          )}
        </StyledCartContainer>
        {!checkEmpty(myCartItems) ? (
          <StyledCheckoutButton>
            <Pressable
              style={{ width: '100%' }}
              onPress={() =>
                navigation.navigate('checkout', {
                  subTotal,
                  myCartItems,
                  deliveryCharges,
                  productsDiscount,
                })}
              android_ripple={{ color: 'gray', radius: 360 }}
            >
              <StyledCheckoutContainer>
                <StyledTitle>Checkout</StyledTitle>
                <CheckoutPriceContainer>
                  <StyledTitle>{currencyFormatter(subTotal)}</StyledTitle>
                  <Icon name="arrow-right" size={20} color={colors.white} />
                </CheckoutPriceContainer>
              </StyledCheckoutContainer>
            </Pressable>
          </StyledCheckoutButton>
        ) : null}
      </StyledContainer>
    );
  }
}

MyCartScreen.propTypes = {
  myCartItems: PropTypes.oneOfType([PropTypes.array]).isRequired,
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
