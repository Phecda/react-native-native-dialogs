import { KeyboardTypeOptions, ImageSourcePropType } from 'react-native';
export declare type ActionSheetOptions = {
  title?: string;
  message?: string;
  cancelable?: boolean;
  cancelText?: string;
  options: string[];
  icons?: ImageSourcePropType[];
  tintIcons?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  selectedIndex?: number;
  destructiveIndex?: number;
};
export declare type PromptOptions = {
  title?: string;
  message?: string;
  cancelable?: boolean;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
  cancelText?: string;
  submitDestructive?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  allowEmptyInput?: boolean;
};
