/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from "react-native";
import ND from "../dist";
const { List, Alert } = ND;

interface Props {}
export default class App extends Component<Props> {
  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={[
            {
              title: "ActionSheet",

              onPress: () => {
                List.showActionSheet({
                  options: [
                    {
                      title: "Left Align",
                      titleTextAlignment: "left",
                      icon: require("./assets/ico_help.png")
                    },
                    {
                      title: "Center (default)",
                      titleTextAlignment: "center",
                      icon: require("./assets/ico_share.png")
                    },
                    {
                      title: "Right align",
                      titleTextAlignment: "right",
                      icon: require("./assets/ico_search.png")
                    }
                  ],
                  title: "ActionSheet Example",
                  message: "result shown in console",
                  selectedIndex: 1,
                  onSelect: ({ label, index }) => {
                    console.log(label, index);
                  },
                  onCancel: () => {
                    console.log("onCancel");
                  }
                });
              }
            },
            {
              title: "textinput",
              onPress: () => {
                Alert.prompt({
                  title: "Prompt",
                  detailText: "dont add too many textInput",
                  textInputConfig: {
                    placeholder: "login",
                    maxLength: 15,
                    minLength: 6,
                    keyboardType: "url"
                  },
                  onSubmit: texts => {
                    console.log(texts);
                  }
                });
              }
            }
          ]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={item.onPress} style={{ padding: 16 }}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
