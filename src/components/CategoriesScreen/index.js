import { loaderStartAction } from '@/redux/loaderService/LoaderAction';
import { fetchAllCategoriesAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty } from '@/utils/commonFunctions';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import { Avatar, ListItem } from 'react-native-elements';
import { CategoriesContainer, StyledContainer, StyledFlatList, StyledTitle } from './styles';

export default class CategoriesScreen extends React.PureComponent {
  constructor(props) {
    super();
    this.fetchCategories(props);
  }

  fetchCategories = (props) => {
    const { dispatch, user } = props;
    dispatch(loaderStartAction());
    dispatch(fetchAllCategoriesAction(user?.uid));
  };

  keyExtractor = (item, index) => index.toString();

  showProduct = (data) => {
    const { navigation } = this.props;
    navigation.navigate('products', { data });
  };

  renderItem = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        pad={10}
        containerStyle={{ marginVertical: 5, zIndex: -1, borderRadius: 5 }}
        accessible
        onPressOut={() => this.showProduct(item)}
        onPress={() => {}}
        linearGradientProps={{
          colors: [colors.primaryGradientStart, colors.primary],
          start: { x: 1, y: 0 },
          end: { x: 0.2, y: 0 },
        }}
        ViewComponent={LinearGradient}
      >
        {item.image ? (
          <Avatar rounded size={100} title={item.product} source={{ uri: item.image }} />
        ) : (
          <Avatar
            rounded
            size={100}
            icon={{ name: 'image-broken', type: 'material-community', color: colors.black }}
            iconStyle={{ color: colors.black }}
            avatarStyle={{ backgroundColor: '#ededed', zIndex: -1 }}
          />
        )}
        <ListItem.Content style={{ marginLeft: 20 }}>
          <ListItem.Title style={{ color: colors.white }}>{item.category}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron iconStyle={{ color: colors.white }} />
      </ListItem>
    );
  };

  render() {
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const { categories } = this.props;
    return (
      <StyledContainer source={background}>
        {!checkEmpty(categories) ? (
          <CategoriesContainer>
            <StyledFlatList
              keyExtractor={this.keyExtractor}
              data={categories}
              renderItem={this.renderItem}
            />
          </CategoriesContainer>
        ) : (
          <StyledTitle>No Data Found</StyledTitle>
        )}
      </StyledContainer>
    );
  }
}

CategoriesScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
