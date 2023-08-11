import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal } from "react-native";
import { Colors, Font } from "../Provider/Colorsfont";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import { windowHeight, windowWidth } from "../Helpers/Utils";
import { Icons } from "../Icons/IReferences";
import { _Cross } from "../Icons/SvgIcons/Index";


const MediaOptions = ({
    visible,
    onRequestClose,
    selectedOption = () => { }
}) => {

    const options = [
        {
            id: '2',
            title: 'Camera',
            icon: Icons.Camera
        },
        {
            id: '3',
            title: 'Gallery',
            icon: Icons.Gallery
        },
        {
            id: '1',
            title: 'Document',
            icon: Icons.Documents
        },
        // {
        //     id: '4',
        //     title: 'Audio',
        //     icon: Icons.Audio
        // },
    ]

    return (
        <Modal
            animationType='slide'
            visible={visible}
            transparent
            presentationStyle='overFullScreen'
        >
            {/* <BlurView
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        // zIndex: 999
                    }}
                    blurType='ultraThinMaterialDark'
                    blurAmount={15}
                    reducedTransparencyFallbackColor="white"
                /> */}

            <View style={styles.mainContainer}>

                <View style={styles.subContainer}>
                    <TouchableOpacity
                        onPress={onRequestClose}
                        style={styles.closeContainer}
                    >
                        <SvgXml xml={_Cross} height={vs(32)} width={s(32)} />
                    </TouchableOpacity>
                    <View style={styles.modalContainer}>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                flexWrap: 'wrap',
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                            {
                                options.map((item, index) => {
                                    return (
                                        <View style={{ alignItems: 'center', marginLeft: index == 0 ? 0 : (windowWidth * 8) / 100 }}>
                                            <TouchableOpacity
                                                disabled={(item.id == '4') ? true : false}
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    selectedOption(item.id)
                                                }}
                                                style={{
                                                    marginBottom: (windowWidth * 2) / 100,
                                                    height: (windowWidth * 14) / 100,
                                                    width: (windowWidth * 14) / 100,
                                                    borderRadius: 100,
                                                    backgroundColor: Colors.backgroundcolor,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>

                                                <Image
                                                    resizeMode="contain"
                                                    source={item.icon}
                                                    style={{
                                                        width: (windowWidth * 6) / 100,
                                                        height: (windowWidth * 6) / 100,
                                                        tintColor:(item.id == '4') ? Colors.lightGrey: Colors.textblue
                                                    }}
                                                />
                                            </TouchableOpacity>
                                            <Text style={{
                                                fontFamily: Font.Medium,
                                                fontSize: 10,
                                                color: Colors.Black
                                            }}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>

                    </View>
                </View>

            </View>

        </Modal>

    )
}
const styles = StyleSheet.create({

    mainContainer: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    subContainer: {
        width: windowWidth,
        height: windowHeight / 3.7,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 5,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: vs(20),
        paddingHorizontal: s(13),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        zIndex: 9999

    },
    closeContainer: {
        height: s(42),
        width: s(42),
        borderRadius: s(42),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.Black,
        zIndex: 999
    },
    viewWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },

});

export default MediaOptions;


