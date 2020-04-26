import styled, { css } from 'styled-components/native';
import RNIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  isFocused?: boolean;
  error?: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  border: 2px solid #232129;

  ${({ error }) =>
    error &&
    css`
      border-color: #c53030;
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(RNIcon)`
  margin-right: 10px;
`;
