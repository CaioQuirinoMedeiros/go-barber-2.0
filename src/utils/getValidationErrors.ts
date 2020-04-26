import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default (yupError: ValidationError): Errors =>
  yupError.inner.reduce(
    (acc, error) => ({
      ...acc,
      [error.path]: error.message,
    }),
    {}
  );
