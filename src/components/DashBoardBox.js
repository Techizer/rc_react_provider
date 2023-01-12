import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import { Colors, Font, config, mobileW } from '../Provider/utilslib/Utils';
const DashBoardBox = ({
  textInfo, textTitle,
  customStyles,
  onPress,
  rightIcon, rightText,
  infoIcon, imgStyle,
  onLoading,
  isMargin,
  isBorder,
  actionColor,
  actionTextColor,
  actionMessage
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={[styles.mainContainer, customStyles.mainContainer, {
            height: (infoIcon != '') ? (mobileW * 50) / 100 : (mobileW * 12) / 100,
            marginTop: (isMargin == false) ? 0 : 12,
          }]}
        >
          {
            (infoIcon != '') &&
            <View style={{
              height: '75%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
              <View style={{
                // backgroundColor: 'yellow',
                width: '45%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image
                  style={[styles.img, imgStyle]}
                  resizeMode="contain"
                  source={infoIcon}
                />
              </View>
              <View style={{
                //backgroundColor: 'blue',
                width: '55%',
                justifyContent: 'center',
                paddingLeft: (mobileW * 6) / 100,
              }}>
                <Text style={{
                  fontFamily: Font.Regular,
                  fontSize: (mobileW * 3.4) / 100,
                  color: '#8F98A7',
                  lineHeight: 12,
                  //backgroundColor:'pink',
                  paddingVertical: (mobileW * 3.5) / 100,
                }}>{textInfo}</Text>
              </View>
            </View>
          }
          <View style={{
            height: (infoIcon != '') ? '25%' : (mobileW * 12) / 100,
            borderTopWidth: (isBorder == false) ? 0 : 1,
            borderTopColor: Colors.LIGHT_CLIENT_BORDER,
            flexDirection: 'row',
            justifyContent: 'space-around',
            // backgroundColor: 'red',
          }}>

            <View style={{
              // backgroundColor: 'yellow',
              width: '50%',
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingLeft: (mobileW * 5) / 100,
            }}>
              <Text style={{
                fontFamily: Font.Medium,
                fontSize: (mobileW * 3.8) / 100,
                color: Colors.placeholder_text_color
              }}>{textTitle}</Text>
            </View>

            <View style={{
              // backgroundColor: 'yellow',
              width: '40%',
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingHorizontal: (mobileW * 3) / 100,
              height: '70%',
              alignSelf:'center',
            }}>
              <View style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              paddingHorizontal: (mobileW * 3) / 100,
              backgroundColor: actionColor, 
              borderRadius: 12,
              paddingVertical: 6
            }}>
              
              <Text style={{
                fontFamily: Font.Regular,
                fontSize: Font.small,
                color: actionTextColor,
              }}>{actionMessage}</Text>
            </View>
            </View>

            <View style={{
              // backgroundColor: 'blue',
              width: '10%',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: (mobileW * 5) / 100,
            }}>
              {
                (rightText) ?
                  <Text style={{
                    fontFamily: Font.Medium,
                    fontSize: 14,
                    color: Colors.textblue
                  }}>{rightText}</Text> :
                  <Image
                    style={[styles.imgR, imgStyle]}
                    resizeMode="contain"
                    source={rightIcon}
                  />
              }

            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
DashBoardBox.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 190,
    // alignSelf: 'center',
    // borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.white_color,
    // paddingVertical: (mobileW * 4) / 100,
    marginTop: 10, //(mobileW * 1) / 100,
    // shadowColor: '#171717',
    // shadowOffset: { width: -2, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,

  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.bordercolorblue,
    borderWidth: 2,
    borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (mobileW * 3) / 100,
    marginTop: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  buttonText: {
    color: Colors.textwhite,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  img: {
    // width: 130,
    // height: 106,
    width: (mobileW * 33) / 100,
    height: (mobileW * 33) / 100,
    // marginRight: 10,
  },
  imgR: {
    width: (mobileW * 4) / 100,
    height: (mobileW * 4) / 100,
    tintColor: '#17181A'
    // marginRight: 10,
  },
});

export default DashBoardBox;
