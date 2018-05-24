import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  DatePickerIOS,
  StyleSheet,
  TimePickerAndroid,
  DatePickerAndroid
} from "react-native"; // Version can be specified in package.json
// 1
import moment from "moment";
const TINT_COLOR = "rgb(4, 159, 239)";

export default class DueDate extends React.Component {
  // 2
  state = {
    isIOSPickerVisible: false
    //dueDate: this.props.dueDate
  };

  _showPicker = () => {
    if (Platform.OS == "ios") {
      this.setState({ isIOSPickerVisible: !this.state.isIOSPickerVisible });
    } else {
      this._showAndroidDatePicker();
    }
  };

  _showAndroidDatePicker = async () => {
    try {
      // 1
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.dueDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // 2
        const newValue = moment(this.props.dueDate)
          .year(year)
          .month(month)
          .date(day)
          .toDate();

        this.setState({
          dueDate: newValue
        });
        // 3
        this._showAndroidTimePicker();
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  _showAndroidTimePicker = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: moment(this.state.dueDate).hour(),
        minute: moment(this.state.dueDate).minute(),
        is24Hour: true // Will display ’2 PM’
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        const newValue = moment(this.props.dueDate)
          .hour(hour)
          .minute(minute)
          .toDate();

        this.setState({
          dueDate: newValue
        });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };

  // 3
  renderIOSPicker = () => (
    <DatePickerIOS
      date={new Date(this.props.dueDate)}
      //onDateChange={newValue => this.setState({ dueDate: newValue })}
      onDateChange={this.props.onDateChange}
    />
  );

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.6} onPress={this._showPicker}>
          <View style={styles.pickerRow}>
            <Text style={styles.label}>Due Date</Text>
            <Text /* 4 */
              style={[
                styles.label,
                this.state.isIOSPickerVisible ? { color: TINT_COLOR } : {}
              ]}
            >
              {moment(this.props.dueDate).format("lll") /* 5 */}
            </Text>
          </View>
        </TouchableOpacity>
        {Platform.OS === "ios" && this.state.isIOSPickerVisible /* 6 */
          ? this.renderIOSPicker()
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15
  },
  label: {
    fontSize: 18
  }
});
