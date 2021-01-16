import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { colors, fonts, metrics } from '../../styles';

export const StyledMainContainer = styled.ImageBackground`
  width: 100%;
  height: 100%;
  padding: 10px;
`;
export const HomeContainer = styled.SafeAreaView`
  width: 100%;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const TabsContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const ComponentContainer = styled.View`
  width: 100%;
  height: auto;
  padding: 0px 10px;
`;

export const StyledSearchBar = styled.TouchableOpacity`
  width: 100%;
  margin-left: 10px;
  background: transparent;
  height: 40px;
  flex: 1;
  padding: 0px 15px;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${colors.white};
  border-radius: 5px;
`;

export const StyledTitle = styled.Text`
  color: ${colors.white};
  padding-left: 10px;
  font-size: ${(props) => props?.size || '15'}px;
  font-family: ${fonts.primaryBold};
`;

export const StyledCategoryHeading = styled(LinearGradient)`
  margin-top: 10px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const StyledCategoryContainer = styled.View`
  margin-top: 10px;
  width: 100%;
  align-items: center;
`;

export const CategoryContainer = styled.View`
  margin: 5px;
  height: ${metrics.screenWidth < 450 ? 250 : 200}px;
  width: ${metrics.screenWidth < 450 ? 47.5 : 31.1}%;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid ${colors?.orange};
`;
export const CategoryImageContainer = styled.Image``;
export const CategoryLabelConatiner = styled.View`
  align-items: center;
  height: 50px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: ${colors.orange};
  justify-content: center;
`;
