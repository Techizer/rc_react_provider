import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  HelperText,
  useTheme,
  MD2Colors,
  MD3Colors,
  List,
} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons";
// import { hp, wp } from "../utils/responsive";
// import { RF } from "../utils/responsive";
// import Fonts, { fonts, fontSizes } from "../utils/Fonts";
// import { Color } from "../utils";
// const { height, width } = Dimensions.get("window");
import { Colors, Font, config } from '../Helpers/Utils';

const AuthInputBoxSec = (props) => {
  const {
    lableText,
    lblTxtInfo,
    icon,
    iconName,
    editable,
    iconPressAction,
    name,
    disableImg,
    address,
    mainContainer,
    inputLayout,
    imgView,
    imgStyle,
    inputFieldStyle,
    refs,
    inputRef,
    showCode,
    iconColor,
    onChangeText,
    value,
    secureTextEntry

  } = props
  //console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer]}>
        <View
          style={[
            styles.inputLayout,
            {
              width: disableImg ? "100%" : "100%",
            },
            inputLayout,
          ]}
        >
          <View style={{
            width: '100%', //alignSelf: 'center', 
            // backgroundColor: 'red'
          }}>
            <TextInput
              style={[styles.inputFieldStyle, inputFieldStyle, {
                backgroundColor: (editable == false) ? Colors.tab_background_color : 'white',
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                textAlignVertical: 'top'
              }]}
              onChangeText={onChangeText}
              ref={(r) => {
                inputRef && inputRef(r);
              }}
              label={lableText}
              editable={editable}
              mode='outlined'
              outlineColor={Colors.field_border_color}
              activeOutlineColor={Colors.placholderactive}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              {...props}
              value={value}
              allowFontScaling={false}
              right={
                (disableImg) &&
                <TextInput.Icon
                  name={iconName}
                  onPress={iconPressAction}
                  forceTextInputFocus={false}
                  color={Colors.regulartextcolor}
                  style={{
                    marginTop: 12,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}

                />

              }
            />
          </View>

        </View>
      </View>
    </>
  );
};

AuthInputBoxSec.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: "90%",
    justifyContent: 'flex-start',
    height: 'auto'
    //paddingLeft: 10,
    //paddingRight: 10,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "lightgrey",
    //paddingVertical: 5,
    // marginBottom: 10,
  },
  imgView: {
    width: "15%",
    alignItems: "center",
  },
  img: {
    height: 30,
    width: 30,
  },
  inputLayout: {
    width: "100%",
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  inputFieldStyle: {
    width: '100%',
    height: 48,
    color: Colors.Black,
    fontSize: Font.medium,
    textAlign: config.textalign,
    //height: (mobileW * 12) / 100,
    fontFamily: Font.Regular,
    // borderRadius: (mobileW * 1) / 100,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    backgroundColor: 'white',
    lineHeight: 48,
    textAlignVertical: 'top'
    // borderColor: 'red', //Colors.placeholder_border
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 8,
    padding: 5,
  },
  errorTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default AuthInputBoxSec;
