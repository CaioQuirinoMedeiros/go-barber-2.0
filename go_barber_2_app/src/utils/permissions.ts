import { Platform } from 'react-native';
import {
  request,
  check,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import alert from './alert';

export const requestGaleriaPermission = async () => {
  const galeriaPermission = Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  });

  if (!galeriaPermission) return RESULTS.UNAVAILABLE;

  let permissionResult = await check(galeriaPermission);

  if (permissionResult === 'denied') {
    permissionResult = await request(galeriaPermission);
  } else if (permissionResult === 'blocked') {
    alert({
      title: 'Permitir acesso ao Armazenamento?',
      message: 'Abra configurações, toque em Permissões e ative Armazenamento',
      buttons: [
        {
          text: 'Abrir configurações',
          onPress: () => {
            openSettings();
          },
        },
      ],
    });
  }

  return permissionResult;
};

export const requestCameraPermission = async () => {
  const cameraPermission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  if (!cameraPermission) return RESULTS.UNAVAILABLE;

  let permissionResult = await check(cameraPermission);

  if (permissionResult === 'denied') {
    permissionResult = await request(cameraPermission);
  } else if (permissionResult === 'blocked') {
    alert({
      title: 'Permitir acesso a Câmera?',
      message: 'Abra configurações, toque em Permissões e ative Câmera',
      buttons: [
        {
          text: 'Abrir configurações',
          onPress: openSettings,
        },
      ],
    });
  }

  return permissionResult;
};
