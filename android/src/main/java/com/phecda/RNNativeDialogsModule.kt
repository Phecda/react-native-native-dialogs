package com.phecda

import android.content.DialogInterface
import android.graphics.Color
import android.text.InputType
import android.view.View

import com.afollestad.materialdialogs.MaterialDialog
import com.afollestad.materialdialogs.WhichButton
import com.afollestad.materialdialogs.actions.getActionButton
import com.afollestad.materialdialogs.callbacks.onCancel
import com.afollestad.materialdialogs.callbacks.onDismiss
import com.afollestad.materialdialogs.input.input
import com.afollestad.materialdialogs.list.listItems
import com.afollestad.materialdialogs.list.listItemsSingleChoice
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil

class RNNativeDialogsModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var mCallbackWasInvoked = false

    override fun getName(): String {
        return "RNNativeDialogs"
    }

    @ReactMethod
    fun showPrompt(config: ReadableMap, callback: Callback) {
        val materialDialog = MaterialDialog(currentActivity!!)

        applyOptions(materialDialog, config)

        if (config.hasKey("input")) {
            val input = config.getMap("input")

            val hint = if (input!!.hasKey("hint")) input.getString("hint") else null
            val prefill = if (input.hasKey("prefill")) input.getString("prefill") else null

            val allowEmptyInput = !input.hasKey("allowEmptyInput") || input.getBoolean("allowEmptyInput")

            var keyboardType = InputType.TYPE_CLASS_TEXT

            if (input.hasKey("keyboardType")) {
                when (input.getString("keyboardType")) {
                    "phone-pad" -> keyboardType = InputType.TYPE_CLASS_PHONE

                    "number-pad" -> keyboardType = InputType.TYPE_CLASS_NUMBER

                    "decimal-pad" -> keyboardType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL

                    "numeric" -> keyboardType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL or InputType.TYPE_NUMBER_FLAG_SIGNED

                    "numeric-password" -> keyboardType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD

                    "email-address" -> keyboardType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS

                    "password" -> keyboardType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD

                    "url" -> keyboardType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS or InputType.TYPE_TEXT_VARIATION_URI

                    "visible-password" -> keyboardType = InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD

                    else -> keyboardType = InputType.TYPE_CLASS_TEXT
                }
            }

            if (input.hasKey("secureTextEntry") && keyboardType != InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD && input.getBoolean("secureTextEntry")) {
                keyboardType = keyboardType or InputType.TYPE_NUMBER_VARIATION_PASSWORD or InputType.TYPE_TEXT_VARIATION_PASSWORD
            }

            val maxLength = if (input.hasKey("maxLength")) input.getInt("maxLength") else -1


            materialDialog.input(
                    hint = hint,
                    prefill = prefill,
                    allowEmpty = allowEmptyInput,
                    inputType = keyboardType,
                    maxLength = maxLength
            ) {_, text ->
                callback.invoke("input", text.toString())
            }

            materialDialog.onCancel { callback.invoke("cancel") }

            materialDialog.show()

        }
    }

    @ReactMethod
    fun showSimpleList(config: ReadableMap, callback: Callback) {
        val materialDialog = MaterialDialog(currentActivity!!)

        applyOptions(materialDialog, config)

        if (config.hasKey("items")) {
            val arr = config.getArray("items")
            val items = arrayOfNulls<String>(arr!!.size())
            for (i in 0 until arr.size()) {
                items[i] = arr.getString(i)
            }
            val itemList = items.filterNotNull().toList()

            if (config.hasKey("itemsCallback")) {
                materialDialog.listItems(items = itemList) {dialog, index, text ->
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true
                        callback.invoke("itemsCallback", index)
                    }
                }
            } else if (config.hasKey("selectedIndex")) {
                val selectedIndex = if (config.hasKey("selectedIndex")) config.getInt("selectedIndex") else -1
                materialDialog.listItemsSingleChoice(items = itemList, initialSelection = selectedIndex) {dialog, index, text ->
                    if (!mCallbackWasInvoked) {
                        mCallbackWasInvoked = true
                        callback.invoke("itemsCallbackSingleChoice", index)
                    }
                }
            }

            materialDialog.onCancel {
                if (!mCallbackWasInvoked) {
                    mCallbackWasInvoked = true
                    callback.invoke("cancel")
                }
            }
        }

        materialDialog.show()
    }

    private fun applyOptions(materialDialog: MaterialDialog, options: ReadableMap) {
        val iterator = options.keySetIterator()

        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()

            when (key) {
                "title" -> materialDialog.title(text = options.getString(key))
                "content" -> materialDialog.message(text = options.getString(key))
                "cancelable" -> materialDialog.cancelable(options.getBoolean(key))
                "positiveText" -> materialDialog.positiveButton(text = options.getString(key))
                "positiveColor" -> materialDialog.getActionButton(WhichButton.POSITIVE).updateTextColor(options.getInt("positiveColor"))
                "negativeText" -> materialDialog.negativeButton(text = options.getString(key))
                "negativeColor" -> materialDialog.getActionButton(WhichButton.NEGATIVE).updateTextColor(options.getInt("negativeColor"))
            }
        }
    }
}