import { colors } from '@/styles';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

export const StyledContainer = styled.ImageBackground`
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${colors.white};
  font-size: 18px;
`;

export const StyledCartContainer = styled.View`
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
  height: 100%;
`;

export const StyledCartCardContainer = styled(LinearGradient)`
  width: 100%;
  margin: 0px;
  border: 1px solid #fff;
  border-radius: 5px;
  justify-content: space-between;
`;

export const StyledCardContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

export const StyledCardContentLeft = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
`;
export const StyledCardContentRight = styled.View`
  align-items: flex-end;
  justify-content: flex-start;
`;

export const StyledCardActions = styled.View`
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
`;

export const CartItemsContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const AddToCartButtonContainer = styled.View`
  flex-direction: row;
  width: auto;
  align-items: center;
`;

export const StyledEmptyCartContainer = styled.View`
  width: 100%;
  margin-top: 50px;
  justify-content: center;
  align-items: center;
`;

export const StyledImage = styled.Image`
  height: 200px;
  width: 100%;
`;

export const StyledEmptyCartAction = styled.View`
  width: 100%;
  margin-top: 50px;
  height: 100px;
  justify-content: space-between;
  align-items: center;
`;

export const StyledCheckoutButton = styled.View`
  position: absolute;
  bottom: 0;
  background: darkorange;
  width: 100%;
`;
export const StyledCheckoutContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: space-between;
`;

export const CheckoutPriceContainer = styled.View`
  flex-direction: row;
  width: 90px;
  align-items: center;
  justify-content: space-between;
`;
