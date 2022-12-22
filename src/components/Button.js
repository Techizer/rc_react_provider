import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import { Colors, localimag, Font, mobileH, config, mobileW, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';

const windowWidth = Dimensions.get('window').width

const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isDisabled,
  isBlank,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[((isBlank != undefined && isBlank === true) ? styles.mainContainer1 : styles.mainContainer), customStyles.mainContainer, {
        opacity: (isDisabled) ? 0.3 : 1.0
      }]}>
      {
        onLoading ?
          <ActivityIndicator size={'small'} color={'white'} />
          :
          <Text style={[((isBlank != undefined && isBlank === true) ? styles.buttonText1 : styles.buttonText), customStyles.buttonText]}>
            {text}
          </Text>
      }

    </TouchableOpacity>
  );
};
Button.defaultProps = { customStyles: {} };

// const styles = StyleSheet.create({
//   mainContainer: {
//     width: '90%',
//     alignSelf: 'center',
//     borderRadius: (mobileW * 2) / 100,
//     backgroundColor: Colors.buttoncolorblue,
//     paddingVertical: (mobileW * 4) / 100,
//     marginTop: (mobileW * 8) / 100,
//   },
//   mainContainer1: {
//     width: '90%',
//     alignSelf: 'center',
//     borderColor: Colors.bordercolorblue,
//     borderWidth: 2,
//     borderRadius: (mobileW * 2) / 100,
//     backgroundColor: Colors.buttoncolorlight,
//     paddingVertical: (mobileW * 3) / 100,
//     marginTop: (mobileW * 4) / 100,
//     marginBottom: (mobileW * 4) / 100,
//   },
//   buttonText: {
//     color: Colors.textwhite,
//     fontFamily: Font.fontmedium,
//     fontSize: Font.buttontextsize,
//     textAlign: config.textalign,
//     alignSelf: 'center',
//   },
//   buttonText1: {
//     color: Colors.textblue,
//     fontFamily: Font.fontmedium,
//     fontSize: Font.buttontextsize,
//     textAlign: config.textalign,
//     alignSelf: 'center',
//   },
//   img: {
//     // width: 25,
//     // height: 25,
//     marginRight: 10,
//   },
// });

const styles = StyleSheet.create({
  mainContainer: {
    width: '94%',
    height: 40,
    alignSelf: 'center',
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorblue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (windowWidth * 6) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.buttoncolorblue,
    borderWidth: 2,
    borderRadius: (windowWidth * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (windowWidth * 3) / 100,
    marginBottom: (windowWidth * 4) / 100,
  },
  buttonText: {
    color: 'white',
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontext_size,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.fontmedium,
    fontSize: Font.buttontext_size,
    textAlign: config.textalign,
    alignSelf: 'center',
  }
});

export default Button;
