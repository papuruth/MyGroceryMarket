import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { AuthPrivacyContainer, AuthPrivacyLink, AuthPrivacyView, StyledTitle } from './styles';

export default class Privacy extends PureComponent {
  render() {
    const {
      URLS: { tos, privacyPolicy },
    } = APP_CONSTANTS;
    const { navigation } = this.props;
    return (
      <AuthPrivacyContainer>
        <AuthPrivacyView>
          <StyledTitle fontSize={24} color={colors.white}>
            By continuing, you agree to our
          </StyledTitle>
          <AuthPrivacyLink>
            <TouchableOpacity onPress={() => navigation.navigate('tos', { uri: tos })}>
              <StyledTitle
                fontSize={16}
                color={colors.black}
                accessibilityRole="link"
                decoration="underline"
                dataDetectorType="link"
              >
                Terms of Service
              </StyledTitle>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('privacy-policy', { uri: privacyPolicy })}
            >
              <StyledTitle
                fontSize={16}
                color={colors.black}
                accessibilityRole="link"
                decoration="underline"
                dataDetectorType="link"
              >
                Privacy Policy
              </StyledTitle>
            </TouchableOpacity>
          </AuthPrivacyLink>
        </AuthPrivacyView>
      </AuthPrivacyContainer>
    );
  }
}

Privacy.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
