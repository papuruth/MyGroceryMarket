import PropTypes from 'prop-types';
import React from 'react';
import { TextInput as RNPTextInput } from 'react-native-paper';

export default class TextInput extends React.PureComponent {
  constructor(props) {
    const { value } = props;
    super();
    this.state = {
      inputValue: value,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    if (value !== prevState.inputValue) {
      this.updateState(value);
    }
  }

  updateState = (value) => {
    this.setState({
      inputValue: value,
    });
  };

  changeText = (text) => {
    const { onChangeText } = this.props;
    this.setState({
      inputValue: text,
    });
    onChangeText(text);
  };

  render() {
    const { inputValue } = this.state;
    const { inputRef } = this.props;
    return (
      <RNPTextInput
        {...this.props}
        ref={inputRef}
        onChangeText={this.changeText}
        value={inputValue}
      />
    );
  }
}

TextInput.defaultProps = {
  inputRef: () => {},
  value: '',
};
TextInput.propTypes = {
  value: PropTypes.string,
  inputRef: PropTypes.func,
  onChangeText: PropTypes.func.isRequired,
};
