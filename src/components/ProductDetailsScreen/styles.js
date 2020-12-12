import { colors } from '@/styles';
import { Caption } from '@/utils/reusableComponents/StyledText';
import { ImageBackground } from 'react-native';
import styled from 'styled-components/native';

const CommonContainer = styled.View`
  width: 100%;
`;
export const StyledContainer = styled(ImageBackground)`
  align-items: center;
  width: 100%;
  justify-content: center;
  height: 100%;
  padding: 10px;
`;

export const ProductDetailsContainer = styled.SafeAreaView`
  width: 100%;
`;

export const ScrollContainer = styled.ScrollView`
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${colors.white};
  font-size: ${(props) => (props.size ? props.size : 20)}px;
  font-weight: 600;
`;

export const StyledSubtitle = styled(Caption)`
  font-size: 16px;
`;

export const ProductImageContainer = styled(CommonContainer)`
  margin: 5px;
  height: 250px;
  align-items: center;
  justify-content: center;
`;

export const StyledImage = styled.Image`
  height: 200px;
  width: 200px;
`;

export const ProductDetailsContent = styled(CommonContainer)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px 0px;
  justify-content: space-between;
`;

export const ProductDetailsRight = styled.View`
  height: 100px;
  justify-content: space-evenly;
`;
export const ProductDetailsLeft = styled.View`
  justify-content: space-evenly;
  height: 100px;
`;

export const ProductExtraDetails = styled(CommonContainer)`
  align-items: center;
  border-color: #000;
`;

export const ProductDetailsAction = styled(CommonContainer)`
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
`;

export const AddToCartButtonContainer = styled.View`
  flex-direction: row;
  width: auto;
  align-items: center;
`;
