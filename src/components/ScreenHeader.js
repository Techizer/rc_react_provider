import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    Dimensions,
    StatusBar,
} from "react-native";
import {
    Colors,
    Font,
    config,
    mobileH,
    mobileW,
    localStorage,
    consolepro,
    Lang_chg,
    apifuntion,
} from "../Provider/utilslib/Utils";

import { Icons } from '../icons/IReferences'

import { leftArrow, rightArrow, Notification, dummyUser } from "../icons/SvgIcons/Index";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";


// console.log(headerHeight + '   ' + Platform.OS);
// console.log(deviceHeight + '   ' + Platform.OS);
// console.log(windowHeight + '   ' + Platform.OS);
// console.log('Status Bar Height', StatusbarHeight + '   ' + Platform.OS);

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)

let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

const ScreenHeader = ({
    onBackPress,
    title,
    navigation,
    rightIcon,
    leftIcon,
    addressOld,
    addressShow,
    notiCount,
    style = {}
}) => {
    const iconSize = notiCount > 0 ? s(20) : s(18)

    return (
        <View
            style={[{
                width: windowWidth,
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: Colors.bordercolor,
                height: headerHeight + StatusbarHeight,
                paddingTop: (Platform.OS === 'ios') ? StatusbarHeight : 0
            }, style]}
        >
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    height: '100%',
                    alignSelf: "center",
                    alignItems: "center",
                }}
            >
                {
                    leftIcon ?
                        <TouchableHighlight
                            underlayColor={Colors.Highlight}
                            activeOpacity={0.7}
                            onPress={onBackPress}
                            style={{
                                width: "14%",
                                height: '100%',
                                alignSelf: "center",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <SvgXml xml={
                                config.textalign == "right"
                                    ? rightArrow : leftArrow
                            } height={vs(17.11)} width={s(9.72)} fill={'red'} fillOpacity={1} />

                        </TouchableHighlight>
                        :
                        <View style={{ width: '14%' }}></View>
                }

                <View
                    style={{
                        width: "72%",
                        height: '80%',
                        justifyContent: 'center'
                    }}>
                    <Text
                        style={{
                            textAlign: "center",
                            fontFamily: Font.Medium,
                            fontSize: (windowWidth * 4) / 100,
                            color: Colors.darkText
                        }}>{title}</Text>
                </View>
                {
                    rightIcon ?
                        <TouchableHighlight
                            underlayColor={Colors.Highlight}
                            onPress={() => {
                                navigation.navigate("Notifications");
                            }}
                            style={{
                                width: "14%",
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}>
                            <Image source={notiCount > 0 ? Icons.NotificationBadge : Icons.Notification} style={{
                                width: iconSize,
                                height: iconSize
                            }} resizeMethod='resize' resizeMode="contain" />
                        </TouchableHighlight>
                        :
                        <View style={{ width: '14%' }}></View>
                }
            </View>
        </View>
    )
}

export default ScreenHeader;

