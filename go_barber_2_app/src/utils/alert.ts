import {
  Alert,
  AlertButton,
  AlertOptions as RNAlertOptions,
} from 'react-native';

interface AlertOptions extends RNAlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface AsyncAlertButton extends AlertButton {
  value: any;
}
interface AsyncAlertOptions extends RNAlertOptions {
  title: string;
  message?: string;
  buttons?: AsyncAlertButton[];
}

const alert = (options: AlertOptions): void => {
  const { title, message, buttons, cancelable = true, onDismiss } = options;

  return Alert.alert(title, message, buttons, { cancelable, onDismiss });
};

export const asyncAlert = (options: AsyncAlertOptions): Promise<any> => {
  const { title, message, buttons, ...rest } = options;

  return new Promise<any>(resolve => {
    Alert.alert(
      title,
      message,
      buttons &&
        buttons.map(button => ({
          text: button.text,
          style: button.style,
          onPress: e => {
            button.onPress && button.onPress(e);
            resolve(button.value);
          },
        })),
      rest,
    );
  });
};

export default alert;
