import React from "react";
import {
  // TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity, Platform
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
import { Colors, Font, mobileH, config, mobileW, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
import { Icons } from "../icons/IReferences";

const DropDownboxSec = ({
  lableText,
  lblTxtInfo,
  icon,
  iconName,
  boxPressAction,
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
  isDisabled,
  dHeight,
  ...props
}) => {
  //console.log(props.onSubmitEditing)
  return (
    <>
      <View style={[styles.mainContainer, mainContainer, {
         marginTop: (dHeight) ? 0 : (mobileW * 2) / 100,
      }]}>
        <TouchableOpacity
          onPress={boxPressAction}
          disabled={isDisabled}
        >
          <View style={{
            width: '95%', alignSelf: 'center', justifyContent: 'center',
            justifyContent: 'center',
            textAlignVertical: 'center',
            height: (dHeight) ? dHeight : 48, //(mobileW * 12) / 100,
          }}>
            {
              (isDisabled) ? null :
                <Image
                  style={{
                    height: (mobileW * 4) / 100,
                    width: (mobileW * 4) / 100,
                    position: "absolute",
                    top: (dHeight) ? 4 : 15,
                    right: 5,
                  }}
                  source={Icons.downarrow} />
            }
            <Text style={styles.textBoxStyle}>{lableText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
// };
DropDownboxSec.defaultProps = { mainContainer: {} };

const styles = StyleSheet.create({
  textStyle: {
    backgroundColor: "gray",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: (mobileW * 2) / 100,
    backgroundColor: Colors.tab_background_color, //Colors.optboxcolor,
    borderColor: Colors.field_border_color, //Colors.veriontextcolor,
    borderWidth: mobileW * 0.3 / 100,
    borderRadius: (mobileW * 1) / 100
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
  textBoxStyle: {
    width: '100%',
    color: Colors.placeholder_text_color,
    fontSize: Font.placeholdersize,
    textAlign: config.textalign,
    justifyContent: 'center',
    // alignItems: 'center',
    textAlignVertical: 'center',
    // height: 48, //(mobileW * 12) / 100,
    fontFamily: Font.headingfontfamily,
    borderRadius: (mobileW * 1) / 100,
    // paddingTop: ((mobileW * 12) / 100) / 2.5,
    paddingLeft: 4,
    // backgroundColor: 'red'
  },
  errorLayout: {
    backgroundColor: "red",
    marginVertical: 6,
    borderRadius: 5,
    padding: 5,
  },
  errorTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
export default DropDownboxSec;
