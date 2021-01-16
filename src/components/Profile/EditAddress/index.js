import {
  addAddressAction,
  deleteAddressById,
  getAllAddressAction,
  updateAddressById,
} from '@/redux/user/userAction';
import APP_CONSTANTS from '@/utils/appConstants/AppConstants';
import { checkEmpty, equalityChecker } from '@/utils/commonFunctions';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert, ImageBackground, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Card, Dialog, Divider, IconButton, Portal, RadioButton } from 'react-native-paper';
import { loaderStartAction } from '../../../redux/loaderService/LoaderAction';
import { Button } from '../../../utils/reusableComponents';
import { styles } from '../styles';
import { RenderAddressEditForm } from './RenderAddressEditForm';
import { RenderNewAddressForm } from './RenderNewAddressForm';

export default class EditAddress extends PureComponent {
  constructor() {
    super();
    this.state = {
      visible: false,
      buildingName: null,
      city: null,
      postalCode: null,
      state: null,
      street: null,
      addressId: null,
      addressType: 'Home',
      showNewAddressForm: false,
    };
    this.initialState = this.state;
  }

  componentDidMount() {
    this.fetchAddress(this.props);
  }

  componentDidUpdate(prevProps) {
    const { addAddress, updateAddress, addressDeleteStatus } = this.props;
    if (!equalityChecker(addAddress, prevProps.addAddress) && addAddress?.status) {
      this.fetchAddress(this.props);
      Alert.alert('Success', 'Address added successfully!');
      this.hideDialog();
    }
    if (!equalityChecker(updateAddress, prevProps.updateAddress) && updateAddress?.status) {
      this.fetchAddress(this.props);
      Alert.alert('Success', 'Address updated successfully!');
      this.hideDialog();
    }
    if (
      !equalityChecker(addressDeleteStatus, prevProps.addressDeleteStatus) &&
      addressDeleteStatus?.status
    ) {
      this.fetchAddress(this.props);
      Alert.alert('Success', 'Address deleted successfully!');
      this.hideDialog();
    }
  }

  fetchAddress = (props) => {
    const { dispatch, user } = props;
    dispatch(loaderStartAction());
    dispatch(getAllAddressAction(user?.uid));
  };

  deleteAddress = (data) => {
    const { dispatch, user } = this.props;
    Alert.alert(
      'Info',
      'Are you sure? You want to delete this address, it is a non-reversible process.',
      [
        { text: 'Cancel', onPress: this.hideDialog, style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(loaderStartAction());
            dispatch(deleteAddressById(data?._id, user?.uid));
          },
        },
      ],
    );
  };

  editAddress = ({ _id, buildingName, city, postalCode, state, street, addressType }) => {
    this.setState({
      visible: true,
      addressId: _id,
      buildingName,
      city,
      postalCode,
      state,
      street,
      addressType,
    });
  };

  hideDialog = () => {
    this.setState({
      visible: false,
      showNewAddressForm: false,
      ...this.initialState,
    });
    this.forceUpdate();
  };

  handleUserInput = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  addNewAddress = () => {
    this.setState({
      showNewAddressForm: true,
    });
  };

  updateAddress = () => {
    const { addressId, buildingName, city, postalCode, state, street, addressType } = this.state;
    const { dispatch, user } = this.props;
    const updatePayload = { buildingName, city, postalCode, state, street, addressType };
    if (buildingName && city && postalCode && state && street && addressType) {
      dispatch(loaderStartAction());
      dispatch(updateAddressById(addressId, user?.uid, updatePayload));
    } else {
      Alert.alert('Error', 'Please fill all the fields.!');
    }
  };

  saveNewAddress = () => {
    const { dispatch, addressData, user } = this.props;
    const { buildingName, city, postalCode, state, street, addressType } = this.state;
    const payload = {
      buildingName,
      city,
      postalCode,
      state,
      street,
      addressType,
      isDefault: !!checkEmpty(addressData),
    };
    if (buildingName && city && postalCode && state && street && addressType) {
      dispatch(loaderStartAction());
      dispatch(addAddressAction(payload, user?.uid));
      this.setState(this.initialState);
    } else {
      Alert.alert('Error', 'Please fill all the fields.!');
    }
  };

  makeAddressDefault = async ({ _id }) => {
    try {
      const { user, addressData } = this.props;
      const defaultExist = !checkEmpty(addressData)
        ? addressData.findIndex((item) => item.isDefault)
        : -1;
      if (defaultExist > -1) {
        const isDefaultAddress = addressData[defaultExist]._id === _id;
        if (isDefaultAddress) {
          const res = await firestore()
            .collection('Address')
            .doc(user?.uid)
            .collection('user_address')
            .doc(_id)
            .update({
              isDefault: false,
            });
          if (!res) {
            Alert.alert('Success', 'Default address set successfully.');
            this.fetchAddress(this.props);
          }
        } else {
          Alert.alert('Info', 'You can have only 1 default address at a time.');
        }
      } else {
        const res = await firestore()
          .collection('Address')
          .doc(user?.uid)
          .collection('user_address')
          .doc(_id)
          .update({
            isDefault: true,
          });
        if (!res) {
          Alert.alert('Success', 'Default address set successfully.');
          this.fetchAddress(this.props);
        }
      }
    } catch (e) {
      console.log(e?.message);
    }
  };

  render() {
    const { addressData } = this.props;
    const {
      IMAGES: { background },
    } = APP_CONSTANTS;
    const {
      visible,
      buildingName,
      city,
      postalCode,
      state,
      street,
      showNewAddressForm,
      addressType,
    } = this.state;
    return (
      <ImageBackground source={background} style={{ flex: 1 }}>
        <SafeAreaView style={styles.addressEditContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.newAddressView}>
              <Button bordered caption="Add new address" onPress={this.addNewAddress} />
            </View>
            <View style={styles.addressCardContainer}>
              {!checkEmpty(addressData) ? (
                addressData.map((item) => {
                  return (
                    <Card style={styles.addressCard} key={item?._id}>
                      <Card.Title
                        titleStyle={styles.cardTitle}
                        title={item?.addressType}
                        left={(props) => (
                          <RadioButton
                            status={item?.isDefault ? 'checked' : 'unchecked'}
                            {...props}
                            onPress={() => this.makeAddressDefault(item)}
                          />
                        )}
                        right={(props) => (
                          <View style={styles.addressActionIcon}>
                            <IconButton
                              {...props}
                              icon="delete"
                              onPress={() => this.deleteAddress(item)}
                              color="#ff0000"
                            />
                            <IconButton
                              {...props}
                              color="#fff"
                              icon="square-edit-outline"
                              onPress={() => this.editAddress(item)}
                            />
                          </View>
                        )}
                      />
                      <Divider style={styles.dividerStyle} />
                      <Card.Content style={styles.cardContent}>
                        <View style={styles.addressInfo}>
                          <Text style={styles.label}>Building Name:</Text>
                          <Text style={styles.textContent}>{item?.buildingName || 'N/A'}</Text>
                        </View>
                        <View style={styles.addressInfo}>
                          <Text style={styles.label}>City:</Text>
                          <Text style={styles.textContent}>{item?.city || 'N/A'}</Text>
                        </View>
                        <View style={styles.addressInfo}>
                          <Text style={styles.label}>Postal Code:</Text>
                          <Text style={styles.textContent}>{item?.postalCode || 'N/A'}</Text>
                        </View>
                        <View style={styles.addressInfo}>
                          <Text style={styles.label}>State:</Text>
                          <Text style={styles.textContent}>{item?.state || 'N/A'}</Text>
                        </View>
                        <View style={styles.addressInfo}>
                          <Text style={styles.label}>Street:</Text>
                          <Text style={styles.textContent}>{item?.street || 'N/A'}</Text>
                        </View>
                      </Card.Content>
                    </Card>
                  );
                })
              ) : (
                <View style={styles.editAddressNoAddress}>
                  <Text style={styles.noAddressText}>No Address Found</Text>
                  <Text style={styles.noAddressText2}>Please add one.</Text>
                </View>
              )}
            </View>
          </ScrollView>
          <Portal>
            <Dialog visible={visible || showNewAddressForm} dismissable={false}>
              <Dialog.Title>{visible ? 'Edit Address' : 'Add New Address'}</Dialog.Title>
              <ScrollView style={{ width: '100%', height: 'auto' }}>
                <Dialog.Content>
                  {visible ? (
                    <RenderAddressEditForm
                      buildingName={buildingName}
                      city={city}
                      postalCode={postalCode}
                      state={state}
                      street={street}
                      addressType={addressType}
                      onChange={this.handleUserInput}
                    />
                  ) : null}
                  {showNewAddressForm ? (
                    <RenderNewAddressForm
                      buildingName={buildingName}
                      city={city}
                      postalCode={postalCode}
                      state={state}
                      street={street}
                      addressType={addressType}
                      onChange={this.handleUserInput}
                    />
                  ) : null}
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    rounded
                    style={styles.editProfileButton}
                    onPress={this.hideDialog}
                    caption="Cancel"
                  />
                  <Button
                    rounded
                    style={styles.editProfileButton}
                    onPress={visible ? this.updateAddress : this.saveNewAddress}
                    caption="Done"
                  />
                </Dialog.Actions>
              </ScrollView>
            </Dialog>
          </Portal>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

EditAddress.propTypes = {
  addressData: PropTypes.oneOfType([PropTypes.array]).isRequired,
  addAddress: PropTypes.oneOfType([PropTypes.object]).isRequired,
  updateAddress: PropTypes.oneOfType([PropTypes.object]).isRequired,
  addressDeleteStatus: PropTypes.oneOfType([PropTypes.object]).isRequired,
  user: PropTypes.oneOfType([PropTypes.object]).isRequired,
  dispatch: PropTypes.func.isRequired,
};
