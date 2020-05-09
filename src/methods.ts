import {
  NativeModules,
  Platform,
  processColor,
  Image,
  ImageResolvedAssetSource,
} from 'react-native';
import { ActionSheetOptions, PromptOptions } from './types';

const { RNNativeDialogs, NDAlertManager, NDActionSheetManager } = NativeModules;

export async function showActionSheet(options: ActionSheetOptions) {
  const nativeMethod =
    Platform.OS === 'ios'
      ? NDActionSheetManager.showActionSheetWithOptions
      : Platform.OS === 'android'
      ? RNNativeDialogs.showActionSheet
      : () => {};
  const { icons } = options;
  let processedIcons: ImageResolvedAssetSource[];
  if (icons) {
    processedIcons = icons.map((icon) => Image.resolveAssetSource(icon));
  }
  return new Promise<number>((resolve, reject) => {
    nativeMethod({ ...options, icons: processedIcons }, (result?: number) => {
      if (!result && result !== 0) {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

export async function showPrompt(promptOptions: PromptOptions) {
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
