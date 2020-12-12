import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Image, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../styles';

const borderRadius = 40;
const HEIGHT = 40;
const HEIGHT_SMALL = 30;
const HEIGHT_LARGE = 50;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    // borderWidth: 1 / PixelRatio.get(),
  },
  containerSmall: {
    height: HEIGHT_SMALL,
  },
  containerLarge: {
    height: HEIGHT_LARGE,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttonSmall: {
    paddingHorizontal: 15,
  },
  border: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: 'transparent',
    // borderRadius: 5,
  },
  rounded: {
    borderRadius: HEIGHT_LARGE / 2,
  },
  icon: {
    maxHeight: HEIGHT - 20,
    maxWidth: HEIGHT - 20,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 15,
    fontFamily: fonts.primaryBold,
  },
  captionSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  captionWithIcon: {
    marginLeft: 12,
  },
  primaryCaption: {
    color: 'white',
  },
  secondaryCaption: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  action: {
    borderRadius: 20,
    height: HEIGHT,
    width: HEIGHT,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Button(props) {
  const {
    caption,
    icon,
    bordered,
    small,
    bgColor,
    rounded,
    loading,
    children,
    style,
    onPress,
    isDisabled,
    action,
    bgGradientStart,
    bgGradientEnd,
    textColor,
    secondary,
    primary,
    large,
  } = props;
  let iconMod;
  if (icon) {
    iconMod = <Image resizeMode="contain" source={icon} style={styles.icon} />;
  }

  let content;

  if (bordered) {
    const borderedStyle = [
      styles.button,
      small && styles.buttonSmall,
      styles.border,
      primary && {
        borderColor: colors.primary,
      },
      secondary && {
        borderColor: colors.secondary,
      },
      bgColor && {
        borderColor: props.bgColor,
      },
      rounded && styles.rounded,
    ];
    const textStyle = [
      styles.caption,
      small && styles.captionSmall,
      styles.secondaryCaption,
      iconMod && styles.captionWithIcon,
      primary && {
        color: colors.primary,
      },
      secondary && {
        color: colors.secondary,
      },
      bgColor && {
        color: props.bgColor,
      },
      textColor && {
        color: textColor,
      },
    ];

    content = (
      <View style={borderedStyle}>
        {iconMod && <View>{iconMod}</View>}
        {loading && <ActivityIndicator color="white" />}
        {!loading && caption && <Text style={textStyle}>{caption}</Text>}
        {children && children}
      </View>
    );
  } else {
    const isPrimary = primary || (!primary && !secondary);
    let gradientArray =
      bgGradientStart && bgGradientEnd ? [bgGradientStart, bgGradientEnd] : undefined;

    if (!gradientArray) {
      gradientArray = isPrimary
        ? [colors.primaryGradientStart, colors.primaryGradientEnd]
        : [colors.secondaryGradientStart, colors.secondaryGradientEnd];
    }

    if (bgColor) {
      gradientArray = [bgColor, bgColor];
    }

    content = (
      <LinearGradient
        start={{ x: 0.5, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={gradientArray}
        style={[
          styles.button,
          small && styles.buttonSmall,
          styles.primaryButton,
          rounded && { borderRadius },
          action && styles.action,
          style,
        ]}
      >
        {iconMod && <View>{iconMod}</View>}
        {loading && <ActivityIndicator color="white" />}
        {!loading && props.caption && (
          <Text
            style={[
              styles.caption,
              small && styles.captionSmall,
              iconMod && styles.captionWithIcon,
              styles.primaryCaption,
              { color: textColor },
            ]}
          >
            {caption}
          </Text>
        )}
        {!loading && children ? children : null}
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      accessibilityTraits="button"
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        small && styles.containerSmall,
        large && styles.containerLarge,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

Button.defaultProps = {
  bordered: false,
  small: false,
  large: false,
  loading: false,
  rounded: false,
  bgColor: undefined,
  icon: undefined,
  children: undefined,
  style: undefined,
  isDisabled: undefined,
  action: undefined,
  bgGradientStart: undefined,
  bgGradientEnd: undefined,
  textColor: colors.white,
  secondary: undefined,
  primary: undefined,
};

Button.propTypes = {
  bordered: PropTypes.bool,
  small: PropTypes.bool,
  loading: PropTypes.bool,
  large: PropTypes.bool,
  icon: PropTypes.number,
  bgColor: PropTypes.string,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  rounded: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  caption: PropTypes.string.isRequired,
  action: PropTypes.string,
  bgGradientStart: PropTypes.string,
  bgGradientEnd: PropTypes.string,
  textColor: PropTypes.string,
  secondary: PropTypes.bool,
  primary: PropTypes.bool,
};
