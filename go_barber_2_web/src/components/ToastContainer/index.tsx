import React from 'react';
import { useTransition } from 'react-spring';

import { Toast as ToastType } from '../../hooks/toast';

import { Container } from './styles';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const toastsWithTransitions = useTransition(toasts, toast => toast.id, {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  });
  return (
    <Container>
      {toastsWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} toast={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
