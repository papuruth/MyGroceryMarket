import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors } from '@/styles';

const STAR_IMAGE = require('@/assets/icons/airbnb-star.png');

const STAR_SELECTED_IMAGE = require('@/assets/icons/airbnb-star-selected.png');

const STAR_SIZE = 30;

const styles = StyleSheet.create({
  starStyle: {
    margin: 3,
  },
});

export default class Star extends PureComponent {
  constructor() {
    super();
    this.springValue = new Animated.Value(1);
  }

  spring = () => {
    const { position, starSelectedInPosition } = this.props;

    this.springValue.setValue(1.2);

    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 2,
      tension: 1,
      useNativeDriver: true,
    }).start();
    starSelectedInPosition(position);
  };

  render() {
    const { fill, starSize, selectedColor, isDisabled } = this.props;
    const starSource = fill && selectedColor === null ? STAR_SELECTED_IMAGE : STAR_IMAGE;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.spring} disabled={isDisabled}>
        <Animated.Image
          source={starSource}
          style={[
            styles.starStyle,
            {
              tintColor: fill && selectedColor ? selectedColor : colors.lightGray,
              width: starSize || STAR_SIZE,
              height: starSize || STAR_SIZE,
              transform: [{ scale: this.springValue }],
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
}

Star.defaultProps = {
  selectedColor: '#f1c40f',
  isDisabled: false,
  starSize: 25,
};

Star.propTypes = {
  fill: PropTypes.bool.isRequired,
  starSize: PropTypes.number,
  selectedColor: PropTypes.string,
  isDisabled: PropTypes.bool,
  position: PropTypes.number.isRequired,
  starSelectedInPosition: PropTypes.func.isRequired,
};
