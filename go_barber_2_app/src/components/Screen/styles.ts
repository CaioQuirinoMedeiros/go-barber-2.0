import { Platform, StyleSheet } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const isIos = Platform.OS === 'ios';

/**
 * All screen keyboard offsets.
 */
export const offsets = {
  none: 0,
  forwardButton: isIos && !isIphoneX() ? 64 : 88,
  button: isIos && isIphoneX() ? 5 : 20,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewContainer: {
    flexGrow: 1,
  },
});
