import TextInput from '@/utils/reusableComponents/TextInput';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { Caption, RadioButton, Text } from 'react-native-paper';
import { styles } from '../styles';

export const RenderAddressEditForm = ({
  buildingName,
  city,
  postalCode,
  state,
  street,
  onChange,
  addressType,
}) => {
  let cityInputRef;
  let postalInputRef;
  let stateInputRef;
  let streetInputRef;
  return (
    <View style={styles.inputFieldsContainer}>
      <TextInput
        style={styles.inputFields}
        label="Building Name"
        mode="outlined"
        onSubmitEditing={() => cityInputRef.focus()}
        blurOnSubmit={false}
        value={buildingName}
        onChangeText={(text) => onChange('buildingName', text)}
      />
      <TextInput
        style={styles.inputFields}
        label="City"
        mode="outlined"
        value={city}
        onSubmitEditing={() => postalInputRef.focus()}
        inputRef={(cityRef) => {
          cityInputRef = cityRef;
        }}
        blurOnSubmit={false}
        onChangeText={(text) => onChange('city', text)}
      />
      <TextInput
        style={styles.inputFields}
        label="Postal Code"
        mode="outlined"
        keyboardType="number-pad"
        value={postalCode}
        onSubmitEditing={() => stateInputRef.focus()}
        inputRef={(postalRef) => {
          postalInputRef = postalRef;
        }}
        blurOnSubmit={false}
        onChangeText={(text) => onChange('postalCode', text)}
      />
      <TextInput
        style={styles.inputFields}
        label="State"
        mode="outlined"
        value={state}
        onSubmitEditing={() => streetInputRef.focus()}
        inputRef={(stateRef) => {
          stateInputRef = stateRef;
        }}
        blurOnSubmit={false}
        onChangeText={(text) => onChange('state', text)}
      />
      <TextInput
        style={styles.inputFields}
        label="Street"
        mode="outlined"
        inputRef={(streetRef) => {
          streetInputRef = streetRef;
        }}
        onSubmitEditing={() => streetInputRef.blur()}
        value={street}
        onChangeText={(text) => onChange('street', text)}
      />
      <View style={styles.checkbox}>
        <Text style={styles.label}>Address Type:</Text>
        <RadioButton
          value={addressType}
          status={addressType === 'Home' ? 'checked' : 'unchecked'}
          onPress={() => onChange('addressType', 'Home')}
        />
        <Caption>Home</Caption>
        <RadioButton
          value={addressType}
          status={addressType === 'Office' ? 'checked' : 'unchecked'}
          onPress={() => onChange('addressType', 'Office')}
        />
        <Caption>Office</Caption>
      </View>
    </View>
  );
};

RenderAddressEditForm.propTypes = {
  buildingName: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  addressType: PropTypes.string.isRequired,
};
