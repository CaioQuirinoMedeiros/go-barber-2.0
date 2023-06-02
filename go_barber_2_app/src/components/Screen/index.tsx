import React, { useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenProps } from './props';
import { styles } from './styles';

const isAndroid = Platform.OS === 'android';

const keyboardVerticalOffset = Platform.select({
  ios: 100,
  default: 76,
});

function Screen(props: ScreenProps) {
  const {
    scroll,
    style,
    safeTop,
    children,
    keyboardOffset,
    statusBarProps,
    ...rest
  } = props;

  const insets = useSafeAreaInsets();
  const insetStyle = { paddingTop: safeTop && isAndroid ? insets.top : 0 };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarProps?.barStyle || 'light-content');
      isAndroid &&
        StatusBar.setBackgroundColor(
          statusBarProps?.backgroundColor || 'transparent',
        );
      isAndroid &&
        StatusBar.setTranslucent(statusBarProps?.translucent || true);
    }, [statusBarProps]),
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, insetStyle]}
      behavior={isAndroid ? undefined : 'padding'}
      keyboardVerticalOffset={
        keyboardOffset ? keyboardVerticalOffset : undefined
      }>
      <StatusBar translucent barStyle="light-content" {...statusBarProps} />

      {scroll ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          {...rest}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]} {...rest}>
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

export default Screen;
