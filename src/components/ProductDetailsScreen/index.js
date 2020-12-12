import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { fetchProductDetailsAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, equalityChecker } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import Rating from '@/utils/reusableComponents/Ratings';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert, View } from 'react-native';
import { Avatar, ButtonGroup, Divider } from 'react-native-elements';
import { List } from 'react-native-paper';
import {
  AddToCartButtonContainer,
  ProductDetailsContent,
  ProductDetailsLeft,
  ProductDetailsRight,
  ProductExtraDetails,
  ProductImageContainer,
  ScrollContainer,
  StyledContainer,
  StyledImage,
  StyledSubtitle,
  StyledTitle,
} from './styles';

export default class ProductDetailsScreen extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      tabsSelected: 0,
      expandedList: new Map(),
      productInCart: {},
      productCount: 0,
    };
    this.fetchProductDetails(props);
  }

  componentDidMount() {
    this.fetchProductDetails(this.props);
    this.getProductCount();
  }

  componentDidUpdate(prevProps) {
    const { myCartItems } = this.props;
    if (!equalityChecker(myCartItems, prevProps.myCartItems)) {
      this.getProductCount();
    }
  }

  getProductCount = () => {
    const { myCartItems, route } = this.props;
    const { params } = route || {};
    const { productId } = params || {};
    if (!checkEmpty(myCartItems)) {
      const productExist = myCartItems.findIndex((item) => item.productId === productId);
      if (productExist > -1) {
        this.setState({
          productCount: myCartItems[productExist].itemCount,
          productInCart: myCartItems[productExist],
        });
      }
    }
  };

  fetchProductDetails = (props) => {
    const { route, dispatch, user } = props;
    const { params } = route || {};
    const { productId } = params || {};
    dispatch(loaderStartAction());
    dispatch(fetchProductDetailsAction(productId));
    dispatch(fetchMyCartItemsAction(user?.uid));
  };

  ratingUserConsent = (rating) => {
    Alert.alert('Rate Product', 'Would you like to rate this product?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Yes', onPress: () => this.rateProduct(rating) },
    ]);
  };

  rateProduct = async (rating) => {
    const { route, user } = this.props;
    const { params } = route || {};
    const { productId } = params || {};
    const doc = await firestore()
      .collection('products')
      .doc(productId)
      .get();
    const product = doc.data();
    const copyProduct = { ...product };
    if (!('ratings' in copyProduct)) {
      copyProduct.ratings = {
        data: [],
        totalRatings: 0,
        averageRatings: 0,
      };
      copyProduct.ratings.data.push({
        rating,
        userId: user?.uid,
      });
      copyProduct.ratings.totalRatings = copyProduct.ratings.data.length;
      const averageRatings = copyProduct.ratings.data.reduce((acc, item) => {
        return item.rating + acc;
      }, 0);
      copyProduct.ratings.averageRatings = averageRatings / copyProduct.ratings.totalRatings;
      const res = await firestore()
        .collection('products')
        .doc(productId)
        .update(copyProduct);
      if (!res) {
        this.fetchProductDetails(this.props);
      }
    } else {
      const ratingExists = copyProduct.ratings.data.findIndex((item) => item.userId === user?.uid);
      if (ratingExists > -1) {
        copyProduct.ratings.data[ratingExists].rating = rating;
        copyProduct.ratings.totalRatings = copyProduct.ratings.data.length;
        const averageRatings = copyProduct.ratings.data.reduce((acc, item) => {
          return item.rating + acc;
        }, 0);
        copyProduct.ratings.averageRatings = averageRatings / copyProduct.ratings.totalRatings;
        const res = await firestore()
          .collection('products')
          .doc(productId)
          .update(copyProduct);
        if (!res) {
          this.fetchProductDetails(this.props);
        }
      } else {
        copyProduct.ratings.data.push({
          rating,
          userId: user?.uid,
        });
        copyProduct.ratings.totalRatings = copyProduct.ratings.data.length;
        const averageRatings = copyProduct.ratings.data.reduce((acc, item) => {
          return item.rating + acc;
        }, 0);
        copyProduct.ratings.averageRatings = averageRatings / copyProduct.ratings.totalRatings;
        const res = await firestore()
          .collection('products')
          .doc(productId)
          .update(copyProduct);
        if (!res) {
          this.fetchProductDetails(this.props);
        }
      }
    }
  };

  handlePress = (item) => {
    this.setState((state) => {
      const mapToObj = Object.fromEntries(state.expandedList);
      if (!checkEmpty(mapToObj)) {
        Object.keys(mapToObj).forEach((k) => {
          if (k === item) {
            if (mapToObj[k]) {
              Object.assign(mapToObj, { [k]: false });
            } else {
              Object.assign(mapToObj, { [k]: true });
            }
          } else if (!(item in mapToObj)) {
            Object.assign(mapToObj, { [item]: true });
          } else {
            Object.assign(mapToObj, { [k]: false });
          }
        });
      } else {
        Object.assign(mapToObj, { [item]: true });
      }
      return {
        expandedList: new Map(Object.entries(mapToObj)),
      };
    }, this.forceUpdate());
  };

  removeFromCart = () => {
    this.setState(
      (state) => {
        if (!checkEmpty(state.productInCart) && state.productCount > 0) {
          const product = { ...state.productInCart };
          product.itemCount -= 1;
          return {
            productInCart: product,
            productCount: state.productCount - 1,
          };
        }
        return state;
      },
      () => this.updateGlobalCart('update'),
    );
    this.forceUpdate();
  };

  addToCartPlus = (data) => {
    let action = 'new';
    this.setState(
      (state) => {
        if (state.productCount < data?.total) {
          if (!checkEmpty(state.productInCart) && state.productCount > 0) {
            const product = { ...state.productInCart };
            product.itemCount += 1;
            action = 'update';
            return {
              productInCart: product,
              productCount: state.productCount + 1,
            };
          }
          const newCartItem = {
            productId: data?._id,
            name: data?.product,
            price: data?.price,
            image: data?.image,
            total: data?.total,
            itemCount: 1,
          };
          return {
            productInCart: newCartItem,
            productCount: state.productCount + 1,
          };
        }
        Alert.alert('Info', 'Product quantity exhausted.');
        return state;
      },
      () => this.updateGlobalCart(action),
    );
    this.forceUpdate();
  };

  updateGlobalCart = async (action) => {
    try {
      const { productInCart } = this.state;
      const { dispatch, user } = this.props;
      const product = { ...productInCart };
      if (action === 'new') {
        const docRef = firestore()
          .collection('my-cart')
          .doc(user?.uid)
          .collection('cart-items')
          .doc();
        product._id = docRef.id;
        const res = await docRef.set(product);
        if (!res) {
          dispatch(fetchMyCartItemsAction(user?.uid));
        }
      } else if (action === 'update') {
        if (product?.itemCount > 0) {
          const res = await firestore()
            .collection('my-cart')
            .doc(user?.uid)
            .collection('cart-items')
            .doc(product?._id)
            .update(product);
          if (!res) {
            dispatch(fetchMyCartItemsAction(user?.uid));
          }
        } else {
          const res = await firestore()
            .collection('my-cart')
            .doc(user?.uid)
            .collection('cart-items')
            .doc(product?._id)
            .delete();
          if (!res) {
            dispatch(fetchMyCartItemsAction(user?.uid));
            this.setState({
              productCount: 0,
            });
          }
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Oops! Unable to add product to cart.');
    }
  };

  render() {
    const { productDetails, user } = this.props;
    const { tabsSelected, expandedList, productCount } = this.state;
    const { image, _id, product, price, quantity, unit, features, ratings } = productDetails || {};
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    return (
      <StyledContainer source={background} key={_id}>
        {!checkEmpty(productDetails) ? (
          <ScrollContainer
            contentContainerStyle={{
              alignItems: 'center',
            }}
          >
            <ProductImageContainer>
              {image ? (
                <StyledImage source={{ uri: image }} />
              ) : (
                <Avatar
                  size={200}
                  icon={{ name: 'image-broken', type: 'material-community', color: colors.black }}
                  iconStyle={{ color: colors.black }}
                  avatarStyle={{ backgroundColor: '#ededed', zIndex: -1 }}
                />
              )}
            </ProductImageContainer>
            <Divider style={{ height: 1, backgroundColor: colors.white, width: '100%' }} />
            <ProductDetailsContent>
              <ProductDetailsLeft>
                <StyledTitle size={20}>{product}</StyledTitle>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <StyledSubtitle>Product MRP: </StyledSubtitle>
                  <StyledTitle size={16}>Rs. {price}</StyledTitle>
                </View>
                <StyledSubtitle>(inclusive of all taxes)</StyledSubtitle>
                <StyledSubtitle>Unit: {`${quantity} ${unit}`}</StyledSubtitle>
              </ProductDetailsLeft>
              <ProductDetailsRight>
                <Rating
                  startingValue={ratings.averageRatings || 0}
                  totalRating={ratings.totalRatings}
                  fractions={2}
                  showRating
                  isDisabled={
                    !checkEmpty(ratings?.data)
                      ? ratings.data.some((item) => item.userId === user?.uid)
                      : false
                  }
                  starSize={15}
                  onFinishRating={(rating) => this.ratingUserConsent(rating)}
                />
                <AddToCartButtonContainer>
                  {productCount ? (
                    <Button
                      bgColor={colors.yellow}
                      textColor={colors.black}
                      caption="-"
                      onPress={() => this.removeFromCart(productDetails)}
                    />
                  ) : null}
                  {productCount ? (
                    <StyledTitle style={{ paddingHorizontal: 15 }}>{productCount}</StyledTitle>
                  ) : null}
                  {!productCount ? (
                    <Button
                      bgColor={colors.yellow}
                      textColor={colors.black}
                      caption="Add"
                      onPress={() => this.addToCartPlus(productDetails)}
                    />
                  ) : null}
                  <Button
                    bgColor={colors.yellow}
                    textColor={colors.black}
                    caption="+"
                    onPress={() => this.addToCartPlus(productDetails)}
                  />
                </AddToCartButtonContainer>
              </ProductDetailsRight>
            </ProductDetailsContent>
            {!checkEmpty(features) ? (
              <ProductExtraDetails>
                <ButtonGroup
                  buttons={['Highlights']}
                  containerStyle={{ height: 50, width: '100%' }}
                  selectedIndex={tabsSelected}
                />
                <List.Section style={{ width: '100%' }}>
                  {features.map((item) => (
                    <List.Accordion
                      key={item.key}
                      title={item.key}
                      titleStyle={{ color: colors.white }}
                      expanded={expandedList.get(item.key)}
                      onPress={() => this.handlePress(item.key)}
                    >
                      <List.Item
                        title={item.value}
                        titleStyle={{ color: colors.black }}
                        titleNumberOfLines={4}
                      />
                    </List.Accordion>
                  ))}
                </List.Section>
              </ProductExtraDetails>
            ) : null}
          </ScrollContainer>
        ) : (
          <StyledTitle>No Data Found</StyledTitle>
        )}
      </StyledContainer>
    );
  }
}

ProductDetailsScreen.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
  productDetails: PropTypes.oneOfType([PropTypes.object]).isRequired,
  myCartItems: PropTypes.oneOfType([PropTypes.array]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
