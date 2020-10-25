import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenProps } from './props';
import { offsets, styles } from './styles';

const isAndroid = Platform.OS === 'android';

const Screen: React.FC<ScreenProps> = props => {
  const {
    scroll,
    style,
    safe,
    children,
    keyboardOffset,
    statusBarProps,
    ...rest
  } = props;

  const insets = useSafeArea();
  const insetStyle = { paddingTop: safe && isAndroid ? insets.top : 0 };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarProps?.barStyle || 'light-content');
      isAndroid &&
        StatusBar.setBackgroundColor(
          statusBarProps?.backgroundColor || 'transparent'
        );
      isAndroid &&
        StatusBar.setTranslucent(statusBarProps?.translucent || true);
    }, [statusBarProps])
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, insetStyle]}
      behavior={isAndroid ? undefined : 'padding'}
      keyboardVerticalOffset={offsets[keyboardOffset || 'none']}
    >
      <StatusBar translucent barStyle="light-content" {...statusBarProps} />

      {scroll ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          {...rest}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]} {...rest}>
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Screen;
