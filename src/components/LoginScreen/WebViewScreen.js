import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { BackHandler } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Progress from 'react-native-progress';
import { WebView } from 'react-native-webview';

export default class WebViewScreen extends PureComponent {
  webView = null;

  constructor() {
    super();
    this.state = {
      backButtonEnabled: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler = () => {
    const { backButtonEnabled } = this.state;
    if (backButtonEnabled) {
      this.webView.goBack();
      return true;
    }
    return false;
  };

  handleNavigationStateChange = (navState) => {
    const { url } = navState || {};
    if (!url) return;
    if (navState.canGoBack) {
      this.setState({
        backButtonEnabled: true,
      });
    } else {
      this.setState({
        backButtonEnabled: false,
      });
    }
  };

  renderLoading = () => (
    <Spinner
      visible
      cancelable
      customIndicator={(
        <Progress.CircleSnail
          size={70}
          thickness={5}
          progress={1}
          color={['red', 'green', 'blue']}
        />
      )}
      overlayColor="rgba(0,0,0,0.4)"
      animation="fade"
    />
  );

  render() {
    const { uri } = this.props;
    return (
      <WebView
        ref={(ref) => {
          this.webView = ref;
        }}
        startInLoadingState
        renderLoading={this.renderLoading}
        source={{ uri }}
        containerStyle={{ width: '100%', height: '100%' }}
        onNavigationStateChange={this.handleNavigationStateChange}
      />
    );
  }
}

WebViewScreen.propTypes = {
  uri: PropTypes.string.isRequired,
};
