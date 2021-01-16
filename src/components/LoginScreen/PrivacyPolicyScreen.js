import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyledContainer } from './styles';
import WebViewScreen from './WebViewScreen';

export default function PrivacyPolicyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({});
    }
  }, []);
  const {
    IMAGES: { background },
  } = APP_CONSTANTS;
  return (
    <StyledContainer source={background}>
      <WebViewScreen uri={route?.params?.uri} />
    </StyledContainer>
  );
}
