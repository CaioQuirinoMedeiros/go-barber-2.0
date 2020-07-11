import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => ({
  useField: () => {
    return {
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    };
  },
}));

describe('Input component', () => {
  it('should be able to render an input', async () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('inputContainer');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #ff9000');
    });
  });

  it('should keep highlight when input is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('inputContainer');

    fireEvent.change(inputElement, { target: { value: 'any@example.com' } });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('color: #ff9000');
    });
  });
});
