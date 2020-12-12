import { colors } from '@/styles';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

const CommonView = styled.View`
  width: 100%;
  height: 100%;
`;

export const StyledFlexRowView = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const StyledContainer = styled.ImageBackground`
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${(props) => (props?.color ? props.color : colors.black)};
  font-size: ${(props) => (props?.size ? props.size : 24)}px;
  font-weight: ${(props) => (props?.bold ? 'bold' : 'normal')};
  text-decoration: ${(props) => (props?.textDecoration ? props.textDecoration : 'none')};
`;

export const StyledPaymentContainer = styled(CommonView)`
  padding: 10px;
  align-items: center;
  margin-bottom: 50px;
`;

export const StyledOrderDetailsContainer = styled(LinearGradient)`
  width: 100%;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  justify-content: space-between;
`;

export const OrderDetailsHeading = styled(CommonView)`
  justify-content: center;
  align-items: center;
  height: 50px;
  flex-direction: row;
`;

export const OrderItemsContainer = styled(CommonView)`
  align-items: center;
`;

export const OrderConfirmContainer = styled(CommonView)`
  height: auto;
`;

export const StyledPlaceOrderContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: space-between;
`;

export const StyledPaymentButton = styled.View`
  position: absolute;
  bottom: 0;
  background: darkorange;
  width: 100%;
`;

export const CheckoutPriceContainer = styled.View`
  flex-direction: row;
  width: 90px;
  align-items: center;
  justify-content: space-between;
`;

export const OrderSuccessfullContainer = styled(CommonView)`
  height: 300px;
  align-items: center;
`;
