import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { MyTextProps } from '../Text';

import { Container, Text } from './styles';

interface ButtonProps extends RectButtonProperties {
  textProps?: MyTextProps;
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, textProps, ...rest }) => {
  return (
    <Container {...rest}>
      <Text bold {...textProps}>
        {children}
      </Text>
    </Container>
  );
};

export default Button;
