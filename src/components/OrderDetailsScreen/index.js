import { colors } from '@/styles';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { currencyFormatter } from '@/utils/commonFunctions';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, SafeAreaView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import OrderDetailsFooter from './OrderDetailsFooter';
import OrderDetailsHeader from './OrderDetailsHeader';
import { ItemsDetailsContainer, StyledContainer } from './styles';

export default class OrderDetailsScreen extends PureComponent {
  keyExtractor = ({ _id }) => _id;

  renderOrderItems = ({ item }) => (
    <ListItem
      bottomDivider
      pad={20}
      key={item?._id}
      containerStyle={{
        marginVertical: 1,
        zIndex: -1,
        borderRadius: 5,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
      linearGradientProps={{
        colors: [colors.primaryGradientStart, colors.primary],
        start: { x: 1, y: 0 },
        end: { x: 0.2, y: 0 },
      }}
      ViewComponent={LinearGradient}
    >
      {item.image ? (
        <Avatar rounded size={50} title={item.product} source={{ uri: item.image }} />
      ) : (
        <Avatar
          rounded
          size={50}
          icon={{ name: 'image-broken', type: 'material-community', color: colors.black }}
          iconStyle={{ color: colors.black }}
          avatarStyle={{ backgroundColor: '#ededed', zIndex: -1 }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title style={{ color: colors.white }}>{item.name}</ListItem.Title>
        <ListItem.Subtitle
          style={{
            color: colors.white,
          }}
        >
          {currencyFormatter(item?.price)} X {item?.itemCount}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Title style={{ color: colors.white, fontWeight: 'bold' }}>
        {currencyFormatter(item?.price * item?.itemCount)}
      </ListItem.Title>
    </ListItem>
  );

  render() {
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const { route } = this.props;
    const { params } = route || {};
    const { orderDetails } = params || {};
    const { products } = orderDetails || {};
    return (
      <StyledContainer source={background} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ItemsDetailsContainer style={{ flex: 1 }}>
            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderOrderItems}
              ListHeaderComponent={<OrderDetailsHeader orderDetails={orderDetails} />}
              ListFooterComponent={<OrderDetailsFooter orderDetails={orderDetails} />}
            />
          </ItemsDetailsContainer>
        </SafeAreaView>
      </StyledContainer>
    );
  }
}

OrderDetailsScreen.propTypes = {
  route: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
