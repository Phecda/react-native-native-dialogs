import { ActionSheetOptions, PromptOptions } from './types';
export declare function showActionSheet(
  options: ActionSheetOptions
): Promise<number>;
export declare function showPrompt(
  promptOptions: PromptOptions
): Promise<string>;
