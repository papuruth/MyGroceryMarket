import CategoriesScreen from '@/components/CategoriesScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { categories, categoriesError } = state.productReducer;
  const { user } = state.session;
  return { categories, categoriesError, user };
};

export default connect(mapStateToProps)(CategoriesScreen);
