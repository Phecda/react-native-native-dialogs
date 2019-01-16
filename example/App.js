/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import {List} from 'react-native-native-dialogs'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <FlatList
        data={[{
          title: 'ActionSheet',
          onPress: () => {
            List.showActionSheet({title: '选择', options: ['Google', 'Apple', 'Microsoft'], onSelect: ({label, index})=>{
              console.log(label, index);
            }})
          }
        }]}
        renderItem={({item})=>{
          return <TouchableOpacity onPress={item.onPress} style={{padding: 16}}>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
