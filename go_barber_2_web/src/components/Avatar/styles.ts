import styled from 'styled-components';

interface AvatarContainerProps {
  size: number;
}

export const AvatarContainer = styled.img<AvatarContainerProps>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 50%;
`;
