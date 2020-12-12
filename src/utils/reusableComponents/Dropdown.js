import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { colors } from '../../styles';
import ModalDropdown from './ModalDropdown';

const styles = {
  container: {
    display: 'flex',
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    paddingLeft: 10,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
  },
};

class DropDown extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpened: false,
    };
  }

  openModal = () => {
    this.setState({ isOpened: true });
  };

  closeModal = () => {
    this.setState({ isOpened: false });
  };

  renderRow = (text, color) => (
    <TouchableHighlight underlayColor="lightgray">
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ color }}>{text}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    const {
      items,
      color,
      onSelect,
      style,
      borderColor,
      height,
      selectedIndex,
      placeholder,
      outerColor,
    } = this.props;
    const { isOpened } = this.state;
    return (
      <ModalDropdown
        options={items}
        onDropdownWillShow={this.openModal}
        onDropdownWillHide={this.closeModal}
        style={style}
        dropdownStyle={{
          shadowColor: 'blue',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 1.0,
        }}
        adjustFrame={(params) => {
          Object.assign(params, { left: 30, right: 30 });
          return params;
        }}
        renderRow={(text) => this.renderRow(text, color)}
        onSelect={(index, data) => onSelect(index, data)}
      >
        <View style={[styles.container, { borderColor, height }]}>
          <Text style={{ color: outerColor }}>
            {selectedIndex > -1 && items[selectedIndex] ? items[selectedIndex] : placeholder}
          </Text>
          <Icon
            name={isOpened ? 'angle-up' : 'angle-down'}
            color={outerColor}
            size={20}
            style={styles.icon}
          />
        </View>
      </ModalDropdown>
    );
  }
}

DropDown.defaultProps = {
  placeholder: 'Please Select experience',
  selectedIndex: -1,
  color: colors.primary,
  borderColor: colors.primary,
  height: undefined,
  outerColor: '#fff',
  style: {},
};

DropDown.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array]).isRequired,
  color: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object]),
  borderColor: PropTypes.string,
  height: PropTypes.number,
  selectedIndex: PropTypes.number,
  placeholder: PropTypes.string,
  outerColor: PropTypes.string,
};

export default DropDown;
