import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  focused: boolean;
  filled: boolean;
  error?: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  background: #232129;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  border: 2px solid #232129;
  color: #666360;

  ${({ error }) =>
    error &&
    css`
      border-color: #c53030;
    `}

  ${({ focused }) =>
    focused &&
    css`
      border-color: #ff9000;
    `}

  ${({ filled }) =>
    filled &&
    css`
      color: #ff9000;
    `}


  & + div {
    margin-top: 8px;
  }

  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
