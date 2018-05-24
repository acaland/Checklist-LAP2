import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
//import PropTypes from 'prop-types';

import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Swipeout from "react-native-swipeout";

const TINT_COLOR = "rgb(4, 159, 239)";

/*
Todo.propTypes = {
  onToggle: PropTypes.function.isRequired
}
*/

export default class Todo extends Component {
  //state = {
  //  done: this.props.data.done
  //};
  render() {
    //console.log("renderizzo nuovamente", this.state.done);
    return (
      <Swipeout
        autoClose
        onClose={this.props.onDelete}
        right={[{ type: "delete", text: "Delete" }]}
      >
        <TouchableHighlight
          onPress={this.props.onToggle}
          underlayColor={TINT_COLOR}
        >
          <View style={styles.row}>
            {this.props.data.done ? (
              <MaterialIcons name="check-box" size={24} color={TINT_COLOR} />
            ) : (
              <MaterialIcons name="check-box-outline-blank" size={24} />
            )}

            <Text style={styles.text}>{this.props.data.text}</Text>
            <TouchableOpacity onPress={this.props.onInfoPress}>
              <Ionicons
                name="ios-information-circle-outline"
                size={28}
                color={TINT_COLOR}
              />
            </TouchableOpacity>
            <TouchableHighlight>
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginLeft: 10,
    //borderWidth: 1,
    //marginHorizontal: 10,
    padding: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  text: { flex: 1, fontSize: 18, marginLeft: 10 }
});
