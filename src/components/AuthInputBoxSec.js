import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from 'react-native-paper';
import { Colors, Font, Configurations } from '../Helpers/Utils';

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
              ref={inputRef}
              label={lableText}
              editable={editable}
              mode='outlined'
              blurOnSubmit={false}
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
  },
  inputFieldStyle: {
    width: '100%',
    height: 48,
    color: Colors.Black,
    fontSize: Font.xlarge,
    fontFamily: Font.Regular,
    textAlign: Configurations.textalign,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    backgroundColor: 'white',
    lineHeight: 48,
    textAlignVertical: 'top'
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
