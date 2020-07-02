import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default (yupError: ValidationError): Errors => {
  if (process.env.NODE_ENV === 'development') {
    console.log({ yupError });
  }

  return yupError.inner.reduce(
    (acc, error) => ({
      ...acc,
      [error.path]: error.message,
    }),
    {}
  );
};
