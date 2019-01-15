# react-native-native-dialogs

## Getting started

`$ npm install react-native-native-dialogs --save`

### Mostly automatic installation

`$ react-native link react-native-native-dialogs`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-native-dialogs` and add `RNNativeDialogs.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNativeDialogs.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.phecda.RNNativeDialogsPackage;` to the imports at the top of the file
  - Add `new RNNativeDialogsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
    	include ':react-native-native-dialogs'
    	project(':react-native-native-dialogs').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-native-dialogs/android')
  ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-native-dialogs')
  ```

## References

1. [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)
2. [React Native Doc](https://facebook.github.io/react-native/docs/alertios)
3. [Material Design](https://material.io/design/)
4. [Material Dialogs](https://github.com/afollestad/material-dialogs/tree/03fed5b82196063a983a986128cc64ec98a321f7) by @afollestad, version 0.9.6.0
5. [react-native-dialogs](https://github.com/aakashns/react-native-dialogs) by @aakashns

## Usage (TODO)
```javascript
import RNNativeDialogs from 'react-native-native-dialogs';

// TODO: What to do with the module?
RNNativeDialogs;
```
