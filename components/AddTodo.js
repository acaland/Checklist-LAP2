import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  Button,
  TouchableOpacity
} from "react-native";

const TINT_COLOR = "rgb(4, 159, 239)";

import DueDate from "./DueDate";

export default class AddTodo extends React.Component {
  state = {
    text: "",
    shouldRemind: false,
    dueDate: new Date()
  };

  componentWillMount() {
    this.props.navigation.setParams({ onSave: this._save });
    let item = this.props.navigation.state.params.currentTodo;

    if (item) {
      this.setState({ ...item, dueDate: new Date(item.dueDate) });
    }
  }

  _save = () => {
    // verificare se dobbiamo aggiungere una nuova todo o aggiornare una esistente
    const onSaveEdit = this.props.navigation.state.params.onSaveEdit;
    if (onSaveEdit) {
      let item = this.props.navigation.state.params.currentTodo;
      //const updatedTodo = item;
      // updatedTodo.text = this.state.text;

      const updatedTodo = {
        ...item,
        ...this.state,
        dueDate: this.state.dueDate.toISOString()
      };
      onSaveEdit(updatedTodo);
      this.props.navigation.goBack();
      return;
    }

    const onAdd = this.props.navigation.state.params.onAdd;
    if (onAdd) {
      console.log(typeof this.state.dueDate, this.state.dueDate);
      const newTodo = {
        text: this.state.text,
        done: false,
        dueDate: this.state.dueDate.toISOString(),
        shouldRemind: this.state.shouldRemind
      };
      onAdd(newTodo);
      this.props.navigation.goBack();
    }

    //todolist.push(newTodo);
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.todowrapper, { padding: 15 }]}>
          <TextInput
            value={this.state.text}
            style={[styles.textInputStyleOnAndroid, styles.label]}
            placeholder="Name of the item"
            autoFocus
            underlineColorAndroid={TINT_COLOR}
            onChangeText={value => this.setState({ text: value })}
            onSubmitEditing={this._save}
          />
        </View>
        <View style={styles.todowrapper}>
          <View style={styles.remindRow}>
            <Text style={styles.label}>Remind me</Text>
            <Switch
              value={this.state.shouldRemind}
              onValueChange={value => this.setState({ shouldRemind: value })}
              onTintColor={TINT_COLOR}
            />
          </View>
          <DueDate
            dueDate={this.state.dueDate}
            onDateChange={value => this.setState({ dueDate: value })}
          />
        </View>
      </View>
    );
  }
}

AddTodo.navigationOptions = ({ navigation }) => ({
  title: "Add Todo",
  headerLeft: <Button title="Cancel" onPress={() => navigation.goBack()} />,
  headerRight: (
    <TouchableOpacity onPress={() => navigation.state.params.onSave()}>
      <Text style={styles.headerBtn}>
        {Platform.OS === "ios" ? "Save" : "SAVE"}
      </Text>
    </TouchableOpacity>
  )
});

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "#E9E9EF", flex: 1 },
  todowrapper: {
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  textInputStyleOnAndroid:
    Platform.OS === "android" ? { paddingBottom: 7, paddingLeft: 7 } : {},
  remindRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontSize: 18
  },
  headerBtn: {
    color: Platform.OS === "ios" ? TINT_COLOR : "white",
    padding: 10,
    fontSize: 18
  }
});
