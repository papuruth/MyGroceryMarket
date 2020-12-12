import CheckoutScreen from '@/components/CheckoutScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const { myCartItems } = state.globalCartReducer;
  const { addressData } = state.userReducer;
  const { allDistributors } = state.productReducer;
  return {
    myCartItems,
    user,
    addressData,
    allDistributors,
  };
};

export default connect(mapStateToProps)(CheckoutScreen);
