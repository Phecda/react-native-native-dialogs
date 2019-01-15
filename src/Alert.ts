import {
  Alert as RNAlert,
  AlertButton,
  AlertIOSButton,
  AlertOptions,
  AlertStatic,
  AlertType,
  KeyboardType,
  NativeModules,
  ReturnKeyType,
  ReturnKeyTypeAndroid,
  ReturnKeyTypeIOS,
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
  cancelText?: string;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType | ReturnKeyTypeIOS | ReturnKeyTypeAndroid;
  type?: AlertType;
}

class Alert {
  public static defaultOptions = {};

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
    options
  }: IImageAlertOptions) {
   // TODO - implementation
  }

  public static prompt({

  }) {
    // TODO 
  }

}

export default Alert;
