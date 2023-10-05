import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, View } from "react-native";

import { Colors, Font, Configurations, windowWidth } from '../Helpers/Utils';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { vs } from "react-native-size-matters";


const StickyButton = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isDisabled,
  isBlank,
  btnStyle

}) => {

  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        width: "100%",
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.white_color,
        paddingTop: (windowWidth * 2) / 100,
        paddingBottom: Platform.OS == 'ios' ? insets.bottom - vs(5) : (windowWidth * 2) / 100,
        alignItems: "center",
        zIndex: 99999,
      }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        disabled={isDisabled}
        style={[((isBlank != undefined && isBlank === true) ? styles.mainContainer1 : styles.mainContainer), {
          opacity: (isDisabled) ? 0.3 : 1.0,
          // marginTop: text === 'FOLLOW UP CONSULTATION' ? 0 : (windowWidth * 6) / 100,
          // marginBottom: text === 'FOLLOW UP CONSULTATION' ? 0 : (windowWidth * 4) / 100,
          backgroundColor: text === 'FOLLOW UP CONSULTATION' ? Colors.Yellow : Colors.buttoncolorblue
        }]}>
        {
          onLoading ?
            <ActivityIndicator size={'small'} color={'white'} />
            :
            <Text style={[((isBlank != undefined && isBlank === true) ? styles.buttonText1 : styles.buttonText)]}>
              {text}
            </Text>
        }

      </TouchableOpacity>
    </View>
  );
};
StickyButton.defaultProps = { customStyles: {} };


const styles = StyleSheet.create({
  mainContainer: {
    width: '94%',
    height: 40,
    alignSelf: 'center',
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorblue,
    justifyContent: 'center',
    alignItems: 'center',

  },
  mainContainer1: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    borderColor: Colors.buttoncolorblue,
    borderWidth: 2,
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (windowWidth * 0.25) / 100,
    marginTop: (windowWidth * 1) / 100,
    marginBottom: (windowWidth * 3) / 100,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontFamily: Font.Regular,
    fontSize: Font.medium,
    textAlign: Configurations.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.Regular,
    fontSize: Font.medium,
    textAlign: Configurations.textalign,
    alignSelf: 'center',
  }
});

export default StickyButton;
