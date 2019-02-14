import {
  Platform,
  NativeModules,
  ImageSourcePropType,
  Image
} from "react-native";

const { RNNativeDialogs, NDActionSheetManager } = NativeModules;

interface IActionSheetOptions {
  options: Array<{
    title?: string;
    /** iOS only, better use with selectedIndex */
    titleTextAlignment?: "left" | "right" | "center";
    /** Only use local require type or base64 uri */
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
          options: options.map(option => ({
            ...option,
            icon: option.icon
              ? Image.resolveAssetSource(option.icon)
              : undefined
          })),
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
        items: options.map(opt => opt.title),
        cancelable,
        selectedIndex
      };
      RNNativeDialogs.showSimpleList(config, (type: string, ...rest: any[]) => {
        switch (type) {
          case "onDismiss":
            onCancel && onCancel();
            break;
          case "itemsCallback":
          case "itemsCallbackSingleChoice":
            const [selectionIndex] = rest;
            onSelect &&
              onSelect({
                label: options[selectionIndex].title || "",
                index: selectionIndex
              });
            break;
          default:
            break;
        }
      });
    }
  }
}
