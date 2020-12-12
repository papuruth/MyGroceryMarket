import ProductsScreen from '@/components/ProductsScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { categories, categoriesError, products, productsError } = state.productReducer;
  const { user } = state.session;
  const { myCartItems } = state.globalCartReducer;
  return { categories, categoriesError, products, productsError, user, myCartItems };
};

export default connect(mapStateToProps)(ProductsScreen);
