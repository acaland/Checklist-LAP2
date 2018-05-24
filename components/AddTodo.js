import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  ActionSheetIOS
} from "react-native";
import { MapView, ImagePicker, Permissions, Location } from "expo";

const TINT_COLOR = "rgb(4, 159, 239)";

import DueDate from "./DueDate";

export default class AddTodo extends React.Component {
  state = {
    text: "",
    shouldRemind: false,
    dueDate: new Date(),
    address: "",
    location: {
      latitude: 37.509433,
      longitude: 15.083707
    },
    isMapVisible: false,
    image: null
  };

  componentWillMount() {
    this.props.navigation.setParams({ onSave: this._save });
    const { params } = this.props.navigation.state;
    let item = params ? params.currentTodo : null;

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

  _openPhotoGallery = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (result.status !== "granted") {
        alert("you need to authorized the app");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      console.log(result);
      this.setState({ image: result.uri });
    }
  };

  _selectPhoto = () => {
    console.log("show action sheet");
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Camera", "Photo Gallery", "Cancel"],
          cancelButtonIndex: 2,
          title: "Choose a picture from"
        },
        btnIndex => {
          if (btnIndex == 0) {
          } else if (btnIndex == 1) {
            this._openPhotoGallery();
          }
        }
      );
    } else {
      // You can use an Alert Dialog on Android to do the same
    }
  };

  _locateItem = async () => {
    if (this.state.isMapVisible) {
      this.setState({ isMapVisible: false });
      return;
    }
    if (this.state.address) {
      //console.log(this.state.location);
      // se l'utente ha inserito un indirizzo, determina le coordinate con il
      try {
        var results = await Location.geocodeAsync(this.state.address);
        this.setState({ location: results[0], isMapVisible: true });
      } catch (e) {
        console.log("error in geocoding");
        console.log(e);
      }

      //console.log("risultati: ", results);
      // cambia lo stato con la location e mostrando la mappa
    } else {
      // se l'utente non ha inserito un indirizzo, allora chiedi al GPS la posizione corrente
      // dell'utente e poi usa il reverse geocoder per ottenere l'indirizzo a partire dalla
      // posizione ottenuta
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        alert("You need to enable the GPS and authorize it");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      console.log(location);
      this.setState({ location: location.coords, isMapVisible: true });
      let address = await Location.reverseGeocodeAsync(location.coords);
      this.setState({
        address: address[0].city + ", " + address[0].name
      });
      console.log(address);
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={this._selectPhoto}>
            <Image
              resizeMode="cover"
              style={{ width: null, height: 220 }}
              source={
                this.state.image
                  ? { uri: this.state.image }
                  : require("../assets/image-placeholder.png")
              }
            />
          </TouchableOpacity>

          <View style={[styles.todowrapper, { padding: 15, marginTop: 0 }]}>
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

          <View style={[styles.todowrapper, { padding: 0, marginTop: 1 }]}>
            <View style={styles.remindRow}>
              <TextInput
                value={this.state.address}
                style={[styles.textInputStyleOnAndroid, styles.label]}
                placeholder="Where"
                underlineColorAndroid={TINT_COLOR}
                onChangeText={value => this.setState({ address: value })}
                onSubmitEditing={this._save}
              />
              <TouchableOpacity onPress={this._locateItem}>
                <Image
                  source={require("../assets/locateme.png")}
                  style={{ height: 35, width: 40 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <MapView
            style={{ height: this.state.isMapVisible ? 200 : 0, marginTop: 0 }}
            region={{
              ...this.state.location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          >
            <MapView.Marker
              title={this.state.text}
              description={this.state.address}
              coordinate={this.state.location}
            />
          </MapView>

          <View style={[styles.todowrapper, { marginTop: 0 }]}>
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
      </ScrollView>
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
