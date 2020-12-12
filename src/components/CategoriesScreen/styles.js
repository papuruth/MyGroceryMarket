import { colors, metrics } from '@/styles';
import { ImageBackground, FlatList } from 'react-native';
import styled from 'styled-components/native';

const getFontSize = () => {
  if (metrics.screenWidth < 400) {
    return '14px';
  }
  return '18px';
};

export const StyledContainer = styled(ImageBackground)`
  align-items: center;
  color: ${colors.primary};
  height: 100%;
  padding: 10px;
  width: 100%;
`;

export const StyledTitle = styled.Text`
  color: ${colors.lightGray};
  font-size: ${getFontSize()};
`;

export const CategoriesContainer = styled.View`
  width: 100%;
`;

export const StyledFlatList = styled(FlatList)``;
