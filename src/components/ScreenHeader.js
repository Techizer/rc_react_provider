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
    Icons,
    consolepro,
    Lang_chg,
    apifuntion,
} from "../Provider/utilslib/Utils";

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
    return (
        title != 'Home' ?
            (
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
                                    fontFamily: Font.fontmedium,
                                    fontSize: (windowWidth * 4) / 100,
                                    color:Colors.darkText
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
                                    <SvgXml xml={Notification} height={vs(20.26)} width={s(16.21)} />
                                </TouchableHighlight>
                                :
                                <View style={{ width: '14%' }}></View>
                        }
                    </View>
                </View>
            )
            :
            (<View style={{
                width: windowWidth,
                height: headerHeight + StatusbarHeight,
                backgroundColor: Colors.White,
                paddingTop: StatusbarHeight + 10,
                borderBottomWidth: 0.9,
                borderBottomColor: Colors.Border
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        height: '100%',
                        alignSelf: "center",
                        // alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: "13%",
                            height: '100%',
                            alignSelf: "center",
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft:s(8)
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.toggleDrawer();
                            }}>

                            {
                                (leftIcon == "NA" || leftIcon == "" || leftIcon == null) ?
                                    <SvgXml xml={dummyUser} height={s(29)} width={s(29)} />
                                    :
                                    <Image
                                        source={{ uri: leftIcon }}
                                        style={{ height: s(29), width: s(29), borderRadius: s(29), backgroundColor: Colors.backgroundcolor, alignSelf: 'center' }}
                                    />


                            }


                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: "74%",
                        height: '100%',
                        justifyContent: 'center',
                        paddingHorizontal: s(6)
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Show_currentlocation");
                            }}
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    fontFamily: Font.Regular,
                                    fontSize: Font.smallheadingfont,
                                }}>
                                {Lang_chg.MyDashboard[config.language]}
                            </Text>
                            <Image
                                source={require("../icons/back-svg.png")}
                                style={{
                                    marginLeft: (windowWidth * 2) / 100,
                                    width: 11,
                                    height: 11,
                                    tintColor: "#17181A",
                                }}
                            />
                        </TouchableOpacity>
                        {(addressOld != null && addressOld != "") ? (
                            <Text
                                onPress={() => { navigation.navigate("Show_currentlocation"); }}
                                numberOfLines={1}
                                style={{
                                    color: Colors.dullGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.smallheadingfont,
                                    textAlign: config.textRotate,
                                    width: '60%',
                                    marginTop: vs(3)


                                }}
                            >
                                {addressOld}
                            </Text>
                        ) : (
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.dullGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: 12,
                                    textAlign: config.textRotate,
                                }}
                            >{addressShow}</Text>
                        )}
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
                                <SvgXml xml={Notification} height={vs(20.26)} width={s(16.21)} />
                            </TouchableHighlight>
                            :
                            <></>
                    }
                    {/* <View
                        style={{
                            width: "10%",
                            paddingTop: (windowWidth * 2) / 100,
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Notifications");
                            }}
                        >
                            <Image
                                source={
                                    this.state.notification_count > 0
                                        ? Icons.notifications
                                        : Icons.notifications_sec
                                }
                                style={{
                                    alignSelf: "flex-end",
                                    resizeMode: "contain",
                                    width: (windowWidth * 6) / 100,
                                    height: (windowWidth * 6) / 100,
                                }}
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>)
    )
}

export default ScreenHeader;

