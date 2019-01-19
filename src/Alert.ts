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
  Platform,
  KeyboardTypeOptions
} from "react-native";
const { NDAlertManager } = NativeModules;

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
  onSubmit: (texts: string[]) => void;
  cancelText?: string;
  onCancel?: (text?: string) => void;
  /** Better not set more than 2 textfields */
  textInputConfigs?: Array<{
    secureTextEntry?: boolean;
    placeholder?: string;
    defaultValue?: string;
    keyboardType?: KeyboardTypeOptions;
  }>;
}

class Alert {
  public static defaultOptions = {
    submitText: "确定",
    cancelText: "取消"
  };

  public static setDefaultOptions(options: {
    submitText?: string;
    cancelText?: string;
  }) {
    Alert.defaultOptions = { ...Alert.defaultOptions, ...options };
  }

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
    if (Platform.OS === "ios") {
      if (NDAlertManager) {
        const callbacks: any[] = [];
        const newButtons: any[] = [];
        let cancelButtonKey;
        let destructiveButtonKey;
        if (buttons) {
          buttons.forEach((btn, index) => {
            callbacks[index] = btn.onPress;
            if (btn.style === "cancel") {
              cancelButtonKey = String(index);
            } else if (btn.style === "destructive") {
              destructiveButtonKey = String(index);
            }
            if (btn.text || index < (buttons || []).length - 1) {
              const btnDef: any = {};
              btnDef[index] = btn.text || "";
              newButtons.push(btnDef);
            }
          });
        }

        NDAlertManager.alertWithArgs(
          {
            title: title || "",
            message: detailText || undefined,
            buttons: newButtons,
            base64: base64,
            cancelButtonKey,
            destructiveButtonKey
          },
          (buttonKey: string) => {
            const cb = callbacks[Number(buttonKey)];
            cb && cb();
          }
        );
      }
    }
  }

  public static prompt({
    title,
    detailText,
    cancelText = Alert.defaultOptions.cancelText,
    onCancel,
    submitText = Alert.defaultOptions.submitText,
    submitDestructive,
    onSubmit,
    textInputConfigs
  }: IPromptOptions) {
    if (Platform.OS === "ios") {
      if (NDAlertManager) {
        const callbacks: any[] = [];
        const newButtons: any[] = [];
        let cancelButtonKey;
        let destructiveButtonKey;
        const buttons = [
          {
            text: cancelText,
            style: "cancel",
            onPress: onCancel
          },
          {
            text: submitText,
            onPress: onSubmit,
            style: submitDestructive ? "destructive" : undefined
          }
        ];
        buttons.forEach((btn, index) => {
          callbacks[index] = btn.onPress;
          if (btn.style === "cancel") {
            cancelButtonKey = String(index);
          } else if (btn.style === "destructive") {
            destructiveButtonKey = String(index);
          }
          if (btn.text || index < (buttons || []).length - 1) {
            const btnDef: any = {};
            btnDef[index] = btn.text || "";
            newButtons.push(btnDef);
          }
        });

        NDAlertManager.alertWithArgs(
          {
            title: title || "",
            message: detailText || undefined,
            buttons: newButtons,
            textInputConfigs,
            cancelButtonKey,
            destructiveButtonKey
          },
          (buttonKey: string, texts: string[]) => {
            const cb = callbacks[Number(buttonKey)];
            cb && cb(texts);
          }
        );
      }
    } else if (Platform.OS === "android") {
      // TODO
    }
  }
}

export default Alert;
