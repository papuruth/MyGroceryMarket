import SearchScreen from '@/containers/SearchScreen';
import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { wakeNotificationServerAction } from '@/redux/notifications/NotificationActions';
import { mountSearchAction } from '@/redux/products/ProductsAction';
import { getAllAddressAction } from '@/redux/user/userAction';
import { colors } from '@/styles';
import { Button } from '@/utils/reusableComponents';
import PropTypes from 'prop-types';
import React from 'react';
import { ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { Modal, Portal } from 'react-native-paper';
import APP_CONSTANTS from '../../utils/appConstants/AppConstants';
import { HomeContainer, StyledSearchBar, StyledTitle, styles } from './styles';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super();
    this.fetchInitialData(props);
  }

  mountSearch = () => {
    const { dispatch } = this.props;
    dispatch(mountSearchAction(true));
  };

  hideSearch = () => {
    const { dispatch } = this.props;
    dispatch(mountSearchAction(false));
    return true;
  };

  fetchInitialData = (props) => {
    const { user, dispatch, serverIsWake } = props;
    dispatch(fetchMyCartItemsAction(user?.uid));
    dispatch(getAllAddressAction(user?.uid));
    if (!serverIsWake) dispatch(wakeNotificationServerAction());
  };

  render() {
    const { navigation, mountSearch } = this.props;
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    return (
      <ImageBackground source={background} style={styles.container}>
        <HomeContainer>
          <Button
            caption="Categories"
            bordered
            onPress={() => navigation.navigate('all-categories')}
          />
          <StyledSearchBar
            accessibilityTraits="button"
            activeOpacity={0.8}
            onPress={this.mountSearch}
          >
            <Icon name="search" size={25} color={colors.white} />
            <StyledTitle>Search for products</StyledTitle>
          </StyledSearchBar>
        </HomeContainer>
        <Portal>
          <Modal
            visible={mountSearch}
            contentContainerStyle={{ width: '100%', height: '100%' }}
            onDismiss={this.hideSearch}
          >
            <SearchScreen {...this.props} />
          </Modal>
        </Portal>
      </ImageBackground>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
  mountSearch: PropTypes.bool.isRequired,
};
