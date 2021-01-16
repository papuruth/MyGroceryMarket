import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { sendOTPAction } from '@/redux/user/userAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, equalityChecker } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-native';
import Privacy from './Privacy';
import {
  AuthFormFields,
  AuthFormView,
  AuthLogo,
  AuthLogoView,
  LoginFormContainer,
  ScrollContainer,
  StyledContainer,
  StyledTitle,
} from './styles';

export default class LoginScreen extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      phone: '+91',
    };
  }

  componentDidUpdate(prevProps) {
    const { otpSentStatus, navigation, otpSentError } = this.props;
    const { phone } = this.state;
    if (!equalityChecker(otpSentStatus, prevProps.otpSentStatus) && otpSentStatus) {
      navigation.navigate('verify-otp', { phone });
    }
    if (!equalityChecker(otpSentError, prevProps.otpSentError) && !checkEmpty(otpSentError)) {
      console.log(otpSentError);
      Alert.alert('Failure', otpSentError?.message);
    }
  }

  sendOTP = () => {
    const { phone } = this.state;
    const { dispatch } = this.props;
    if (phone && phone.length === 13) {
      dispatch(loaderStartAction());
      dispatch(sendOTPAction(phone));
    } else {
      Alert.alert(
        'Info',
        'Not a valid phone number. Your phone must be 13 digit including country code. E.g., +911234567890',
      );
    }
  };

  render() {
    const {
      IMAGES: { background, appLogo },
    } = APP_CONSTANTS;
    const { phone, parentHeight } = this.state;
    const { navigation } = this.props;
    return (
      <StyledContainer
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          this.setState({ parentHeight: height });
        }}
        source={background}
        style={{ flex: 1, minHeight: parentHeight }}
      >
        <ScrollContainer
          style={{ height: '100%', width: '100%' }}
          contentContainerStyle={{ flex: 1 }}
        >
          <LoginFormContainer>
            <AuthLogoView>
              <AuthLogo source={appLogo} />
              <StyledTitle fontSize={24} color={colors.black}>
                Get started
              </StyledTitle>
              <StyledTitle fontSize={13} color={colors.grey}>
                Enter your phone number and we will send an &quot;OTP&quot; to continue
              </StyledTitle>
            </AuthLogoView>
            <AuthFormView>
              <AuthFormFields
                label="Mobile no."
                mode="flat"
                blurOnSubmit
                autoFocus
                autoCompleteType="tel"
                keyboardType="phone-pad"
                onSubmitEditing={this.sendOTP}
                value={phone}
                onChangeText={(text) => this.setState({ phone: text })}
              />
              <Button
                style={{ marginVertical: 20 }}
                bordered
                caption="Send OTP"
                onPress={this.sendOTP}
              />
            </AuthFormView>
          </LoginFormContainer>
          <Privacy navigation={navigation} />
        </ScrollContainer>
      </StyledContainer>
    );
  }
}

LoginScreen.propTypes = {
  otpSentStatus: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  otpSentError: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
