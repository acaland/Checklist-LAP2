import { StackNavigator } from "react-navigation";

import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import Login from "./screens/Login";
import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyBbz6q4vltHA_K3KLHQDBQC2ITY_aKGaBQ",
  authDomain: "todolist-rn-unict-d73b4.firebaseapp.com",
  databaseURL: "https://todolist-rn-unict-d73b4.firebaseio.com",
  projectId: "todolist-rn-unict-d73b4",
  storageBucket: "todolist-rn-unict-d73b4.appspot.com",
  messagingSenderId: "465570866758"
};
!firebase.apps.length ? firebase.initializeApp(config) : null;

const App = StackNavigator(
  {
    TodoList: {
      screen: TodoList
    },
    AddTodo: {
      screen: AddTodo
    },
    Login: {
      screen: Login
    }
  },
  {
    initialRouteName: "AddTodo"
    // mode: "modal"
  }
);
export default App;
