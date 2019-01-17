/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import ND from 'react-native-native-dialogs';
const {List, Alert} = ND

interface Props {}
export default class App extends Component<Props> {
  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={[{
            title: 'ActionSheet',
            onPress: () => {
              List.showActionSheet({
                options: ['Microsoft', 'Apple', 'Google'],
                onSelect: ({label, index})=>{
                  console.log(label, index);
                },
              })
            }
          }, {
            title: 'Prompt',
            onPress: () =>{
              Alert.prompt({
                title: 'Input something',
                onSubmit: text=>{
                  console.log('input: ', text);
                }
              })
            }
          }]}
          keyExtractor={(_, index)=>index.toString()}
          renderItem={({item})=>{
            return <TouchableOpacity onPress={item.onPress} style={{padding: 16}}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          }}
        />
      </SafeAreaView>
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
