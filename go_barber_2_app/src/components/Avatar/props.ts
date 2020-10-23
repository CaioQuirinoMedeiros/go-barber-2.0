import { ImageProps } from 'react-native';

export interface AvatarProps extends ImageProps {
  nome: string;
  size?: number;
}
