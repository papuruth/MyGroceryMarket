import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { fetchAllDistributorsAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import DropDown from '@/utils/reusableComponents/Dropdown';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CheckoutPriceContainer,
  StyledAddressContainer,
  StyledAddressLeftContent,
  StyledAddressRightContent,
  StyledCheckoutContainer,
  StyledContainer,
  StyledDateTimeContainer,
  StyledDistributorContainer,
  StyledPaymentButton,
  StyledPaymentContainer,
  StyledTitle,
} from './styles';

export default class CheckoutScreen extends PureComponent {
  constructor() {
    super();
    const { TIME_SLOTS } = APP_CONSTANTS;
    this.state = {
      selectedDistributorIndex: -1,
      selectedDate: moment(),
      selectedSlots: new Map(),
      slots: TIME_SLOTS,
    };
  }

  componentDidMount() {
    this.fetchInitialData(this.props);
  }

  fetchInitialData = (props) => {
    const { dispatch } = props;
    dispatch(loaderStartAction());
    dispatch(fetchAllDistributorsAction());
  };

  handleDistributorSelect = (index) => {
    this.setState({
      selectedDistributorIndex: index,
    });
  };

  onWeekChanged = () => {
    this.setState(
      {
        selectedSlots: new Map(),
        selectedDate: moment(),
      },
      () => this.forceUpdate(),
    );
  };

  handleSelectedSlots = (data) => {
    this.setState(
      (state) => ({
        selectedSlots: state.selectedSlots.set('slots', data),
      }),
      () => this.forceUpdate(),
    );
  };

  gotoPaymentPage = () => {
    const { selectedDate, selectedSlots, selectedDistributorIndex } = this.state;
    const { navigation, route, addressData, allDistributors } = this.props;
    const { params } = route || {};
    const { subTotal, myCartItems, deliveryCharges, productsDiscount } = params || {};
    const deliveryAddress = !checkEmpty(addressData)
      ? addressData.filter((item) => item.isDefault)[0]
      : {};
    const deliveryDate = selectedDate.format('ddd, D MMM, ').concat(selectedSlots.get('slots'));
    const filteredDistributor = allDistributors.filter(
      (item) => item?.city === deliveryAddress?.city,
    );
    const distributor = filteredDistributor[selectedDistributorIndex];
    if (
      !checkEmpty(myCartItems) &&
      !checkEmpty(deliveryAddress) &&
      deliveryDate &&
      !checkEmpty(distributor) &&
      subTotal &&
      selectedSlots?.size
    ) {
      navigation.navigate('payment', {
        subTotal,
        myCartItems,
        deliveryAddress,
        deliveryDate,
        distributor,
        deliveryCharges,
        productsDiscount,
      });
    } else if (checkEmpty(deliveryAddress)) {
      Alert.alert('Info', 'Delivery address is missing.');
    } else if (!distributor && checkEmpty(distributor)) {
      Alert.alert('Info', 'Please select a distributor.');
    } else if (!selectedSlots.size) {
      Alert.alert('Info', 'Please select a delivery time.');
    }
  };

  getMaxDate = () => {
    return moment().set({ date: moment().date() + 7 });
  };

  datesBlacklist = (date) => {
    const isCurrentDate = date.date() === moment().date();
    if (isCurrentDate) {
      return false;
    }
    return date.unix() < moment().unix();
  };

  getSelectedDate = (data) => {
    const { slots } = this.state;
    const updatedSlots = slots.map((item) => {
      const copyItem = { ...item };
      const startHour = moment(copyItem.start).hours();
      const endHour = moment(copyItem.end).hours();
      copyItem.start =
        data.set({ hour: startHour, minute: 0, second: 0, millisecond: 0 }).unix() * 1000;
      copyItem.end =
        data.set({ hour: endHour, minute: 0, second: 0, millisecond: 0 }).unix() * 1000;
      return copyItem;
    });
    this.setState({
      selectedDate: data,
      slots: updatedSlots,
    });
  };

  changeAddress = () => {
    const { navigation } = this.props;
    navigation.navigate('edit-address');
  };

  keyExtractor = (item) => item?.label;

  renderSlots = ({ item }) => {
    const { selectedSlots, selectedDate } = this.state;
    let isDisabled = false;
    if (
      selectedDate.format('DD-MM-YYYY') === moment().format('DD-MM-YYYY') &&
      moment().hours() > 6
    ) {
      isDisabled = true;
    } else {
      isDisabled = item?.start - 14 * 60 * 60 * 1000 < moment().unix() * 1000;
    }
    return (
      <ListItem
        bottomDivider
        pad={20}
        style={{ flex: 1 }}
        containerStyle={{
          marginVertical: 5,
          zIndex: -1,
          borderRadius: 5,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
        linearGradientProps={{
          colors: [colors.primaryGradientStart, colors.primary],
          start: { x: 1, y: 0 },
          end: { x: 0.2, y: 0 },
        }}
        ViewComponent={LinearGradient}
      >
        <ListItem.Content
          style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}
        >
          <ListItem.Title
            style={{
              color: colors.white,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            <RadioButton
              value={item?.label}
              uncheckedColor={colors.ERROR}
              disabled={isDisabled}
              theme={{ colors: { disabled: 'gray' } }}
              status={selectedSlots.get('slots') === item?.label ? 'checked' : 'unchecked'}
              onPress={() => this.handleSelectedSlots(item?.label)}
            />
          </ListItem.Title>
          <ListItem.Title
            style={{
              color: colors.white,
              fontSize: 18,
              fontWeight: 'bold',
              textDecorationLine: isDisabled ? 'line-through' : 'none',
            }}
          >
            {item?.label}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    const { selectedDistributorIndex, selectedDate, slots } = this.state;
    const { addressData, route, allDistributors } = this.props;
    const { params } = route || {};
    const { subTotal } = params || {};
    const defaultAddress = !checkEmpty(addressData)
      ? addressData.filter((item) => item.isDefault)[0]
      : {};
    const deliveryAddress = !checkEmpty(defaultAddress)
      ? `${defaultAddress?.buildingName},\n${defaultAddress?.street},\n${defaultAddress?.city}, ${defaultAddress?.state}.\n${defaultAddress?.postalCode}`
      : '';
    const distributors =
      !checkEmpty(allDistributors) && deliveryAddress
        ? allDistributors
            .filter((item) => item?.city === defaultAddress?.city)
            .map((item) => item?.business)
            .filter((item) => item)
        : [];
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        <StyledCheckoutContainer style={{ flex: 1 }}>
          <StyledDateTimeContainer style={{ flex: 1 }}>
            <FlatList
              extraData={this.state}
              data={slots}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderSlots}
              ListHeaderComponent={(
                <>
                  {!checkEmpty(defaultAddress) ? (
                    <StyledAddressContainer
                      colors={['gray', 'black']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <StyledAddressLeftContent>
                        <StyledTitle
                          color={colors.white}
                          style={{ fontSize: 25, fontWeight: 'bold' }}
                        >
                          {defaultAddress?.addressType}
                        </StyledTitle>
                        <StyledTitle color={colors.white}>{deliveryAddress}</StyledTitle>
                      </StyledAddressLeftContent>
                      <StyledAddressRightContent>
                        <Button
                          caption="Change"
                          bordered
                          textColor={colors.white}
                          onPress={this.changeAddress}
                        />
                      </StyledAddressRightContent>
                    </StyledAddressContainer>
                  ) : (
                    <StyledAddressContainer
                      colors={['gray', 'black']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <StyledAddressRightContent>
                        <Button
                          caption="Select Address"
                          bordered
                          textColor={colors.white}
                          onPress={this.changeAddress}
                        />
                      </StyledAddressRightContent>
                    </StyledAddressContainer>
                  )}
                  <StyledDistributorContainer>
                    <DropDown
                      items={distributors}
                      onSelect={this.handleDistributorSelect}
                      selectedIndex={selectedDistributorIndex}
                      placeholder="Select Distributor"
                      borderColor="#fff"
                      height={50}
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                      outerColor="#fff"
                      color="#000"
                    />
                  </StyledDistributorContainer>
                  <CalendarStrip
                    scrollable={false}
                    style={{
                      height: 100,
                      paddingTop: 20,
                      paddingBottom: 10,
                      borderColor: colors.white,
                      borderWidth: 1,
                    }}
                    selectedDate={selectedDate}
                    calendarColor="tranpsarent"
                    showMonth={false}
                    calendarHeaderStyle={{ color: 'white' }}
                    dateNumberStyle={{ color: 'white' }}
                    highlightDateNumberStyle={{ color: 'yellow' }}
                    highlightDateNameStyle={{ color: 'yellow' }}
                    calendarAnimation={{ type: 'sequence', duration: 30 }}
                    daySelectionAnimation={{
                      type: 'border',
                      duration: 200,
                      borderWidth: 1,
                      borderHighlightColor: 'white',
                    }}
                    datesBlacklist={this.datesBlacklist}
                    dateNameStyle={{ color: 'white' }}
                    iconContainer={{ flex: 0.1 }}
                    minDate={new Date()}
                    maxDate={this.getMaxDate()}
                    onDateSelected={this.getSelectedDate}
                    onWeekChanged={this.onWeekChanged}
                  />
                </>
              )}
            />
          </StyledDateTimeContainer>
        </StyledCheckoutContainer>
        <StyledPaymentButton>
          <Pressable
            style={{ width: '100%' }}
            onPress={() => this.gotoPaymentPage()}
            android_ripple={{ color: 'gray', radius: 360 }}
          >
            <StyledPaymentContainer>
              <StyledTitle color={colors.white}>Proceed to pay</StyledTitle>
              <CheckoutPriceContainer>
                <StyledTitle color={colors.white}>{currencyFormatter(subTotal)}</StyledTitle>
                <Icon name="arrow-right" size={20} color={colors.white} />
              </CheckoutPriceContainer>
            </StyledPaymentContainer>
          </Pressable>
        </StyledPaymentButton>
      </StyledContainer>
    );
  }
}

CheckoutScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
  allDistributors: PropTypes.oneOfType([PropTypes.array]).isRequired,
  addressData: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
