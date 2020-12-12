import ProductDetailsScreen from '@/components/ProductDetailsScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const { productDetails } = state.productReducer;
  const { myCartItems, myCartItemsError } = state.globalCartReducer;
  return { user, productDetails, myCartItems, myCartItemsError };
};

export default connect(mapStateToProps)(ProductDetailsScreen);
