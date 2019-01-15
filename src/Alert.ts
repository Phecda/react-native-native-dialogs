import {
  Alert as RNAlert,
  AlertButton,
  AlertIOS,
  AlertIOSButton,
  AlertOptions,
  AlertStatic,
  AlertType,
  KeyboardType,
  NativeModules,
  ReturnKeyType,
  ReturnKeyTypeAndroid,
  ReturnKeyTypeIOS,
  Platform
} from "react-native";
const { RNNativeDialogs } = NativeModules;

export type Nullable<T> = T | null;

export interface IAlertBase {
  title: string;
  detailText?: string;
}

export interface IPlainAlertOptions extends IAlertBase {
  /** According to both AHIG and MD, only up to 3 buttons accepted */
  buttons?: AlertButton[];
  options?: AlertOptions;
}

export interface IImageAlertOptions extends IPlainAlertOptions {
  base64: string;
}

export interface IPromptOptions extends IAlertBase {
  submitText?: string;
  submitDestructive?: boolean;
  onSubmit: (text?: string) => void;
  cancelText?: string;
  onCancel?: (text?: string) => void;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType | ReturnKeyTypeIOS | ReturnKeyTypeAndroid;
  type?: AlertType;
  defaultValue?: string;
}

class Alert {
  public static defaultOptions = {
    submitText: "确定",
    cancelText: "取消"
  };

  public static alertPlain({
    title,
    detailText,
    buttons,
    options
  }: IPlainAlertOptions) {
    const limitedButtons = buttons ? buttons.slice(0, 2) : buttons;
    RNAlert.alert(title, detailText, limitedButtons, options);
  }

  public static alertImage({
    title,
    detailText,
    buttons,
    options,
    base64
  }: IImageAlertOptions) {
    // TODO - implementation
  }

  public static prompt({
    title,
    detailText,
    cancelText,
    onCancel,
    submitText,
    submitDestructive,
    onSubmit,
    keyboardType,
    returnKeyType,
    type,
    defaultValue
  }: IPromptOptions) {
    if (Platform.OS === "ios") {
      const buttons: AlertIOSButton[] = [];
      if (submitText) {
        buttons.push({
          text: submitText,
          style: submitDestructive
            ? "destructive"
            : cancelText
            ? "default"
            : "cancel",
          onPress: onSubmit
        });
      }
      if (cancelText) {
        buttons.push({
          text: cancelText,
          style: "cancel",
          onPress: onCancel
        });
      }
      AlertIOS.prompt(
        title,
        detailText,
        buttons,
        type,
        defaultValue,
        keyboardType
      );
    } else if (Platform.OS === "android") {
      // TODO
    }
  }
}

export default Alert;
