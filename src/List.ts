import { ActionSheetIOS, Platform, NativeModules } from "react-native";

const { RNNativeDialogs } = NativeModules;

interface IActionSheetOptions {
  options: string[];
  title?: string;
  message?: string;
  onSelect: (result: { label: string; index: number }) => void;
  onCancel?: () => void;
  /**
   * `null` is preferred on Android, @see https://material.io/design/components/dialogs.html#simple-dialog
   */
  cancelText?: string | null;
  destructiveIndex?: number;
}

export default class List {
  public static showActionSheet({
    options,
    title,
    message,
    onSelect,
    onCancel,
    cancelText,
    destructiveIndex
  }: IActionSheetOptions) {
    if (Platform.OS === "ios") {
      let cancelIndex = -1;
      if (cancelText) {
        cancelIndex = options.length;
        options.push(cancelText);
      }
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          title,
          message,
          destructiveButtonIndex: destructiveIndex,
          cancelButtonIndex: cancelIndex
        },
        index => {
          if (index === cancelIndex)  {
            onCancel && onCancel();
          } else {
            onSelect({
              label: options[index],
              index,
            })
          }
        }
      );
    } else if (Platform.OS === 'android') {
      const config: any = {
        title,
        content: message,
        items: options,
        onPositive: true,
      };
      if (cancelText) {
        config.positiveText = cancelText;
      }
      RNNativeDialogs.showPlainList(config, (type: string, ...rest: any[]) => {
        switch (type) {
          case 'onDismiss':
          case 'onPositive':
            onCancel && onCancel();
            break;
          case 'itemsCallback':
            
            const [selectedIndex] = rest;
            onSelect({
              label: options[selectedIndex],
              index: selectedIndex,
            })
            break;
          default:
            break;
        }
      })
    }
  }
}
