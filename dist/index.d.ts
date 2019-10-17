import { ImageRequireSource, ImageURISource } from "react-native";
export declare type NDKeyboardTypeCommon = "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad" | "url";
export declare type NDKeyboardTypeIOS = "ascii-capable" | "numbers-and-punctuation" | "name-phone-pad" | "twitter" | "web-search";
export declare type NDKeyboardTypeAndroid = "visible-password" | "numeric-password" | "password";
export declare type NDKeyboardType = NDKeyboardTypeCommon | NDKeyboardTypeIOS | NDKeyboardTypeAndroid;
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
        keyboardType?: NDKeyboardType;
        /**
         * @platform android
         */
        maxLength?: number;
        /**
         * @platform android
         */
        minLength?: number;
        /**
         * @platform android
         */
        allowEmptyInput?: boolean;
    };
}
export interface IActionSheetOptions {
    options: Array<{
        title?: string;
        /**
         * @platform iOS
         */
        titleTextAlignment?: "left" | "right" | "center";
        /**
         * **MUST** be a require source or a base64 uri source, cannot be an online image
         * @platform iOS
         */
        icon?: ImageRequireSource | ImageURISource;
    } | string>;
    title?: string;
    message?: string;
    onSelect?: (result: {
        label: string;
        index: number;
    }) => void;
    onCancel?: () => void;
    cancelText?: string;
    cancelable?: boolean;
    /**
     * @platform iOS
     */
    destructiveIndex?: number;
    selectedIndex?: number;
    tintColor?: string;
}
export default class RNND {
    static defaultOptions: Partial<IPromptOptions>;
    static setDefaultOptions(options: Partial<IPromptOptions>): void;
    static prompt(promptOptions: IPromptOptions): void;
    static showActionSheet(sheetOptions: IActionSheetOptions): void;
}
