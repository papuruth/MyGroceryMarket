import { metrics } from '@/styles';
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

export const StyledSearchContainer = styled.View`
  width: 100%;
  padding: 0px 30px 0px 10px;
  align-items: center;
  flex-direction: row;
`;

export const SearchInPutContainer = styled.View`
  width: 100%;
`;

export const SearchResultContainer = styled.View`
  width: 100%;
  align-items: center;
  height: 100%;
`;
