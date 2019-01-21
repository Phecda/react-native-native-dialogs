import { Platform, NativeModules, ImageSourcePropType } from "react-native";

const { RNNativeDialogs, NDActionSheetManager } = NativeModules;

interface IActionSheetOptions {
  options: Array<{
    title?: string;
    /** iOS only, better use with selectedIndex */
    titleTextAlignment?: "left" | "right" | "center";
    icon?: ImageSourcePropType;
  }>;
  title?: string;
  message?: string;
  onSelect?: (result: { label: string; index: number }) => void;
  onCancel?: () => void;
  cancelText?: string;
  cancelable?: boolean;
  destructiveIndex?: number;
  selectedIndex?: number;
}

export default class List {
  public static showActionSheet({
    options,
    title,
    message,
    onSelect,
    onCancel,
    cancelable = true,
    cancelText,
    destructiveIndex,
    selectedIndex
  }: IActionSheetOptions) {
    if (Platform.OS === "ios") {
      let cancelIndex = -1;
      if (cancelable) {
        cancelIndex = options.length;
        options.push({ title: cancelText });
      }
      NDActionSheetManager.showActionSheetWithOptions(
        {
          options,
          title,
          message,
          selectedIndex,
          destructiveButtonIndex: destructiveIndex,
          cancelButtonIndex: cancelIndex
        },
        (index: number) => {
          if (index === cancelIndex) {
            onCancel && onCancel();
          } else {
            onSelect &&
              onSelect({
                label: options[index].title || "",
                index
              });
          }
        }
      );
    } else if (Platform.OS === "android") {
      const config: any = {
        title,
        content: message,
        items: options,
        onPositive: true
      };
      if (cancelText) {
        config.positiveText = cancelText;
      }
      RNNativeDialogs.showPlainList(config, (type: string, ...rest: any[]) => {
        switch (type) {
          case "onDismiss":
          case "onPositive":
            onCancel && onCancel();
            break;
          case "itemsCallback":
            const [selectedIndex] = rest;
            onSelect &&
              onSelect({
                label: options[selectedIndex].title || "",
                index: selectedIndex
              });
            break;
          default:
            break;
        }
      });
    }
  }
}
