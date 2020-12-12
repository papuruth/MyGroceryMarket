// import ListView from "deprecated-react-native-listview";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
  },
  modal: {
    flexGrow: 1,
  },
  dropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 11,
    color: 'gray',
    backgroundColor: 'white',
    textAlignVertical: 'center',
  },
  highlightedRowText: {
    color: 'black',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray',
  },
});

export default class ModalDropdown extends Component {
  constructor(props) {
    super();
    this.button = null;
    this.buttonFrame = null;
    this.nextValue = null;
    this.nextIndex = null;

    this.state = {
      loading: !props.options,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let { buttonText, selectedIndex } = state;
    const { defaultIndex, defaultValue, options } = props;
    const stateObj = {};
    buttonText = this.nextValue == null ? buttonText : this.nextValue;
    selectedIndex = this.nextIndex == null ? selectedIndex : this.nextIndex;
    if (selectedIndex < 0 && buttonText !== defaultValue && selectedIndex !== defaultIndex) {
      Object.assign(stateObj, { selectedIndex: defaultIndex, buttonText: defaultValue });
    }
    this.nextValue = null;
    this.nextIndex = null;
    if (state.loading !== options) {
      Object.assign(stateObj, { loading: !options });
    }

    return stateObj;
  }

  updatePosition = (callback) => {
    if (this.button && this.button.measure) {
      this.button.measure((fx, fy, width, height, px, py) => {
        this.buttonFrame = { x: px, y: py, w: width, h: height };
        if (callback) callback();
      });
    }
  };

  show = () => {
    this.updatePosition(() => {
      this.setState({
        showDropdown: true,
      });
    });
  };

  hide = () => {
    this.setState({
      showDropdown: false,
    });
  };

  select = (idx) => {
    const { defaultValue, options, defaultIndex, renderButtonText } = this.props;

    let value = defaultValue;
    let index = idx;
    if (index === null || !options || index >= options.length) {
      index = defaultIndex;
    }

    if (index >= 0) {
      value = renderButtonText ? renderButtonText(options[index]) : options[index].toString();
    }

    this.nextValue = value;
    this.nextIndex = index;

    this.setState({
      buttonText: value,
      selectedIndex: index,
    });
  };

  renderButton = () => {
    const { disabled, accessible, textStyle, children } = this.props;
    const { buttonText } = this.state;

    return (
      <TouchableOpacity
        ref={(button) => {
          this.button = button;
        }}
        disabled={disabled}
        accessible={accessible}
        onPress={this.onButtonPress}
      >
        {children || (
          <View style={styles.button}>
            <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>
              {buttonText}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  onButtonPress = () => {
    const { onDropdownWillShow } = this.props;
    if (!onDropdownWillShow || onDropdownWillShow() !== false) {
      this.show();
    }
  };

  renderModal = () => {
    const { animated, accessible, dropdownStyle } = this.props;
    const { showDropdown, loading } = this.state;
    if (showDropdown && this.buttonFrame) {
      const frameStyle = this.calcPosition();
      const animationType = animated ? 'fade' : 'none';
      return (
        <Modal
          animationType={animationType}
          visible
          transparent
          onRequestClose={this.onRequestClose}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
        >
          <TouchableWithoutFeedback
            accessible={accessible}
            disabled={!showDropdown}
            onPress={this.onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                {loading ? this.renderLoading() : this.renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
    return null;
  };

  calcPosition = () => {
    const { dropdownStyle, style, adjustFrame } = this.props;

    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    const dropdownHeight =
      (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
      StyleSheet.flatten(styles.dropdown).height;

    const bottomSpace = windowHeight - this.buttonFrame.y - this.buttonFrame.h;
    const rightSpace = windowWidth - this.buttonFrame.x;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this.buttonFrame.y;
    const showInLeft = rightSpace >= this.buttonFrame.x;

    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom
        ? this.buttonFrame.y + this.buttonFrame.h
        : Math.max(0, this.buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = this.buttonFrame.x;
    } else {
      const dropdownWidth =
        (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) ||
        -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - this.buttonFrame.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  };

  onRequestClose = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  onModalPress = () => {
    const { onDropdownWillHide } = this.props;
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  renderLoading = () => {
    return <ActivityIndicator size="small" />;
  };

  renderDropdown = () => {
    const {
      scrollEnabled,
      showsVerticalScrollIndicator,
      keyboardShouldPersistTaps,
      options,
    } = this.props;
    return (
      <FlatList
        scrollEnabled={scrollEnabled}
        style={styles.list}
        ItemSeparatorComponent={this.renderSeparator}
        data={options}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRow}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      />
    );
  };

  keyExtractor = (item, index) => `${index}`;

  renderRow = ({ item: rowData, index: rowID }) => {
    const { renderRow, dropdownTextStyle, dropdownTextHighlightStyle } = this.props;
    const { selectedIndex } = this.state;
    const key = `row_${rowID}`;
    const highlighted = rowID === selectedIndex;
    const row = !renderRow ? (
      <Text
        style={[
          styles.rowText,
          dropdownTextStyle,
          highlighted && styles.highlightedRowText,
          highlighted && dropdownTextHighlightStyle,
        ]}
      >
        {rowData}
      </Text>
    ) : (
      renderRow(rowData, rowID, highlighted)
    );

    const props = { ...row.props };
    props.key = key;
    props.onPress = () => this.onRowPress(rowData, rowID);
    const { children } = row.props;
    return <TouchableHighlight {...props}>{children}</TouchableHighlight>;
  };

  onRowPress = (rowData, rowID) => {
    const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
    if (!onSelect || onSelect(rowID, rowData) !== false) {
      // highlightRow(sectionID, rowID);
      const value = (renderButtonText && renderButtonText(rowData)) || rowData.toString();
      this.nextValue = value;
      this.nextIndex = rowID;
      this.setState({
        buttonText: value,
        selectedIndex: rowID,
      });
    }
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false,
      });
    }
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    return (
      <View {...this.props}>
        {this.renderButton()}
        {this.renderModal()}
      </View>
    );
  }
}

ModalDropdown.propTypes = {
  disabled: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  defaultIndex: PropTypes.number,
  defaultValue: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array]),
  accessible: PropTypes.bool,
  animated: PropTypes.bool,
  children: PropTypes.node.isRequired,
  showsVerticalScrollIndicator: PropTypes.bool,
  keyboardShouldPersistTaps: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  dropdownTextHighlightStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  adjustFrame: PropTypes.func,
  renderRow: PropTypes.func,
  renderSeparator: PropTypes.func,
  renderButtonText: PropTypes.func,
  onDropdownWillShow: PropTypes.func,
  onDropdownWillHide: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
};

ModalDropdown.defaultProps = {
  disabled: false,
  scrollEnabled: true,
  defaultIndex: -1,
  defaultValue: 'Please select...',
  options: null,
  animated: true,
  accessible: true,
  showsVerticalScrollIndicator: true,
  keyboardShouldPersistTaps: 'never',
  style: undefined,
  textStyle: undefined,
  dropdownStyle: undefined,
  dropdownTextStyle: undefined,
  dropdownTextHighlightStyle: undefined,
  adjustFrame: undefined,
  renderRow: undefined,
  renderSeparator: undefined,
  renderButtonText: undefined,
  onDropdownWillShow: undefined,
  onDropdownWillHide: undefined,
};
