import { metrics } from '@/styles';
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
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: #fff;
  font-size: ${(props) => getFontSize(props)};
  font-weight: ${(props) => (props?.bold ? 'bold' : 'normal')};
  text-decoration: ${(props) => (props?.textDecoration ? props.textDecoration : 'none')};
`;

export const StyledCardContainer = styled(LinearGradient)`
  width: 100%;
  border: 1px solid #fff;
  border-radius: 5px;
  background: #fff;
  margin-bottom: 10px;
`;

export const StyledCardContent = styled.View`
  width: 100%;
  padding: 10px;
`;

export const StyledCardActions = styled.View`
  width: 100%;
`;
export const DeliveryInfo = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const OrderDetailsContainer = styled.View`
  width: 100%;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
`;

export const StyledCardTitle = styled.View`
  align-items: center;
`;

export const StyledItemDetailsContaner = styled.View`
  width: 100%;
  margin-top: 10px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ItemIconContainer = styled.View`
  align-items: flex-end;
  margin-top: 5px;
`;
export const ItemDetailsContainer = styled.View`
  align-items: flex-start;
`;
export const ItemPriceContainer = styled.View`
  align-items: flex-end;
`;

export const OrderStatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const FinalAmountContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
  justify-content: space-between;
`;

export const NoOrdersContainer = styled.View`
  width: 100%;
  margin-top: 50px;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;
