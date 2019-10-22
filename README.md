# react-native-native-dialogs

A wrapper of native-coded dialogs for simple usage.

## Install

This module is not on npm, install from github instead.

## References

1. [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)
2. [React Native Doc](https://facebook.github.io/react-native/docs/alertios)
3. [Material Design](https://material.io/design/)
4. [Material Dialogs](https://github.com/afollestad/material-dialogs) by @afollestad
5. [react-native-dialogs](https://github.com/aakashns/react-native-dialogs) by @aakashns
6. [Hekla app](https://github.com/birkir/hekla)

## Setup

### Android

Modify `android/build.gradle` as following:

``` groovy
buildscript {
    ext.kotlin_version = '1.3.50'
    ...
    dependencies {
      ...
      classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

## Usage

```javascript
import RNND from "react-native-native-dialogs";

RNND.showActionSheet({
  options: ["left", "right", "middle"],
  onSelect: ({ label, index }) => {
    console.log(label, index);
  }
});

RNND.prompt({
  title: "Prompt",
  detailText: "some messages",
  textInputConfig: {
    secureTextEntry: true,
    placeholder: "user name",
    maxLength: 16,
    minLength: 6,
    keyboardType: "this.state.keyboardType"
  },
  onSubmit: text => {
    console.log(text)
  }
});
```

## Screenshots

### Android simple list (item selected):

![Simple List on Android](./examples/screenshots/Screenshot_1551237222.png)

### iOS Action sheet (item selected, title align, icon)

![iOS Action sheet](./examples/screenshots/ActionSheet.png)

### Android prompt (keyboard type: url, max length 15)

![Android prompt](./examples/screenshots/Screenshot_1551237254.png)

### iOS prompt (keyboard type URL)

![iOS prompt](./examples/screenshots/Prompt.png)
