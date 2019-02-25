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
  TouchableOpacity,
  SectionList
} from "react-native";
import RNND, { NDKeyboardType } from "../dist";

interface IState {
  actionSheetResult?: string;
  actionSheetSelectedIndex: number;
  textInputResult: string;
  keyboardType?: NDKeyboardType;
}

export default class App extends Component<any, IState> {
  public state: IState = {
    textInputResult: "",
    actionSheetSelectedIndex: 0
  };

  public render() {
    return (
      <SafeAreaView>
        <SectionList
          sections={[
            {
              data: [
                {
                  title: "ActionSheet",
                  onPress: () => {
                    RNND.showActionSheet({
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
                      selectedIndex: this.state.actionSheetSelectedIndex,
                      onSelect: ({ label, index }) => {
                        this.setState({
                          actionSheetResult: `${label} at index ${index}`,
                          actionSheetSelectedIndex: index
                        });
                      },
                      onCancel: () => {
                        this.setState({ actionSheetResult: "cancel" });
                      }
                    });
                  }
                },
                {
                  title: "action sheet result: " + this.state.actionSheetResult
                }
              ]
            },
            {
              data: [
                {
                  title: "keyboardType: " + this.state.keyboardType,
                  onPress: () => {
                    let keyboardTypes: NDKeyboardType[] = [
                      "default",
                      "email-address",
                      "numeric",
                      "phone-pad",
                      "number-pad",
                      "decimal-pad",
                      "url"
                    ];
                    if (Platform.OS === "ios") {
                      keyboardTypes = keyboardTypes.concat([
                        "ascii-capable",
                        "numbers-and-punctuation",
                        "name-phone-pad",
                        "twitter",
                        "web-search"
                      ]);
                    } else if (Platform.OS === "android") {
                      keyboardTypes = keyboardTypes.concat([
                        "visible-password",
                        "numeric-password",
                        "password"
                      ]);
                    }
                    RNND.showActionSheet({
                      options: keyboardTypes,
                      onSelect: ({ label }) => {
                        this.setState({
                          keyboardType: label as NDKeyboardType
                        });
                      }
                    });
                  }
                },
                {
                  title: "textinput",
                  onPress: () => {
                    RNND.prompt({
                      title: "Prompt",
                      detailText: "dont add too many textInput",
                      textInputConfig: {
                        secureTextEntry: true,
                        placeholder: "login",
                        maxLength: 15,
                        minLength: 6,
                        keyboardType: this.state.keyboardType
                      },
                      onSubmit: text => {
                        this.setState({ textInputResult: text });
                      }
                    });
                  }
                },
                {
                  title: "textinput result: " + this.state.textInputResult
                }
              ]
            }
          ]}
          keyExtractor={(_, index) => index.toString()}
          SectionSeparatorComponent={() => (
            <View style={{ height: 10, backgroundColor: "lightgrey" }} />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: "grey"
              }}
            />
          )}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={item.onPress}
                style={{ padding: 16 }}
                disabled={!item.onPress}
              >
                <Text>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}
