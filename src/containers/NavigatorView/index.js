import NavigatorView from '@/routes/RootNavigation';
import { checkEmpty } from '@/utils/commonFunctions';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { authenticated, user } = state.session;
  const { myCartItems } = state.globalCartReducer;
  const { addressData } = state.userReducer;
  return {
    authenticated,
    myCartItems,
    user,
    addressData: !checkEmpty(addressData) ? addressData : [],
  };
};

export default connect(mapStateToProps)(NavigatorView);
