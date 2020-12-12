import InDev from '@/assets/animation/dev-mode.json';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button } from '.';
import { colors, fonts } from '../../styles';
import APP_CONSTANTS from '../appConstants/AppConstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  availableText: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
});

export default function FeatureInDevelopment({ navigation }) {
  const {
    IMAGES: { background },
  } = APP_CONSTANTS;

  return (
    <ImageBackground source={background} style={styles.container}>
      <View style={{ height: 200, width: '100%' }}>
        <LottieView source={InDev} autoPlay />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.availableText}>Currently</Text>
        <Text style={styles.availableText}>in</Text>
        <Text style={styles.availableText}>Development</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          large
          bordered
          rounded
          style={styles.button}
          caption="Home"
          onPress={() => navigation.navigate('home')}
        />
      </View>
    </ImageBackground>
  );
}

FeatureInDevelopment.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
