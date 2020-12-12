import MyCartScreen from '@/components/MyCartScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const { myCartItems } = state.globalCartReducer;
  return {
    user,
    myCartItems,
  };
};

export default connect(mapStateToProps)(MyCartScreen);
