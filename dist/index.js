import { NativeModules, Image, Platform, processColor } from "react-native";
const { NDAlertManager, NDActionSheetManager, RNNativeDialogs } = NativeModules;
export default class RNND {
    static setDefaultOptions(options) {
        RNND.defaultOptions = { ...RNND.defaultOptions, ...options };
    }
    static prompt(promptOptions) {
        const { title, detailText, cancelText = RNND.defaultOptions.cancelText, onCancel, submitText = RNND.defaultOptions.submitText, submitDestructive, onSubmit, textInputConfig = {} } = promptOptions;
        if (Platform.OS === "ios") {
            const callbacks = [];
            const newButtons = [];
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
                }
                else if (btn.style === "destructive") {
                    destructiveButtonKey = String(index);
                }
                if (btn.text || index < (buttons || []).length - 1) {
                    const btnDef = {};
                    btnDef[index] = btn.text || "";
                    newButtons.push(btnDef);
                }
            });
            NDAlertManager.alertWithArgs({
                title: title || "",
                message: detailText || undefined,
                buttons: newButtons,
                textInputConfig,
                cancelButtonKey,
                destructiveButtonKey
            }, (buttonKey, texts) => {
                const cb = callbacks[Number(buttonKey)];
                cb && cb(texts);
            });
        }
        else if (Platform.OS === "android") {
            const config = {
                title,
                content: detailText,
                positiveText: submitText,
                negativeText: cancelText
            };
            if (textInputConfig) {
                const { defaultValue: prefill, placeholder: hint, ...rest } = textInputConfig;
                config.input = {
                    prefill,
                    hint,
                    ...rest
                };
            }
            RNNativeDialogs.showPrompt(config, (type, text) => {
                if (type === "input") {
                    onSubmit && onSubmit(text || "");
                }
                else {
                    onCancel && onCancel();
                }
            });
        }
    }
    static showActionSheet(sheetOptions) {
        const { options: items, title, message, onSelect, onCancel, cancelable = true, cancelText, destructiveIndex, selectedIndex, tintColor } = sheetOptions;
        const options = items.map(item => typeof item === "string" ? { title: item } : item);
        if (Platform.OS === "ios") {
            let cancelIndex = -1;
            if (cancelable) {
                cancelIndex = options.length;
                options.push({ title: cancelText });
            }
            NDActionSheetManager.showActionSheetWithOptions({
                options: options.map(option => ({
                    ...option,
                    icon: option.icon
                        ? Image.resolveAssetSource(option.icon)
                        : undefined
                })),
                title,
                message,
                selectedIndex,
                tintColor: processColor(tintColor),
                destructiveButtonIndex: destructiveIndex,
                cancelButtonIndex: cancelIndex
            }, (index) => {
                if (index === cancelIndex) {
                    onCancel && onCancel();
                }
                else {
                    onSelect &&
                        onSelect({
                            label: options[index].title || "",
                            index
                        });
                }
            });
        }
        else if (Platform.OS === "android") {
            const config = {
                title,
                content: message,
                items: options.map(opt => opt.title),
                cancelable,
                selectedIndex,
                contentColor: processColor(tintColor)
            };
            if (selectedIndex === undefined) {
                config.itemsCallback = true;
            }
            RNNativeDialogs.showSimpleList(config, (type, ...rest) => {
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
RNND.defaultOptions = {
    submitText: "OK",
    cancelText: "Cancel"
};
