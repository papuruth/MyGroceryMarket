import { fonts } from '@/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Star from './Star';

const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageText: {
    color: '#f1c40f',
    fontSize: 20,
    fontFamily: fonts.primarySemiBold,
    paddingRight: 5,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Rating extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { startingValue } = nextProps;

    if (startingValue !== prevState.startingValue) {
      return {
        position: startingValue,
        startingValue,
      };
    }
    return null;
  }

  constructor() {
    super();

    this.state = {
      position: 5,
    };
  }

  componentDidMount() {
    const { startingValue } = this.props;
    this.setState({ position: startingValue });
  }

  renderStars = (rating_array) => {
    return _.map(rating_array, (star) => {
      return star;
    });
  };

  starSelectedInPosition = (position) => {
    const { onFinishRating } = this.props;
    if (typeof onFinishRating === 'function') onFinishRating(position);
    this.setState({ position });
  };

  render() {
    const { position } = this.state;
    const {
      totalRating,
      showRating,
      starContainerStyle,
      startingValue,
      ratingTextSize,
      ratingTextColor,
    } = this.props;
    const rating_array = [];
    const localStarContainerStyle = [styles.starContainer];
    if (starContainerStyle) {
      localStarContainerStyle.push(starContainerStyle);
    }

    _.times(5, (index) => {
      rating_array.push(
        <Star
          key={index}
          position={index + 1}
          starSelectedInPosition={this.starSelectedInPosition}
          fill={position >= index + 1}
          {...this.props}
        />,
      );
    });

    return (
      <View style={styles.ratingContainer}>
        {showRating && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.averageText}>{startingValue}</Text>
            <Text style={[styles.reviewText, { fontSize: ratingTextSize, color: ratingTextColor }]}>
              ({totalRating} ratings)
            </Text>
          </View>
        )}
        <View style={localStarContainerStyle}>{this.renderStars(rating_array)}</View>
      </View>
    );
  }
}

Rating.defaultProps = {
  showRating: false,
  ratingTextSize: 16,
  ratingTextColor: '#f1c40f',
  starContainerStyle: {},
};

Rating.propTypes = {
  startingValue: PropTypes.number.isRequired,
  showRating: PropTypes.bool,
  totalRating: PropTypes.number.isRequired,
  onFinishRating: PropTypes.func.isRequired,
  ratingTextSize: PropTypes.number,
  ratingTextColor: PropTypes.string,
  starContainerStyle: PropTypes.oneOfType([PropTypes.object]),
};
