import React, { useEffect } from "react";
import { StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";

import { Colors, Font, Configurations } from '../Helpers/Utils';

const windowWidth = Dimensions.get('window').width

const Button = ({
  text,
  customStyles,
  onPress,
  image,
  onLoading,
  isDisabled,
  isBlank,
  btnStyle

}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={isDisabled}
      style={[((isBlank != undefined && isBlank === true) ? styles.mainContainer1 : styles.mainContainer), {
        opacity: (isDisabled) ? 0.3 : 1.0,
        marginTop: text === 'FOLLOW UP CONSULTATION' ? 0 : (windowWidth * 6) / 100,
        marginBottom: text === 'FOLLOW UP CONSULTATION' ? 0 : (windowWidth * 4) / 100,
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
//     fontFamily: Font.Medium,
//     fontSize: Font.buttontextsize,
//     textAlign: Configurations.textalign,
//     alignSelf: 'center',
//   },
//   buttonText1: {
//     color: Colors.textblue,
//     fontFamily: Font.Medium,
//     fontSize: Font.buttontextsize,
//     textAlign: Configurations.textalign,
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
    fontFamily: Font.Medium,
    fontSize: Font.buttontext_size,
    textAlign: Configurations.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.Medium,
    fontSize: Font.buttontext_size,
    textAlign: Configurations.textalign,
    alignSelf: 'center',
  }
});

export default Button;
