import { StatusBarProps, ScrollViewProps, ViewProps } from 'react-native';
import { offsets } from './styles';

export interface ScreenProps extends Partial<ScrollViewProps>, ViewProps {
  scroll?: boolean;
  safe?: boolean;
  statusBarProps?: StatusBarProps;
  keyboardOffset?: keyof typeof offsets;
}
