import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, LanguageConfiguration, config, localStorage } from "../Provider/utilslib/Utils";
import { Add, Address, Cross, dummyUser, Edit, Menu, roundCheck } from "../../src/Assets/Icons/SvgIcons/Index";


const AddressContainer = ({
    type,
    index,
    addressDetails,
    selectedAddress,
    navigation,
    showModal = () => { },
    selected,
    editable = () => { },
    isLoading,
    defaultAdd,
    item
}) => {

    useEffect(() => {
        // console.log({ defaultAdd });
    }, [])
    return (<>
        {isLoading ?

            <View style={{
                flexDirection: 'row',
                width: '100%',
                alignSelf: 'center',
                paddingTop: (index === 0) ? 0 : vs(18),
                backgroundColor: Colors.White
            }}>

                <View style={{ width: '9%', }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={s(20)} height={s(20)} borderRadius={s(20)} />
                    </SkeletonPlaceholder>
                </View>

                <View style={{ width: '91%', paddingBottom: vs(12) }}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                        <View style={{ width: '100%' }}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={s(70)} height={s(15)} borderRadius={s(5)} />
                            </SkeletonPlaceholder>
                        </View>

                    </View>

                    <View style={{ width: '100%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={windowWidth - 100} height={s(15)} borderRadius={s(5)} style={{ marginTop: vs(7) }} />
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </View>
            :
            <View
                style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingTop: (index === 0 && defaultAdd == addressDetails?.id) ? 18 : (index === 0) ? 0 : vs(18), backgroundColor: defaultAdd == addressDetails?.id ? Colors.appointmentdetaillightblue : 'transparent' }}>
                <View style={{ width: '9%', }}>
                    <SvgXml xml={Address} />
                </View>

                <View style={{ width: '91%', borderBottomWidth: 0.5, borderBottomColor: 'lightgrey', paddingBottom: vs(12) }}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                        <View style={{ width: '35%' }}>
                            <Text numberOfLines={1} style={{ textAlign: config.textRotate, fontSize: (windowWidth * 3.7) / 100, fontFamily: Font.Regular, color: Colors.darkText }}>{addressDetails.title ? addressDetails.title : 'Unnamed'}</Text>
                        </View>

                        <View style={{ width: '57%', }}>
                            {
                                (addressDetails.default === '0') &&
                                (
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '33%' }}>
                                        <SvgXml xml={roundCheck} />
                                        <Text style={{ textAlign: config.textRotate, fontSize: Font.textsize, fontFamily: Font.Medium, color: Colors.theme_color }}>{'Default'}</Text>
                                    </View>
                                )
                            }
                        </View>

                        <View style={{ width: '8%', }}>
                            <TouchableHighlight
                                onPress={() => {
                                    showModal(true)
                                    selectedAddress(index)
                                }}
                                underlayColor={Colors.Highlight}
                                style={{ width: '100%', height: vs(20), borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                                <SvgXml xml={Edit} />
                            </TouchableHighlight>
                        </View>

                    </View>

                    <View style={{ width: '100%', }}>
                        <Text style={{ textAlign: config.textRotate, fontSize: (windowWidth*3.2)/100, fontFamily: Font.Regular, color: '#6D737E', marginTop: vs(4) }}>{addressDetails.service_address ? addressDetails?.service_address : '-'}</Text>
                    </View>
                </View>
            </View>
        }
    </>

    )
}
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backdropColor: 'pink',
    },
    modalContainer: {
        width: windowWidth,
        height: deviceHeight - 300,
        backgroundColor: Colors.White,
        borderRadius: 25,
        paddingTop: vs(40),
        paddingBottom: vs(20),
        paddingHorizontal: s(11),
        position: 'absolute',
        bottom: 0,
        zIndex: 999

    },
    closeContainer: {
        height: s(30),
        width: s(30),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(30),
        right: s(11),
        zIndex: 999
    },
    Title: {
        fontSize: 20,
        fontFamily: Font.Regular,
        color: Colors.Black,
    },
    Desc: {
        fontSize: 16,
        fontFamily: Font.Regular,
        color: Colors.Secondary,
    },
});

export default AddressContainer;


