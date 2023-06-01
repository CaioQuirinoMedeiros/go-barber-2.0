import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default (yupError: ValidationError): Errors => {
  if (import.meta.env.DEV) {
    console.log({ yupError });
  }

  return yupError.inner.reduce(
    (acc, error) => ({
      ...acc,
      [error.path || '']: error.message,
    }),
    {},
  );
};
