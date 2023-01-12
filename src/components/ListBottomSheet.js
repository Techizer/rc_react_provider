import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, TouchableHighlight, Keyboard, FlatList, Dimensions, } from "react-native";
import Modal from "react-native-modal";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { config, LanguageConfiguration, mobileH, } from "../Provider/utilslib/Utils";
import { Cross } from "../Assets/Icons/SvgIcons/Index";


const windowWidth = Dimensions.get('window').width
const deviceHeight = mobileH

const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const ListBottomSheet = ({
    visible,
    onRequestClose,
    data,
    title,
    currentIndex,
    currentItem,
    flag,
    onSelectTime = () => { }
}) => {

    return (
        <Modal
            isVisible={visible}
            animationIn='fadeInUpBig'
            animationOut='fadeOutDownBig'
            deviceWidth={windowWidth}
            animationInTiming={350}
            animationOutTimixng={350}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            // backdropColor='rgba(0,0,0,0.8)'
            style={{ margin: 0 }} >


            <View style={styles.modalContainer}>

                <View style={{
                    flexDirection: 'row',

                }}>
                    <TouchableHighlight
                        onPress={onRequestClose}
                        underlayColor={Colors.Highlight}
                        style={styles.closeContainer}>
                        <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                    </TouchableHighlight>

                    <Text
                        style={{
                            fontSize: Font.large,
                            fontFamily: Font.bold_font_family,
                            textAlign: config.textRotate,
                            color: Colors.textblack

                        }}>{`Select ${flag ? 'start' : 'end'} time for ${Days[currentIndex]}`}</Text>
                </View>

                <FlatList
                    data={data}
                    contentContainerStyle={{ paddingTop: vs(10) }}
                    renderItem={({ item, index }) => {
                        return (
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        onRequestClose()
                                        onSelectTime(item.value, currentIndex, currentItem, flag)
                                    }}>
                                    <View
                                        style={{
                                            width: "100%",
                                            alignSelf: "center",
                                            justifyContent: "flex-end",
                                        }}>
                                        <View
                                            style={{
                                                width: "98%",
                                                borderBottomColor: Colors.backgroundcolor,
                                                borderBottomWidth: index === (data.length - 1) ? 0 : 1,
                                                paddingVertical: vs(8),
                                            }}>
                                            <Text
                                                style={{
                                                    color: Colors.textblack_new,
                                                    textAlign: config.textRotate,
                                                    fontSize: Font.large
                                                }} >
                                                {item.value}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>

        </Modal>



    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: deviceHeight - 300,
        backgroundColor: Colors.white_color,
        borderRadius: 25,
        paddingTop: vs(28),
        paddingBottom: vs(20),
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999

    },
    closeContainer: {
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
    }
});

export default ListBottomSheet;