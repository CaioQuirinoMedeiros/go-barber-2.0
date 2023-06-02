import { StatusBarProps, ScrollViewProps, ViewProps } from 'react-native';

export interface ScreenProps extends Partial<ScrollViewProps>, ViewProps {
  scroll?: boolean;
  safeTop?: boolean;
  statusBarProps?: StatusBarProps;
  keyboardOffset?: boolean;
}
