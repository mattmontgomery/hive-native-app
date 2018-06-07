import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import HiveReducer from "./reducers/HiveReducer";
import StoryList from "./components/StoryList";

import { HIVE_API_TOKEN, HIVE_BASE_URL } from "react-native-dotenv";
const client = axios.create({
  baseURL: HIVE_BASE_URL,
  responseType: "json",
  headers: {
    Authentication: `token ${HIVE_API_TOKEN}`
  }
});

const store = createStore(
  combineReducers({ HiveReducer }),
  applyMiddleware(axiosMiddleware(client))
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StoryList />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingBottom: 16
  }
});
