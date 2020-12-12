import { colors } from '@/styles';
import { TextInput } from 'react-native-paper';
import styled from 'styled-components/native';

export const StyledContainer = styled.ImageBackground`
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const ScrollContainer = styled.ScrollView``;

export const StyledTitle = styled.Text`
  color: ${(props) => props.color || colors.black};
  font-size: ${(props) => props.fontSize || 24}px;
  text-decoration: ${(props) => (props.decoration ? props.decoration : 'none')};
`;

export const LoginFormContainer = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
`;

export const AuthLogoView = styled.View`
  align-items: center;
`;

export const AuthLogo = styled.Image`
  height: 150px;
  width: 200px;
`;

export const AuthFormView = styled.View`
  padding: 50px 20px;
  width: 100%;
`;

export const AuthFormFields = styled(TextInput)`
  background-color: transparent;
`;

export const AuthPrivacyContainer = styled.View`
  width: 100%;
  position: absolute;
  z-index: 9999;
  bottom: 20px;
  height: 50px;
`;
export const AuthPrivacyView = styled.View`
  width: 100%;
  align-items: center;
`;

export const AuthPrivacyLink = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 0px 20px;
  width: 90%;
  justify-content: space-between;
`;

export const ResendOTPView = styled.View`
  width: 100%;
  margin-top: 20px;
  align-items: center;
`;
