import { ValidationError } from 'yup';

import { Toast } from '../hooks/toast';

export default (yupError: ValidationError): Array<Omit<Toast, 'id'>> =>
  yupError.inner.map(error => ({
    title: `Erro de validação [${error.path}]`,
    description: error.message,
    type: 'error',
  }));
