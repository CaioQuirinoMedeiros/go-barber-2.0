import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container } from './styles';

const ButtonContainer: React.FC<RectButtonProperties> = ({
  children,
  ...rest
}) => {
  return <Container {...rest}>{children}</Container>;
};

export default ButtonContainer;
