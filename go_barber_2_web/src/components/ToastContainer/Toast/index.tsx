import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';

import { Toast as ToastType, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  toast: ToastType;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = props => {
  const { removeToast } = useToast();

  const {
    toast: { id, title, description, type },
    style,
  } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <Container hasDescription={Number(!!description)} type={type} style={style}>
      {icons[type || 'info']}

      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
