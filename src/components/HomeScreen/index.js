import SearchScreen from '@/containers/SearchScreen';
import { fetchMyCartItemsAction } from '@/redux/globalCartAndCheckout/GlobalCartAndCheckoutAction';
import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { wakeNotificationServerAction } from '@/redux/notifications/NotificationActions';
import { fetchAllCategoriesAction, mountSearchAction } from '@/redux/products/ProductsAction';
import { getAllAddressAction } from '@/redux/user/userAction';
import { colors, metrics } from '@/styles';
import { checkEmpty } from '@/utils/commonFunctions';
import { Button } from '@/utils/reusableComponents';
import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { Modal, Portal } from 'react-native-paper';
import APP_CONSTANTS from '../../utils/appConstants/AppConstants';
import {
  CategoryContainer,
  CategoryImageContainer,
  CategoryLabelConatiner,
  HomeContainer,
  StyledCategoryContainer,
  StyledCategoryHeading,
  StyledMainContainer,
  StyledSearchBar,
  StyledTitle,
} from './styles';

export default class HomeScreen extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchInitialData(this.props);
    dispatch(loaderStartAction());
    dispatch(fetchAllCategoriesAction());
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
    dispatch(loaderStartAction());
    dispatch(fetchMyCartItemsAction(user?.uid));
    dispatch(getAllAddressAction(user?.uid));
    dispatch(fetchAllCategoriesAction());
    if (!serverIsWake) dispatch(wakeNotificationServerAction());
  };

  keyExtractor = ({ _id }) => _id;

  showProduct = (data) => {
    const { navigation } = this.props;
    navigation.navigate('products', { data });
  };

  renderCategories = ({ item }) => (
    <CategoryContainer>
      <Pressable
        onPress={() => this.showProduct(item)}
        android_ripple={{ color: '#000', radius: 360 }}
      >
        {item?.image ? (
          <CategoryImageContainer
            source={{
              uri: item?.image,
              height: metrics.screenWidth < 450 ? 200 : 150,
              width: '100%',
            }}
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            resizeMode="cover"
            resizeMethod="auto"
            loadingIndicatorSource={<ActivityIndicator />}
          />
        ) : (
          <Avatar
            size={metrics.screenWidth < 450 ? 200 : 150}
            containerStyle={{ width: '100%' }}
            icon={{ name: 'image-broken', type: 'material-community' }}
          />
        )}
        <CategoryLabelConatiner>
          <StyledTitle size={16} style={{ textAlign: 'center' }}>
            {item?.category}
          </StyledTitle>
        </CategoryLabelConatiner>
      </Pressable>
    </CategoryContainer>
  );

  render() {
    const { navigation, mountSearch, categories } = this.props;
    const {
      IMAGES: { homeBG },
    } = APP_CONSTANTS;
    return (
      <StyledMainContainer source={homeBG}>
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
        <StyledCategoryHeading
          colors={['gray', 'black']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <StyledTitle size={25}>Shop By Categoy</StyledTitle>
        </StyledCategoryHeading>
        <StyledCategoryContainer style={{ flex: 1 }}>
          {!checkEmpty(categories) ? (
            <FlatList
              data={categories}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderCategories}
              numColumns={metrics.screenWidth < 450 ? 2 : 3}
              style={{ width: '100%' }}
            />
          ) : null}
        </StyledCategoryContainer>
        <Portal>
          <Modal
            visible={mountSearch}
            contentContainerStyle={{ width: '100%', height: '100%' }}
            onDismiss={this.hideSearch}
          >
            <SearchScreen {...this.props} />
          </Modal>
        </Portal>
      </StyledMainContainer>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
  mountSearch: PropTypes.bool.isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
