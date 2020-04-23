import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface InputPorps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputPorps> = ({ icon: Icon, ...rest }) => {
  return (
    <Container>
      {!!Icon && <Icon size={20} />}
      <input {...rest} />
    </Container>
  );
};

export default Input;
