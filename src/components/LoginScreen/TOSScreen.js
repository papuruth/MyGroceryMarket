import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyledContainer } from './styles';
import WebViewScreen from './WebViewScreen';

export default function TOSScreen() {
  const route = useRoute();
  const {
    IMAGES: { background },
  } = APP_CONSTANTS;
  return (
    <StyledContainer source={background}>
      <WebViewScreen uri={route?.params?.uri} />
    </StyledContainer>
  );
}
