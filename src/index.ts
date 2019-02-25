import { NativeModules, Image, Platform } from "react-native";
import { IActionSheetOptions, IPromptOptions } from "./types";
const { NDAlertManager, NDActionSheetManager, RNNativeDialogs } = NativeModules;

export default class RNND {
  public static defaultOptions: Partial<IPromptOptions> = {
    submitText: "OK",
    cancelText: "Cancel"
  };

  public static setDefaultOptions(options: Partial<IPromptOptions>) {
    RNND.defaultOptions = { ...RNND.defaultOptions, ...options };
  }

  public static prompt(promptOptions: IPromptOptions) {
    const {
      title,
      detailText,
      cancelText = RNND.defaultOptions.cancelText,
      onCancel,
      submitText = RNND.defaultOptions.submitText,
      submitDestructive,
      onSubmit,
      textInputConfig
    } = promptOptions;

    if (Platform.OS === "ios") {
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

  public static showActionSheet(sheetOptions: IActionSheetOptions) {
    const {
      options,
      title,
      message,
      onSelect,
      onCancel,
      cancelable = true,
      cancelText,
      destructiveIndex,
      selectedIndex
    } = sheetOptions;

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
