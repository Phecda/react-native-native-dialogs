package com.phecda;

import android.content.DialogInterface;
import android.media.Image;
import android.telecom.Call;
import android.text.InputType;
import android.view.View;
import android.widget.ImageView;

import com.afollestad.materialdialogs.MaterialDialog;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.UiThreadUtil;

public class RNNativeDialogsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNNativeDialogsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNNativeDialogs";
    }

    MaterialDialog.Builder mBuilder;
    MaterialDialog mDialog;
    private boolean mCallbackWasInvoked = false;

    @ReactMethod
    public void showPrompt(ReadableMap config, final Callback callback) {
        mBuilder = initializedBuilder();

        applyOptions(mBuilder, config);

        if (config.hasKey("input")) {
            ReadableMap input = config.getMap("input");

            String hint = input.hasKey("hint") ? input.getString("hint") : null;
            String prefill = input.hasKey("prefill") ? input.getString("prefill") : null;

            boolean allowEmptyInput = !input.hasKey("allowEmptyInput") || input.getBoolean("allowEmptyInput");

            int keyboardType = InputType.TYPE_CLASS_TEXT;

            if (input.hasKey("keyboardType")) {
                switch (input.getString("keyboardType")) {
                    case "phone-pad":
                        keyboardType = InputType.TYPE_CLASS_PHONE;
                        break;

                    case "number-pad":
                        keyboardType = InputType.TYPE_CLASS_NUMBER;
                        break;

                    case "decimal-pad":
                        keyboardType = InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL;
                        break;

                    case "numeric":
                        keyboardType = InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED;
                        break;

                    case "numeric-password":
                        keyboardType = InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD;
                        break;

                    case "email-address":
                        keyboardType = InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                        break;

                    case "password":
                        keyboardType = InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD;
                        break;

                    case "url":
                        keyboardType = InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS | InputType.TYPE_TEXT_VARIATION_URI;
                        break;

                    case "visible-password":
                        keyboardType = InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD;
                        break;

                    default:
                        keyboardType = InputType.TYPE_CLASS_TEXT;
                }
            }

            if (input.hasKey("secureTextEntry") && keyboardType != InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD && input.getBoolean("secureTextEntry")) {
                keyboardType = keyboardType | InputType.TYPE_NUMBER_VARIATION_PASSWORD | InputType.TYPE_TEXT_VARIATION_PASSWORD;
            }

            mBuilder.inputType(keyboardType);

            int minLength = input.hasKey("minLength") ? input.getInt("minLength") : 0;
            int maxLength = input.hasKey("maxLength") ? input.getInt("maxLength") : -1;

            mBuilder.inputRange(minLength, maxLength);

            mBuilder.input(hint, prefill, allowEmptyInput, new MaterialDialog.InputCallback() {
                @Override
                public void onInput(MaterialDialog materialDialog, CharSequence charSequence) {
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true;
                        callback.invoke("input", charSequence.toString(), materialDialog.isPromptCheckBoxChecked());
                    }
                }
            });

            show();

        }
    }

    @ReactMethod
    public void showSimpleList(ReadableMap config, final Callback callback) {
        mBuilder = initializedBuilder();

        applyOptions(mBuilder, config);


        if (config.hasKey("itemsCallback")) {
            mBuilder.itemsCallback(new MaterialDialog.ListCallback() {
                @Override
                public void onSelection(MaterialDialog dialog, View itemView, int position, CharSequence text) {
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true;
                        callback.invoke("itemsCallback", position);
                    }
                }
            });
        }

        if (config.hasKey("selectedIndex")) {
            int selectedIndex = config.hasKey("selectedIndex") ? config.getInt("selectedIndex") : -1;
            mBuilder.itemsCallbackSingleChoice(selectedIndex, new MaterialDialog.ListCallbackSingleChoice() {
                @Override
                public boolean onSelection(MaterialDialog dialog, View itemView, int which, CharSequence text) {
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true;
                        text = text == null ? "" : text;
                        callback.invoke("itemsCallbackSingleChoice", which);
                    }
                    return true;
                }
            });
        }

        mBuilder.dismissListener(new DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                if (!mCallbackWasInvoked) {
                    mCallbackWasInvoked = true;
                    callback.invoke("onDismiss");
                }
            }
        });

        show();
    }

    private MaterialDialog.Builder initializedBuilder() {
        return new MaterialDialog.Builder(getCurrentActivity()).showListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface dialog) {
                mCallbackWasInvoked = false;
            }
        });
    }

    private void applyOptions(MaterialDialog.Builder builder, ReadableMap options) {
        ReadableMapKeySetIterator iterator = options.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();

            switch (key) {
                case "title":
                    builder.title(options.getString(key));
                    break;
                case "content":
                    builder.content(options.getString(key));
                    break;
                case "contentColor":
                    builder.contentColor(options.getInt(key));
                    break;
                case "cancelable":
                    builder.cancelable(options.getBoolean(key));
                    break;
                case "positiveText":
                    builder.positiveText(options.getString(key));
                    break;
                case "positiveColor":
                    builder.positiveColor(options.getInt(key));
                    break;
                case "negativeText":
                    builder.negativeText(options.getString(key));
                    break;
                case "negativeColor":
                    builder.negativeColor(options.getInt(key));
                    break;
                case "neutralText":
                    builder.neutralText(options.getString(key));
                    break;
                case "neutralColor":
                    builder.neutralColor(options.getInt(key));
                    break;
                case "autoDismiss":
                    builder.autoDismiss(options.getBoolean(key));
                    break;
                case "items":
                    ReadableArray arr = options.getArray(key);
                    String[] items = new String[arr.size()];
                    for (int i = 0; i < arr.size(); i++) {
                        items[i] = arr.getString(i);
                    }
                    builder.items(items);
                    break;
            }
        }
    }

    private void show() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mDialog != null) {
                    mDialog.dismiss();
                }
                mDialog = mBuilder.build();
                mDialog.show();
            }
        });
    }
}