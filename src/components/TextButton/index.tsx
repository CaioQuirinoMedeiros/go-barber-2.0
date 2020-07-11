import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { MyTextProps } from '../Text';

import { Container, Icon, Text } from './styles';

interface TextButtonProps extends MyTextProps {
  onPress(): void;
  buttonProps?: TouchableOpacityProps;
  icon?: string;
  iconProps?: {
    name?: string;
    size?: number;
    color?: string;
  };
}

const TextButton: React.FC<TextButtonProps> = ({
  children,
  icon,
  iconProps,
  onPress,
  buttonProps,
  ...rest
}) => {
  return (
    <Container onPress={onPress} {...buttonProps}>
      {icon && <Icon name={icon} size={20} color="#fff" {...iconProps} />}
      <Text {...rest}>{children}</Text>
    </Container>
  );
};

export default TextButton;
