import styled from 'styled-components/native';

import MyText from '../Text';

interface AvatarContainerProps {
  size: number;
}

export const AvatarContainer = styled.View<AvatarContainerProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background: #27161d;
  border-width: 0.5px;
  border-color: #ff9000;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AvatarIniciais = styled(MyText)`
  color: #f4ede8;
  position: absolute;
  letter-spacing: 1px;
`;
