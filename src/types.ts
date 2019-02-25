import { KeyboardTypeOptions, ImageSourcePropType } from "react-native";

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

export interface IActionSheetOptions {
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
