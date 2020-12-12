import { colors, metrics } from '@/styles';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

export const StyledContainer = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${(props) => (props?.color ? props.color : colors.black)};
  font-size: 18px;
`;

export const StyledCheckoutContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 50px;
  padding: 10px;
`;

export const StyledAddressContainer = styled(LinearGradient)`
  width: 100%;
  margin: 0px;
  flex-direction: ${metrics.screenWidth > 400 ? 'row' : 'column'};
  border: 1px solid #fff;
  padding: 10px;
  align-items: ${metrics.screenWidth > 400 ? 'center' : 'flex-start'};
  border-radius: 5px;
  justify-content: space-between;
`;
export const StyledAddressLeftContent = styled.View``;
export const StyledAddressRightContent = styled.View``;
export const StyledDistributorContainer = styled.View`
  width: 100%;
`;
export const StyledDateTimeContainer = styled.View`
  width: 100%;
`;

export const StyledSlotsContainer = styled.View`
  width: 100%;
  height: 100%;
`;

export const StyledPaymentContainer = styled.View`
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
