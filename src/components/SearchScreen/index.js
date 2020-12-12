import { loaderStartAction, loaderStopAction } from '@/redux/loaderService/LoaderAction';
import { fetchAllProductsAction, mountSearchAction } from '@/redux/products/ProductsAction';
import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, currencyFormatter, multiFilter } from '@/utils/commonFunctions';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { Avatar, Icon, ListItem, SearchBar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {
  SearchInPutContainer,
  SearchResultContainer,
  StyledContainer,
  StyledSearchContainer,
  StyledTitle,
} from './styles';

export default class SearchScreen extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      searchText: '',
      searchedData: [],
      loading: false,
    };
    this.initialState = this.state;
    this.fetchSearchData(props);
  }

  fetchSearchData = (props) => {
    const { dispatch } = props;
    dispatch(fetchAllProductsAction());
  };

  handleUserInput = (searchText) => {
    this.setState(
      {
        searchText,
        loading: true,
      },
      () => this.searchEngine(searchText),
    );
  };

  searchEngine = (query) => {
    if (query && query.length >= 4) {
      const { allProducts } = this.props;
      if (!checkEmpty(allProducts)) {
        const condition = {
          category: query,
          product: query,
        };
        const searchedData = multiFilter(allProducts, condition);
        this.setState({
          searchedData,
          loading: false,
        });
      }
    } else if (!query?.length) {
      this.setState({
        searchedData: [],
        loading: false,
      });
    }
  };

  hideSearchScreen = () => {
    const { dispatch } = this.props;
    this.setState(this.initialState, () => dispatch(mountSearchAction(false)));
  };

  showProductDetais = ({ _id }) => {
    const { dispatch, navigation } = this.props;
    dispatch(loaderStartAction());
    this.setState(this.initialState, () => {
      dispatch(mountSearchAction(false));
      navigation.navigate('product-details', { productId: _id });
      dispatch(loaderStopAction());
    });
  };

  keyExtractor = ({ _id }) => _id;

  renderSearchList = ({ item }) => (
    <ListItem
      bottomDivider
      pad={20}
      containerStyle={{
        marginVertical: 1,
        zIndex: -1,
        borderRadius: 5,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
      onPressOut={() => this.showProductDetais(item)}
      onPress={() => {}}
      linearGradientProps={{
        colors: [colors.primaryGradientStart, colors.primary],
        start: { x: 1, y: 0 },
        end: { x: 0.2, y: 0 },
      }}
      ViewComponent={LinearGradient}
    >
      {item.image ? (
        <Avatar rounded size={40} title={item.product} source={{ uri: item.image }} />
      ) : (
        <Avatar
          rounded
          size={40}
          icon={{ name: 'image-broken', type: 'material-community', color: colors.black }}
          iconStyle={{ color: colors.black }}
          avatarStyle={{ backgroundColor: '#ededed', zIndex: -1 }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title
          style={{
            color: colors.white,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {currencyFormatter(item?.price)}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: colors.white, marginTop: 10 }}>
          {item.name}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  render() {
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const { searchText, searchedData, loading } = this.state;
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        <StyledSearchContainer>
          <Icon
            name="arrow-left"
            type="material-community"
            color={colors.white}
            size={25}
            onPress={this.hideSearchScreen}
          />
          <SearchInPutContainer>
            <SearchBar
              placeholder="Type Here..."
              platform="android"
              cancelIcon={null}
              onChangeText={this.handleUserInput}
              value={searchText}
              autoFocus
              inputStyle={{ color: '#fff' }}
              showLoading={loading}
              loadingProps={{ color: colors.SUCCESS }}
              containerStyle={{ backgroundColor: 'transparent' }}
            />
          </SearchInPutContainer>
        </StyledSearchContainer>
        <SearchResultContainer style={{ flex: 1 }}>
          {!checkEmpty(searchedData) ? (
            <FlatList
              style={{ width: '100%' }}
              data={searchedData}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderSearchList}
            />
          ) : (
            <StyledTitle bold size={24}>
              No Data Found
            </StyledTitle>
          )}
        </SearchResultContainer>
      </StyledContainer>
    );
  }
}

SearchScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
  allProducts: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
