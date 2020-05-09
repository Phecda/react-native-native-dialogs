import { NativeModules, Platform, processColor, Image } from 'react-native';
const { RNNativeDialogs, NDAlertManager, NDActionSheetManager } = NativeModules;
export async function showActionSheet(options) {
  const nativeMethod =
    Platform.OS === 'ios'
      ? NDActionSheetManager.showActionSheetWithOptions
      : Platform.OS === 'android'
      ? RNNativeDialogs.showActionSheet
      : () => {};
  const { icons } = options;
  let processedIcons;
  if (icons) {
    processedIcons = icons.map((icon) => Image.resolveAssetSource(icon));
  }
  return new Promise((resolve, reject) => {
    nativeMethod({ ...options, icons: processedIcons }, (result) => {
      if (!result && result !== 0) {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
export async function showPrompt(promptOptions) {
  let result = '';
  if (Platform.OS === 'android') {
    const {
      submitText = 'Submit',
      cancelText = 'Cancel',
      submitDestructive,
      ...options
    } = promptOptions;
    result = await RNNativeDialogs.showPrompt({
      positiveText: submitText,
      negativeText: cancelText,
      positiveColor: processColor(submitDestructive ? 'red' : 'black'),
      negativeColor: processColor('black'),
      ...options,
    });
  } else if (Platform.OS === 'ios') {
    result = await NDAlertManager.alertWithArgs(promptOptions);
  }
  return result;
}
