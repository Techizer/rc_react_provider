import { TouchableHighlight, Keyboard, FlatList, Modal, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { _Cross, leftArrow, rightArrow } from '../Icons/SvgIcons/Index';

import SignupForm from '../Components/SignupForm';

export default Signup = ({ navigation, route }) => {


  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    

      <SignupForm
        navigation={navigation}
      />


  );
}

