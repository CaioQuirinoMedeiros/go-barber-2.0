import React, { ReactText } from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { MyTextProps } from '../Text';

import { Container, Text, Loading } from './styles';

interface ButtonProps extends RectButtonProperties {
  textProps?: MyTextProps;
  children: ReactText;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  textProps,
  loading,
  enabled = true,
  ...rest
}) => {
  return (
    <Container {...rest} enabled={enabled}>
      <Text bold {...textProps}>
        {children}
      </Text>
      {!!loading && <Loading color="#312e38" size={26} />}
    </Container>
  );
};

export default Button;
