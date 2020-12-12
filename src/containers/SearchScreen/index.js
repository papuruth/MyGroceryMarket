import SearchScreen from '@/components/SearchScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { allProducts } = state.productReducer;
  return { allProducts };
};

export default connect(mapStateToProps)(SearchScreen);
