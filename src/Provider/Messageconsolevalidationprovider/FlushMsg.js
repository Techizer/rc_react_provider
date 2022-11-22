import React, { Component } from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native';

import { showMessage, hideMessage } from "react-native-flash-message";

class FlushMsg extends Component {

  static showError = (message) => {
    showMessage({
      message: message,
      description: "",
      type: "danger",
      //color: '#000000',
      backgroundColor: 'red',
      duration: 4000
    });
  }

  static showSuccess = (message, duration = 4000) => {
    showMessage({
      message: message,
      description: "",
      type: "success",
      //color: '#000000',
      backgroundColor: '#006400', //'#228B22',
      duration: duration
    });
  }

}
//const FlushMsg = new FlushMsg();
export default FlushMsg;