import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors, fonts } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: 0,
    height: '100%',
  },
});

export const HomeContainer = styled.SafeAreaView`
  width: 100%;
  margin-top: 10px;
  padding: 0px 10px;
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
  font-size: 15px;
  font-family: ${fonts.primaryBold};
`;
