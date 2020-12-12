import PaymentScreen from '@/components/PaymentScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { user } = state.session;
  return {
    user,
  };
};

export default connect(mapStateToProps)(PaymentScreen);
