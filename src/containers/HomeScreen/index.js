import { connect } from 'react-redux';
import HomeScreen from '@/components/HomeScreen';

const mapStateToProps = (state) => {
  const { user, authenticated } = state.session;
  const { mountSearch } = state.productReducer;
  const { serverIsWake } = state.notificationReducer;
  const { categories } = state.productReducer;
  return {
    user,
    authenticated,
    mountSearch,
    serverIsWake,
    categories,
  };
};

export default connect(mapStateToProps)(HomeScreen);
