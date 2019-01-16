package com.phecda;

import android.content.DialogInterface;
import android.support.annotation.NonNull;
import android.view.View;

import com.afollestad.materialdialogs.DialogAction;
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
    public void showPrompt(ReadableMap options, final Promise promise) {
        mBuilder = new MaterialDialog.Builder(getCurrentActivity());
    }

    @ReactMethod
    public void showPlainList(ReadableMap config, final Callback callback) {
        mBuilder = initializedBuilder();

        applyOptions(mBuilder, config);

        if (config.hasKey("onPositive")) {
            mBuilder.onPositive(new MaterialDialog.SingleButtonCallback() {
                @Override
                public void onClick(@NonNull MaterialDialog dialog, @NonNull DialogAction which) {
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true;
                        callback.invoke("onPositive");
                    }
                }
            });
        }


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