import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge } from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    width: 18,
  },
  badgeContainer: {
    position: 'absolute',
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
});

export default class IconWithBadge extends React.PureComponent {
  render() {
    const { children, options, badgeValue } = this.props;
    const { top = -5, right = 0, left = 15, bottom = 0, badgeProps } = options || {
      top: -5,
      right: 0,
      left: 15,
      bottom: 0,
      badgeProps: {},
    };

    return (
      <View>
        {children}
        {badgeValue ? (
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={badgeValue}
            status="error"
            containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
            {...badgeProps}
          />
        ) : null}
      </View>
    );
  }
}

IconWithBadge.defaultProps = {
  options: {
    top: -5,
    right: 0,
    left: 15,
    bottom: 0,
    badgeProps: {},
  },
};
IconWithBadge.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.oneOfType([PropTypes.object]),
  badgeValue: PropTypes.number.isRequired,
};
