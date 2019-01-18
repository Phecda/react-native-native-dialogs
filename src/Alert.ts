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
const { RNNativeDialogs, NDAlertManager } = NativeModules;

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

        NDAlertManager.alertWithArgs({
          title: title || "",
          message:  detailText|| undefined,
          buttons: newButtons,
          base64: base64,
          cancelButtonKey,
          destructiveButtonKey
        }, (buttonKey: string) =>{
          const cb = callbacks[Number(buttonKey)];
          cb && cb();
        });
      }
    }
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
        buttons.length ? buttons : onSubmit,
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
