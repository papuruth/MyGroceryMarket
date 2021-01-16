import { colors } from '@/styles';
import { currencyFormatter } from '@/utils/commonFunctions';
import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import {
  DeliveryAddressContainer,
  DeliveryAddressHeading,
  DistributorContainer,
  DistributorDetails,
  DistributorDetailsContainer,
  DistributorHeading,
  DistributorImage,
  PaymentSummaryContainer,
  PaymentSummaryDetailsContainer,
  PaymentSummaryDetailsLeft,
  PaymentSummaryDetailsRight,
  PaymentSummaryHeading,
  StyledTitle,
} from './styles';

export default function OrderDetailsFooter({ orderDetails }) {
  const {
    subTotal,
    productsDiscount,
    deliveryCharges,
    deliveryAddress,
    userDetails,
    distributorDetails,
    orderId,
  } = orderDetails || {};
  const { buildingName, state, city, postalCode, street } = deliveryAddress || {};
  const mergedAddress = `Delivers to ${userDetails?.displayName},\n${buildingName},\n${street},\n${city}, ${state} (${postalCode})`;
  return (
    <>
      <PaymentSummaryContainer
        colors={['gray', 'black']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <PaymentSummaryHeading>
          <StyledTitle bold>PAYMENT SUMMARY</StyledTitle>
        </PaymentSummaryHeading>
        <Divider style={{ backgroundColor: colors.white }} />
        <PaymentSummaryDetailsContainer>
          <PaymentSummaryDetailsLeft>
            <StyledTitle>M.R.P.</StyledTitle>
            <StyledTitle>Products Discount</StyledTitle>
            <StyledTitle>Delivery Charges</StyledTitle>
            <StyledTitle bold style={{ marginTop: 15 }} size={20}>
              Final Paid Amount
            </StyledTitle>
          </PaymentSummaryDetailsLeft>
          <PaymentSummaryDetailsRight>
            <StyledTitle>{currencyFormatter(subTotal)}</StyledTitle>
            <StyledTitle>{currencyFormatter(productsDiscount)}</StyledTitle>
            <StyledTitle
              style={{ color: deliveryCharges > 0 ? colors.white : colors.SUCCESS }}
              size={18}
            >
              {deliveryCharges > 0 ? currencyFormatter(deliveryCharges) : 'Free'}
            </StyledTitle>
            <StyledTitle bold style={{ marginTop: 15 }} size={20}>
              {currencyFormatter(subTotal)}
            </StyledTitle>
          </PaymentSummaryDetailsRight>
        </PaymentSummaryDetailsContainer>
      </PaymentSummaryContainer>
      <DeliveryAddressContainer
        colors={['gray', 'black']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <DeliveryAddressHeading>
          <StyledTitle bold>DELIVERY ADDRESS</StyledTitle>
        </DeliveryAddressHeading>
        <Divider style={{ backgroundColor: colors.white }} />
        <StyledTitle bold style={{ padding: 10 }}>
          {mergedAddress}
        </StyledTitle>
      </DeliveryAddressContainer>
      <DistributorContainer colors={['gray', 'black']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <DistributorHeading>
          <StyledTitle bold>DISTRIBUTOR</StyledTitle>
        </DistributorHeading>
        <Divider style={{ backgroundColor: colors.white }} />
        <DistributorDetailsContainer>
          <DistributorImage>
            <Avatar
              icon={{
                name: 'store',
                type: 'material-community',
                size: 50,
                color: colors.orange,
              }}
              containerStyle={{ backgroundColor: '#FFF496' }}
              size={50}
            />
          </DistributorImage>
          <DistributorDetails>
            <StyledTitle bold>
              {distributorDetails?.business || distributorDetails?.name}
            </StyledTitle>
            <StyledTitle>Order ID: {orderId}</StyledTitle>
          </DistributorDetails>
        </DistributorDetailsContainer>
      </DistributorContainer>
    </>
  );
}

OrderDetailsFooter.propTypes = {
  orderDetails: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
