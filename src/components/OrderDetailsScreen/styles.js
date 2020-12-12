import { colors, metrics } from '@/styles';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

const getFontSize = (props) => {
  if (metrics.screenWidth < 400) {
    return '14px';
  }
  if (props?.size) {
    return `${props?.size}px`;
  }
  return '18px';
};

export const StyledContainer = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: #fff;
  font-size: ${(props) => getFontSize(props)};
  font-weight: ${(props) => (props?.bold ? 'bold' : 'normal')};
  text-decoration: ${(props) => (props?.textDecoration ? props.textDecoration : 'none')};
`;

export const DeliveryDetailsContainer = styled(LinearGradient)`
  padding: 5px 0px;
  width: 100%;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #fff;
`;

export const DeliveryStatusContainer = styled.View`
  background-color: ${(props) => (props?.bgColor ? props.bgColor : 'inherit')};
  height: 40px;
  margin: 10px 0px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const OrderDeliveredStatusContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const OrderPaymentStatusContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const ItemsDetailsContainer = styled.View`
  width: 100%;
  height: 100%;
`;

export const ItemsDetailsContainerHeading = styled.View`
  background: ${colors.orange};
  justify-content: center;
  height: 50px;
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
`;

export const PaymentSummaryContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 5px;
  border: 1px solid #fff;
  margin-top: 5px;
`;

export const PaymentSummaryHeading = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export const PaymentSummaryDetailsContainer = styled.View`
  width: 100%;
  padding: 10px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const PaymentSummaryDetailsLeft = styled.View``;
export const PaymentSummaryDetailsRight = styled.View`
  align-items: flex-end;
`;

export const DeliveryAddressContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 5px;
  border: 1px solid #fff;
  margin-top: 5px;
`;

export const DeliveryAddressHeading = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export const DistributorContainer = styled(LinearGradient)`
  width: 100%;
  border-radius: 5px;
  border: 1px solid #fff;
  margin-top: 5px;
`;

export const DistributorHeading = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
`;

export const DistributorDetailsContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  align-items: flex-start;
  width: 100%;
`;
export const DistributorImage = styled.View`
  padding-right: 10px;
  justify-content: flex-end;
`;
export const DistributorDetails = styled.View`
  justify-content: flex-end;
  align-items: flex-start;
`;
