import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  AsyncStorage
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import uuid from "uuid";

//alert(firebase.auth().currentUser);

import Todo from "./Todo";

const TINT_COLOR = "rgb(4, 159, 239)";

StatusBar.setBarStyle("light-content");

const todolist = [
  { text: "Buy the milk", done: false },
  { text: "Submit the app", done: false },
  { text: "Write an article", done: true },
  { text: "Walk the dog", done: false },
  { text: "Go shopping on Amazon", done: false },
  { text: "Wash the dish", done: false },
  { text: "Call Steve", done: false },
  { text: "Call Ray", done: false },
  { text: "Buy a present to Antonio", done: false }
];

export default class TodoList extends React.Component {
  /*static navigationOptions = {
    title: "Checklist",
    headerStyle: {
      backgroundColor: TINT_COLOR
    },
    headerTintColor: 'white'
  } */

  state = {
    todolist: []
  };
  renderRow = ({ item }) => (
    <Todo
      data={item}
      onToggle={() => this._toggle(item)}
      onInfoPress={() => this._edit(item)}
      onDelete={() => this._delete(item)}
    />
  );

  _keyExtractor = (item, index) => {
    // aggiungere un id ad ogni elemento pari alla sua posizione
    //item.id = index;
    return String(index);
  };

  componentDidMount() {
    // carichiamo la todolist da AsyncStorage
    this.props.navigation.setParams({ add: this._add });
    // AsyncStorage.getItem("todolist").then(response =>
    //   this.setState({ todolist: JSON.parse(response) || todolist })
    // );
    const uid = firebase.auth().currentUser.uid;
    //const uid = "Fq1m5IHnZePsbbu19qzAaqAvmFm2";
    console.log(uid);
    this.uid = uid;
    if (uid) {
      firebase
        .database()
        .ref("/users/" + uid + "/todolist")
        .on("value", snap => {
          // console.log(Object.values(snap.val()));

          //   const remoteTodolist = snap ? Object.values(snap.val()) : [];

          //   this.setState({
          //     todolist: remoteTodolist.map(todo => {
          //       return { ...todo, text: todo.title };
          //     })
          //   });
          // });
          let todolist = [];
          snap.forEach(child => {
            todolist.push({
              id: child.key,
              ...child.val()
            });
          });
          this.setState({ todolist });
        });
    }
  }

  _update = todolist => {
    this.setState({ todolist });
    AsyncStorage.setItem("todolist", JSON.stringify(todolist));
    //
  };

  _delete = item => {
    setTimeout(() => {
      firebase
        .database()
        .ref("users/" + this.uid + "/todolist/" + item.id)
        .remove();
    }, 300);
  };

  _edit = item => {
    this.props.navigation.navigate("AddTodo", {
      currentTodo: item,
      onSaveEdit: this._saveEdit
    });
  };

  _saveEdit = updatedTodo => {
    //console.log(updatedTodo);
    //alert("salvataggio di ", item.text);
    // aggiornare la todolist
    // costruiamo una nuova todolist a partire dalla vecchia, sostituendo  l'item appena modificato
    const newTodolist = this.state.todolist.map(
      todo => (todo.id === updatedTodo.id ? updatedTodo : todo)
    );
    // aggiornare lo stato con la nuova todolist
    //this.setState({ todolist: newTodolist });
    const todoId = updatedTodo.id;
    delete updatedTodo.id;

    // .set(updatedTodo);
    firebase
      .database()
      .ref("users/" + this.uid + "/todolist/" + todoId)
      .set(updatedTodo);
    //this._update(newTodolist);
  };

  _toggle = item => {
    /* let newTodolist = [];
    for (let i = 0; i < this.state.todolist.length; i++) {
      let currentTodo = this.state.todolist[i];
      if ( currentTodo == item) {
        currentTodo.done = !currentTodo.done;
      }
      newTodolist.push(currentTodo)
    } */

    let newTodolist = this.state.todolist.map(
      currentTodo =>
        currentTodo == item
          ? { ...currentTodo, done: !currentTodo.done }
          : currentTodo
    );
    //console.log("users/" + this.uid + "/todolist/" + item.id);
    firebase
      .database()
      .ref("users/" + this.uid + "/todolist/" + item.id)
      .update({
        done: !item.done
      });

    //this.setState({ todolist: newTodolist});
    //this._update(newTodolist);
  };

  _add = async todo => {
    //this.setState({ todolist: [...this.state.todolist, todo] }, this._update );
    let newTodolist = [...this.state.todolist, todo];
    //this._update(newTodolist);
    // todo.title = todo.text;
    // if (todo.image) {
    //   const response = await fetch(todo.image);
    //   const blob = await response.blob();
    //   const ref = firebase
    //     .storage()
    //     .ref()
    //     .child(this.uid + "/" + uuid.v4());
    //   console.log(ref);
    //   const uploadStatus = await ref.put(blob);
    //   // console.log(uploadStatus);
    //   var downloadURL = await uploadStatus.ref.getDownloadURL();
    //   console.log(downloadURL);
    //   todo.imageURL = downloadURL;
    //   delete todo.image;
    // }

    firebase
      .database()
      .ref("users/" + this.uid + "/todolist/")
      .push(todo);
    // salvataggio della todolist sul AsyncStorage
  };
  //console.log("ci siamo");
  //const newTodolist = this.state.todolist.concat([todo]);
  //console.log(newTodolist);

  render() {
    //console.log("render", this.state.todolist);
    //alert(firebase.auth().currentUser.uid);
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.todolist}
          renderItem={this.renderRow}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}

TodoList.navigationOptions = ({ navigation }) => {
  return {
    title: "Checklist",
    headerStyle: {
      backgroundColor: TINT_COLOR
    },
    headerTintColor: "white",
    headerLeft: null,
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddTodo", {
            onAdd: navigation.state.params.add
          })
        }
      >
        <Ionicons
          style={{ paddingHorizontal: 15 }}
          name="ios-add-outline"
          size={34}
          color="white"
        />
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "white"
  }
});
