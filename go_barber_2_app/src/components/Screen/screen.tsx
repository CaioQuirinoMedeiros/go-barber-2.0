import React, { useCallback } from "react"
import { KeyboardAvoidingView, ScrollView, View, StatusBar } from "react-native"
import { useSafeArea } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"

import { color } from "~/theme"
import { isIos, isAndroid } from "~/utils/device"
import { contaScreen } from "~/../e2e/testIDStrings"
import { testProps } from "~/utils/testProps"

import { ScreenProps } from "./screen.props"
import { offsets, styles } from "./screen.presets"

/**
 * Componente container para as telas
 */
export const Screen: React.FC<ScreenProps> = props => {
  const { scroll, style, safe, children, keyboardOffset, statusBarProps, ...rest } = props

  const insets = useSafeArea()
  const insetStyle = { paddingTop: safe ? (isAndroid ? insets.top : 0) : 0 }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarProps?.barStyle || "dark-content")
      isAndroid &&
        StatusBar.setBackgroundColor(statusBarProps?.backgroundColor || color.transparent)
      isAndroid && StatusBar.setTranslucent(statusBarProps?.translucent || true)
    }, [statusBarProps]),
  )

  return (
    <KeyboardAvoidingView
      style={[styles.container, insetStyle]}
      behavior={isIos ? "padding" : null}
      keyboardVerticalOffset={offsets[keyboardOffset || "none"]}
    >
      <StatusBar
        translucent
        backgroundColor={color.transparent}
        barStyle="dark-content"
        {...statusBarProps}
      />

      {scroll ? (
        <ScrollView
          {...testProps(contaScreen.scrollView)}
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
  )
}
