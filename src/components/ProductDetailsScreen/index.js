import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { fetchProductDetailsAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter, handleCartLogic } from '@/utils/commonFunctions';
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
  constructor() {
    super();
    this.state = {
      tabsSelected: 0,
      expandedList: new Map(),
      productDetails: {},
    };
  }

  static getDerivedStateFromProps(props) {
    const { myCartItems, productDetails } = props;
    if (!checkEmpty(productDetails)) {
      const productExist = myCartItems.findIndex((item) => item.productId === productDetails?._id);
      if (productExist > -1) {
        const copyProduct = { ...productDetails };
        copyProduct.cart = myCartItems[productExist];
        return {
          productDetails: copyProduct,
        };
      }
      return {
        productDetails,
      };
    }
    return null;
  }

  componentDidMount() {
    this.fetchProductDetails(this.props);
  }

  fetchProductDetails = (props, action) => {
    const { route, dispatch, user } = props;
    const { params } = route || {};
    const { productId } = params || {};
    dispatch(loaderStartAction());
    dispatch(fetchProductDetailsAction(productId, action));
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
        this.fetchProductDetails(this.props, 'update');
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
          this.fetchProductDetails(this.props, 'update');
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
          this.fetchProductDetails(this.props, 'update');
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

  getProductRating = (ratings) => {
    const { user } = this.props;
    const { averageRatings, data, totalRatings } = ratings || {};
    const userHasRated = !checkEmpty(data) ? data.some((item) => item.userId === user?.uid) : false;
    if (!userHasRated) {
      return (
        <Rating
          startingValue={0}
          totalRating={totalRatings}
          fractions={2}
          showRating
          isDisabled={false}
          starSize={20}
          onFinishRating={(rating) => this.ratingUserConsent(rating)}
        />
      );
    }
    return (
      <Rating
        startingValue={averageRatings}
        totalRating={ratings?.totalRatings}
        fractions={2}
        showRating
        isDisabled={
          !checkEmpty(ratings?.data)
            ? ratings.data.some((item) => item.userId === user?.uid)
            : false
        }
        starSize={20}
        onFinishRating={(rating) => this.ratingUserConsent(rating)}
      />
    );
  };

  render() {
    const { tabsSelected, expandedList, productDetails } = this.state;
    const { image, _id, product, price, quantity, unit, features, ratings, cart } =
      productDetails || {};

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
                  <StyledTitle size={16}>Rs. {currencyFormatter(price)}</StyledTitle>
                </View>
                <StyledSubtitle>(inclusive of all taxes)</StyledSubtitle>
                <StyledSubtitle>Unit: {`${quantity} ${unit}`}</StyledSubtitle>
              </ProductDetailsLeft>
              <ProductDetailsRight>
                {this.getProductRating(ratings)}
                <AddToCartButtonContainer>
                  {!checkEmpty(cart) ? (
                    <Button
                      bgColor={colors.yellow}
                      textColor={colors.black}
                      caption="-"
                      onPress={() => this.removeFromCart(productDetails)}
                    />
                  ) : null}
                  {!checkEmpty(cart) ? (
                    <StyledTitle style={{ paddingHorizontal: 15 }}>{cart?.itemCount}</StyledTitle>
                  ) : null}
                  {!cart ? (
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
