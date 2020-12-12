import { colors } from '@/styles';
import { checkEmpty, currencyFormatter, dateTimeFormater } from '@/utils/commonFunctions';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DeliveryDetailsContainer,
  DeliveryStatusContainer,
  ItemsDetailsContainerHeading,
  OrderDeliveredStatusContainer,
  OrderPaymentStatusContainer,
  StyledTitle,
} from './styles';

export default function OrderDetailsHeader({ orderDetails }) {
  const getBgColor = (status) => {
    if (status === 'Pending') {
      return colors.gray;
    }
    if (status === 'Confirmed') {
      return colors.yellow;
    }
    if (status === 'In Progress') {
      return colors.orange;
    }
    if (status === 'Delivered') {
      return colors.SUCCESS;
    }
    return 'transparent';
  };

  const { status, deliveredOn, paymentMode, dateCreated, products, subTotal } = orderDetails || {};
  return (
    <>
      <DeliveryDetailsContainer
        colors={['gray', 'black']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <StyledTitle size={18} textDecoration="underline" style={{ textAlign: 'center' }}>
          Placed on, {dateTimeFormater(dateCreated, 'ddd, hh:mm A')}
        </StyledTitle>
        <DeliveryStatusContainer bgColor={getBgColor(status)}>
          {status !== 'Delivered' ? (
            <StyledTitle size={18} bold style={{ textAlign: 'center' }}>
              {status === 'Pending' ? 'Your Order is Pending' : ''}
              {status === 'Confirmed' ? 'Your Order is Confirmed' : ''}
              {status === 'In Progress' ? 'Your Order is In Progress' : ''}
            </StyledTitle>
          ) : (
            <OrderDeliveredStatusContainer>
              <Icon name="check-circle" color={colors.white} size={25} />
              <StyledTitle size={18} bold>
                Yay! Order Successfully Delivered
              </StyledTitle>
            </OrderDeliveredStatusContainer>
          )}
        </DeliveryStatusContainer>
        {deliveredOn && status === 'Delivered' ? (
          <StyledTitle size={18} bold>
            Delivered on, {dateTimeFormater(deliveredOn, 'ddd, hh:mm A')}
          </StyledTitle>
        ) : null}
        <OrderPaymentStatusContainer>
          <Icon name="credit-card" color={colors.white} size={25} style={{ paddingRight: 5 }} />
          <StyledTitle size={18} bold>
            Paid Via {paymentMode}
          </StyledTitle>
        </OrderPaymentStatusContainer>
      </DeliveryDetailsContainer>
      <ItemsDetailsContainerHeading>
        {!checkEmpty(products) ? (
          <StyledTitle
            bold
            size={20}
            style={{
              borderRightWidth: 1,
              borderRightColor: colors.white,
              width: '50%',
              textAlign: 'center',
              textAlignVertical: 'center',
              height: '100%',
            }}
          >
            {products.length} ITEMS
          </StyledTitle>
        ) : null}
        {!checkEmpty(products) ? (
          <StyledTitle
            bold
            size={20}
            style={{
              width: '50%',
              height: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
            }}
          >
            AMOUNTS: {currencyFormatter(subTotal)}
          </StyledTitle>
        ) : null}
      </ItemsDetailsContainerHeading>
    </>
  );
}

OrderDetailsHeader.propTypes = {
  orderDetails: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
