import React, { RefObject } from 'react';
import { TextInputProps, TextInput as RNTextInput } from 'react-native';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name?: string;
  icon?: string;
  innerRef?: RefObject<RNTextInput>;
}

const Input: React.FC<InputProps> = ({ style, icon, innerRef, ...rest }) => {
  return (
    <Container style={style}>
      {icon && <Icon size={20} name={icon} color="#666360" />}
      <TextInput
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        ref={innerRef}
        {...rest}
      />
    </Container>
  );
};

export default Input;
