import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { Colors, Font, Configurations, mobileW } from '../Helpers/Utils';
import { Icons } from "../Icons/IReferences";

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
      }]}>
        <TouchableOpacity
          onPress={boxPressAction}
          disabled={isDisabled}
          activeOpacity={0.7}
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
                  source={Icons.DownArrow} />
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
    width: '100%',
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
  },
  textBoxStyle: {
    width: '100%',
    color: Colors.DarkGrey,
    fontSize: Font.xlarge,
    textAlign: Configurations.textalign,
    justifyContent: 'center',
    textAlignVertical: 'center',
    fontFamily: Font.Regular,
    borderRadius: (mobileW * 1) / 100,
    paddingLeft: 4,
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
