import { KeyboardTypeOptions, NativeModules, Platform } from "react-native";
const { RNNativeDialogs, NDAlertManager } = NativeModules;

export interface IAlertBase {
  title: string;
  detailText?: string;
}

export interface IPromptOptions extends IAlertBase {
  submitText?: string;
  submitDestructive?: boolean;
  onSubmit: (text: string) => void;
  cancelText?: string;
  onCancel?: (text?: string) => void;
  textInputConfig?: {
    secureTextEntry?: boolean;
    placeholder?: string;
    defaultValue?: string;
    keyboardType?: KeyboardTypeOptions;

    /** Android Only */
    maxLength?: number;
    minLength?: number;
    allowEmptyInput?: boolean;
  };
}

class Alert {
  public static defaultOptions: Partial<IPromptOptions> = {
    submitText: "OK",
    cancelText: "Cancel"
  };

  public static setDefaultOptions(options: Partial<IPromptOptions>) {
    Alert.defaultOptions = { ...Alert.defaultOptions, ...options };
  }

  public static prompt({
    title,
    detailText,
    cancelText = Alert.defaultOptions.cancelText,
    onCancel,
    submitText = Alert.defaultOptions.submitText,
    submitDestructive,
    onSubmit,
    textInputConfig
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
            textInputConfig,
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
      const config: any = {
        title,
        content: detailText,
        positiveText: submitText,
        negativeText: cancelText
      };
      if (textInputConfig) {
        const {
          defaultValue: prefill,
          placeholder: hint,
          ...rest
        } = textInputConfig;
        config.input = {
          prefill,
          hint,
          ...rest
        };
      }
      RNNativeDialogs.showPrompt(config, (type: string, text?: string) => {
        if (type === "input") {
          onSubmit && onSubmit(text || "");
        } else {
          onCancel && onCancel();
        }
      });
    }
  }
}

export default Alert;
