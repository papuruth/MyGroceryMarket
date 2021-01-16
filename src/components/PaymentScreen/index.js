import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Pressable, View } from 'react-native';
import { Avatar, ButtonGroup, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Caption, Dialog, Divider, Portal, RadioButton, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import lottieAnimation from '@/assets/animation/order-success_3.json';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';
import { loaderStartAction, loaderStopAction } from '@/redux/loaderService/LoaderAction';
import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { sendNewOrderRequestNotificationAction } from '@/redux/notifications/NotificationActions';
import Storage from '@/utils/Storage';
import { CheckoutPriceContainer, StyledPaymentButton } from '../CheckoutScreen/styles';
import {
  OrderConfirmContainer,
  OrderDetailsHeading,
  OrderItemsContainer,
  OrderSuccessfullContainer,
  StyledContainer,
  StyledFlexRowView,
  StyledOrderDetailsContainer,
  StyledPaymentContainer,
  StyledPlaceOrderContainer,
  StyledTitle,
} from './styles';

export default class PaymentScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      openDialog: false,
      paymentMode: '',
      openOrderPlacedDialog: false,
    };
  }

  openPlaceOrderDialog = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleOrderPostAction = () => {};

  showProductDetais = ({ productId }) => {
    const { navigation } = this.props;
    navigation.navigate('product-details', { productId });
  };

  keyExtractor = (item) => item?.productId;

  renderItems = ({ item }) => (
    <ListItem
      bottomDivider
      pad={20}
      containerStyle={{
        marginVertical: 5,
        zIndex: -1,
        borderRadius: 5,
        alignItems: 'flex-start',
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
        <Avatar rounded size={50} title={item.product} source={{ uri: item.image }} />
      ) : (
        <Avatar
          rounded
          size={50}
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
      <ListItem.Chevron />
    </ListItem>
  );

  paymentModeSelect = () => {
    this.setState({
      paymentMode: 'COD',
    });
  };

  hideDialog = () => {
    this.setState({
      openDialog: false,
    });
  };

  placeOrder = async () => {
    const { route, user, dispatch } = this.props;
    try {
      dispatch(loaderStartAction());
      const { paymentMode } = this.state;
      const { params } = route || {};
      const {
        deliveryAddress,
        subTotal,
        myCartItems,
        deliveryDate,
        distributor,
        deliveryCharges,
        productsDiscount,
      } = params || {};
      const docRef = firestore()
        .collection('orders')
        .doc();
      const orderPayload = {
        orderId: docRef.id,
        deliveryAddress,
        paymentMode,
        subTotal,
        products: myCartItems,
        deliveryDate,
        deliveryCharges,
        productsDiscount,
        userDetails: user,
        distributorDetails: distributor,
        dateCreated: Date.now(),
        status: 'Pending',
        userId: user?.uid,
        distributorId: distributor?.distributorId,
      };
      const res = await docRef.set(orderPayload);
      if (!res) {
        const { fcm_token } = distributor;
        const notifPayload = {
          message: {
            tokens: fcm_token,
            notification: {
              body: `Hi! ${distributor?.name}, new order request received.`,
              title: 'New Order Request',
            },
            data: {
              route: 'orders',
            },
            android: {
              priority: 'HIGH',
            },
          },
        };
        dispatch(sendNewOrderRequestNotificationAction(notifPayload, distributor?.distributorId));
        if (!checkEmpty(myCartItems)) {
          await Storage.clearCart();
        }
        this.setState({
          openDialog: false,
          openOrderPlacedDialog: true,
        });
        dispatch(fetchMyCartItemsAction());
        dispatch(loaderStopAction());
      }
    } catch (e) {
      console.log(e?.message);
      dispatch(loaderStopAction());
    }
  };

  render() {
    const { route, user, navigation } = this.props;
    const { openDialog, paymentMode, openOrderPlacedDialog } = this.state;
    const { params } = route || {};
    const { deliveryAddress, subTotal, myCartItems, deliveryDate, distributor } = params || {};
    const address = !checkEmpty(deliveryAddress)
      ? `${deliveryAddress?.buildingName},\n${deliveryAddress?.street},\n${deliveryAddress?.city}, ${deliveryAddress?.state}.\n${deliveryAddress?.postalCode}`
      : '';
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        <StyledPaymentContainer style={{ flex: 1 }}>
          <FlatList
            style={{ width: '100%' }}
            data={myCartItems}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItems}
            ListHeaderComponent={(
              <OrderItemsContainer style={{ flex: 1 }}>
                <StyledOrderDetailsContainer
                  colors={['gray', 'black']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <OrderDetailsHeading>
                    <StyledTitle color={colors.white} textDecoration="underline" bold>
                      Order Details
                    </StyledTitle>
                  </OrderDetailsHeading>
                  <StyledTitle color={colors.white} size={20}>
                    Delivers to,
                  </StyledTitle>
                  <StyledTitle color={colors.white} size={18}>
                    {user?.displayName}
                  </StyledTitle>
                  <StyledTitle color={colors.white} size={18}>
                    {address}
                  </StyledTitle>
                  <StyledFlexRowView>
                    <StyledTitle color={colors.white} size={18} bold>
                      Delivery Date:
                    </StyledTitle>
                    <StyledTitle color={colors.white} size={18}>
                      {' '}
                      {deliveryDate}
                    </StyledTitle>
                  </StyledFlexRowView>
                  <StyledFlexRowView>
                    <StyledTitle color={colors.white} size={18} bold>
                      Distributor:
                    </StyledTitle>
                    <StyledTitle color={colors.white} size={18}>
                      {' '}
                      {distributor?.business || distributor?.name}
                    </StyledTitle>
                  </StyledFlexRowView>
                  <Divider style={{ backgroundColor: colors.white }} />
                  <StyledFlexRowView style={{ justifyContent: 'space-between' }}>
                    <StyledTitle color={colors.white} size={18} bold>
                      Subtotal:
                    </StyledTitle>
                    <StyledTitle color={colors.white} size={18}>
                      {currencyFormatter(subTotal)}
                    </StyledTitle>
                  </StyledFlexRowView>
                </StyledOrderDetailsContainer>
                <ButtonGroup
                  buttons={['Order Items']}
                  selectedIndex={0}
                  containerStyle={{ width: '100%' }}
                />
              </OrderItemsContainer>
            )}
          />
        </StyledPaymentContainer>
        <StyledPaymentButton>
          <Pressable
            style={{ width: '100%' }}
            onPress={this.openPlaceOrderDialog}
            android_ripple={{ color: 'gray', radius: 360 }}
          >
            <StyledPlaceOrderContainer>
              <StyledTitle color={colors.white} size={18}>
                Place Order
              </StyledTitle>
              <CheckoutPriceContainer>
                <StyledTitle color={colors.white} size={18}>
                  {currencyFormatter(subTotal)}
                </StyledTitle>
                <Icon name="arrow-right" size={20} color={colors.white} />
              </CheckoutPriceContainer>
            </StyledPlaceOrderContainer>
          </Pressable>
        </StyledPaymentButton>
        <Portal>
          <Dialog visible={openDialog} dismissable={false}>
            <Dialog.Title>Payment</Dialog.Title>
            <Dialog.Content>
              <OrderConfirmContainer>
                <Text>Select Payment Mode</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton
                    value={paymentMode}
                    uncheckedColor="red"
                    status={paymentMode === 'COD' ? 'checked' : 'unchecked'}
                    onPress={this.paymentModeSelect}
                  />
                  <Caption style={{ fontSize: 18, fontWeight: 'bold' }}>COD</Caption>
                </View>
              </OrderConfirmContainer>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                rounded
                style={{ marginLeft: 5 }}
                onPress={this.hideDialog}
                caption="Cancel"
              />
              <Button
                rounded
                style={{ marginLeft: 5 }}
                onPress={this.placeOrder}
                caption="Done"
                isDisabled={!paymentMode}
              />
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={openOrderPlacedDialog} dismissable={false}>
            <Dialog.Content>
              <OrderSuccessfullContainer>
                <LottieView source={lottieAnimation} autoPlay loop />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Successfully Placed</Text>
              </OrderSuccessfullContainer>
            </Dialog.Content>
            <Dialog.Actions
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginVertical: 5,
                height: 110,
                justifyContent: 'space-between',
              }}
            >
              <Button
                rounded
                style={{ width: '100%' }}
                onPress={() => {
                  this.setState(
                    {
                      openOrderPlacedDialog: false,
                    },
                    () => {
                      navigation.dispatch({
                        ...CommonActions.reset({
                          index: 1,
                          routes: [{ name: 'home' }, { name: 'my-orders' }],
                        }),
                      });
                    },
                  );
                }}
                caption="View Placed Orders"
              />
              <Button
                rounded
                style={{ width: '100%' }}
                onPress={() => {
                  this.setState(
                    {
                      openOrderPlacedDialog: false,
                    },
                    () => navigation.navigate('home'),
                  );
                }}
                caption="Continue Shopping"
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </StyledContainer>
    );
  }
}

PaymentScreen.propTypes = {
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
