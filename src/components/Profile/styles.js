import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

export const styles = StyleSheet.create({
  profile: {
    width: '100%',
    flexDirection: 'column',
  },
  profileBG: {
    width: '100%',
    flexDirection: 'column',
    height: '100%',
  },
  profileDisplayContainer: {
    width: '100%',
    height: 250,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dividerStyle: {
    height: 1,
    backgroundColor: colors.grey,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 30,
    flexDirection: 'column',
    width: '100%',
  },
  profileImage: {
    borderRadius: 100,
  },
  personalInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  personalInfoText: {
    fontWeight: 'bold',
    paddingLeft: 10,
    color: colors.white,
  },
  scrollView: {
    alignItems: 'center',
  },
  profileActions: {
    alignItems: 'center',
  },
  label: {
    marginRight: 5,
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  textContent: {
    marginRight: 5,
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  editProfileButton: {
    marginLeft: 5,
    marginRight: 5,
  },
  editBasicProfileContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  editImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  inputFiledsContainer: {
    justifyContent: 'space-between',
  },
  inputFields: {
    marginVertical: 5,
  },
  buttonShadow: {
    shadowColor: '#000fff',
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    resizeMode: 'contain',
    height: 150,
  },
  addressCard: {
    display: 'flex',
    borderColor: colors.white,
    borderWidth: 2,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginBottom: 15,
  },
  cardTitle: {
    color: colors.white,
  },
  addressEditContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  editAddressNoAddress: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  noAddressText: {
    fontSize: 30,
    textAlign: 'center',
    alignItems: 'center',
  },
  noAddressText2: {
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
  },
  addressCardContainer: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalInfoRating: {
    flexDirection: 'row',
  },
  addressInfo: {
    margin: 5,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  newAddressView: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  addressActionIcon: {
    flexDirection: 'row',
    color: colors.blue,
  },
  noAddressFound: {
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
