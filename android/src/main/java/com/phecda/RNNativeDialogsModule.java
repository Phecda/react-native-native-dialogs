package com.phecda;

import com.afollestad.materialdialogs.MaterialDialog;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

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
    public void show(ReadableMap options, final Promise promise) {
        mBuilder = new MaterialDialog.Builder(getCurrentActivity());
    }
}