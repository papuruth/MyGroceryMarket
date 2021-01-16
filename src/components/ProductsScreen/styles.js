import { colors } from '@/styles';
import { ImageBackground, FlatList } from 'react-native';
import styled from 'styled-components/native';

export const StyledContainer = styled(ImageBackground)`
  height: 100%;
  padding: 10px;
  align-items: center;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${colors.lightGray};
  font-size: 24px;
`;

export const CategoriesContainer = styled.View`
  width: 100%;
`;

export const ProductsContainer = styled.View`
  width: 100%;
  height: 100%;
`;

export const StyledFlatList = styled(FlatList)`
  height: 100%;
`;

export const AddToCartButtonContainer = styled.View`
  flex-direction: row;
  width: auto;
  align-items: center;
`;
