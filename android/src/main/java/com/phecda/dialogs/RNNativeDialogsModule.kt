package com.phecda.dialogs

import android.text.InputType

import com.afollestad.materialdialogs.MaterialDialog
import com.afollestad.materialdialogs.WhichButton
import com.afollestad.materialdialogs.actions.getActionButton
import com.afollestad.materialdialogs.callbacks.onCancel
import com.afollestad.materialdialogs.input.input
import com.afollestad.materialdialogs.list.listItems
import com.afollestad.materialdialogs.list.listItemsSingleChoice
import com.facebook.react.bridge.*

class RNNativeDialogsModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNativeDialogs"
    }

    @ReactMethod
    fun showPrompt(map: ReadableMap, promise: Promise) {
        val materialDialog = MaterialDialog(currentActivity!!)

        applyOptions(materialDialog, map)

        val placeholder = getString(map, "placeholder")
        val defaultValue = getString(map, "defaultValue")

        var keyboardType = InputType.TYPE_CLASS_TEXT

        if (map.hasKey("keyboardType")) {
            when (map.getString("keyboardType")) {
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

        if (map.hasKey("secureTextEntry") && keyboardType != InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD && map.getBoolean("secureTextEntry")) {
            keyboardType = keyboardType or InputType.TYPE_NUMBER_VARIATION_PASSWORD or InputType.TYPE_TEXT_VARIATION_PASSWORD
        }

        val allowEmptyInput = !map.hasKey("allowEmptyInput") || map.getBoolean("allowEmptyInput")

        materialDialog.input(hint = placeholder, prefill = defaultValue, allowEmpty = allowEmptyInput, inputType = keyboardType) {_, text ->
            promise.resolve(text.toString())
        }

        materialDialog.onCancel {
            promise.reject("", "")
        }

        materialDialog.negativeButton {
            promise.reject("", "")
        }

        materialDialog.show()
    }

    @ReactMethod
    fun showActionSheet(map: ReadableMap, callback: Callback) {
        val materialDialog = MaterialDialog(currentActivity!!)

        applyOptions(materialDialog, map)

        if (map.hasKey("options")) {
            val options = map.getArray("options")?.toArrayList()?.toList() as List<CharSequence>?
            if (map.hasKey("selectedIndex")) {
                val selectedIndex = map.getInt("selectedIndex")
                materialDialog.listItemsSingleChoice(items = options, initialSelection = selectedIndex) {_, index, _ ->
                    callback.invoke(index)
                }
            } else {
                materialDialog.listItems(items = options) {_, index, _ ->
                    callback.invoke(index)
                }
            }
        }

        materialDialog.onCancel {
            callback.invoke()
        }

        materialDialog.show()
    }

    private fun getString(options: ReadableMap, key: String, defaultValue: String? = null): String? {
        var result: String? = null
        if (options.hasKey(key)) {
            result = options.getString(key);
        }
        return result ?: defaultValue
    }

    private fun applyOptions(materialDialog: MaterialDialog, options: ReadableMap) {
        val iterator = options.keySetIterator()

        while (iterator.hasNextKey()) {

            when (val key = iterator.nextKey()) {
                "title" -> materialDialog.title(text = options.getString(key))
                "message" -> materialDialog.message(text = options.getString(key))
                "cancelable" -> materialDialog.cancelable(options.getBoolean(key))
                "positiveText" -> materialDialog.positiveButton(text = options.getString(key))
                "positiveColor" -> materialDialog.getActionButton(WhichButton.POSITIVE).updateTextColor(options.getInt("positiveColor"))
                "negativeText" -> materialDialog.negativeButton(text = options.getString(key))
                "negativeColor" -> materialDialog.getActionButton(WhichButton.NEGATIVE).updateTextColor(options.getInt("negativeColor"))
            }
        }
    }
}