import MyOrdersScreen from '@/components/MyOrdersScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const { myOrders } = state.userReducer;
  return {
    user,
    myOrders,
  };
};

export default connect(mapStateToProps)(MyOrdersScreen);
