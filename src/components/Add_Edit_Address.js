import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, ActivityIndicator, TouchableHighlight, Keyboard, FlatList, Alert, Platform, } from "react-native";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import { Colors, Font } from "../Provider/Colorsfont";
import {
    windowWidth, deviceHeight, Lang_chg, config,
    localStorage, Icons, consolepro, apifuntion, msgProvider, windowHeight,
} from "../Provider/utilslib/Utils";

import { Add, Address, Cross, dummyUser, Edit, Menu, roundCheck } from "../../src/icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "./Button";

const AddEditAddress = ({
    visible,
    onRequestClose,
    type,
    editedAddress = () => { },
    navigation,

    addressIDParam = -1,
    addressTitleParam = '',
    googleAddressParam = '',
    nearestLandmarkParam = '',
    buildingNameParam = '',
    isDefaultParam = '',
    longitudeParam = '',
    latitudeParam = '',
    shouldShowEditParam = true,
    navToBackThen=false
}) => {

    const [title, setTitle] = useState('')
    const [googleAddress, setGoogleAddress] = useState('')
    const [nearest, setNearest] = useState('')
    const [building, setBuilding] = useState('')
    const [defaultAddress, setDefaultAddress] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const scrollRef = useRef()
    const titleRef = useRef()
    const addressRef = useRef()
    const landmarkRef = useRef()
    const buildingRef = useRef()

    useEffect(() => {
        setGoogleAddress(googleAddress)

        if (type == 'editAddress') {
            setTitle(addressTitleParam)
            setGoogleAddress(googleAddressParam)
            setNearest(nearestLandmarkParam)
            setBuilding(buildingNameParam)
            setDefaultAddress((isDefaultParam != '' && isDefaultParam != '0') ? false : true)
        }

    }, [addressIDParam, addressTitleParam, googleAddressParam, nearestLandmarkParam, buildingNameParam, isDefaultParam, longitudeParam, latitudeParam, shouldShowEditParam])

    const resetState = () => {
        setTitle('')
        setGoogleAddress('')
        setNearest('')
        setBuilding('')
        setDefaultAddress('1')
    }

    const _scrollToInput = (reactNode) => {
        scrollRef.props.scrollToFocusedInput(reactNode)
    }

    const editAddress = async () => {
        var user_details = await localStorage.getItemObject("user_arr");
        let user_id = user_details["user_id"];
        let url = config.baseURL + "api-provider-update-address";

        if (title == '') {
            msgProvider.showError("Please add address title");
            return false;
        }
        var data = new FormData();
        data.append("login_user_id", user_id);
        data.append("id", addressIDParam);
        data.append("title", title);
        data.append("address", googleAddress);
        data.append("lat", latitudeParam);
        data.append("lng", longitudeParam);
        data.append("landmark", nearest);
        data.append("building_name", building);
        data.append("default", defaultAddress ? '0' : '1');
        data.append("service_address", googleAddress);
        data.append("google_address", googleAddress);

        console.log({ data });

        setIsLoading(true)
        apifuntion
            .postApi(url, data, 1)
            .then((obj) => {
                consolepro.consolelog("editAddress-res----", obj);
                setIsLoading(false)
                if (obj.status == true) {
                    msgProvider.showSuccess(obj.message)
                    onRequestClose()
                    editedAddress(title)
                    // user_details['current_address'] = obj.result.current_address
                    // localStorage.setItemObject("user_arr", user_details);
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                msgProvider.showError(error.message)
                onRequestClose()
                console.log("-------- error ------- " + error);
            }).finally(()=>{
                if (navToBackThen) {
                    navigation.replace('ServiceAddressF1')
                }
            })
    };

    return (
        <Modal
            isVisible={visible}
            statusBarTranslucent={true}
            animationIn='fadeInUpBig'
            animationOut='fadeOutDownBig'
            animationInTiming={350}
            animationOutTimixng={350}
            avoidKeyboard={false}
            // onBackButtonPress={onRequestClose}
            hasBackdrop={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            // backdropColor='rgba(0,0,0,0.8)'
            style={{ margin: 0, }} >


            <View pointerEvents={(isLoading || isDelete) ? 'none' : 'auto'} style={styles.modalContainer}>
                {
                    isDelete &&
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        // opacity: 0.8,
                        width: windowWidth,
                        height: windowHeight - 200,
                        borderRadius: 25,
                        position: 'absolute',
                        bottom: 0,
                        zIndex: 999,
                    }}>
                        <ActivityIndicator size={'small'} color={Colors.Theme} />
                    </View>
                }
                <TouchableHighlight
                    onPress={() => {
                        onRequestClose()
                        // resetState()
                    }}
                    underlayColor={Colors.Highlight}
                    style={styles.closeContainer}
                >
                    <SvgXml xml={Cross} height={vs(19)} width={s(18)} />
                </TouchableHighlight>

                <Text
                    style={{
                        fontSize: Font.large,
                        fontFamily: Font.SemiBold,
                        textAlign: config.textRotate,
                        color: Colors.darkText

                    }}>{'Edit Address'}</Text>

                <KeyboardAwareScrollView
                    // keyboardOpeningTime={200}
                    extraScrollHeight={50}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{
                        justifyContent: 'center',
                        paddingBottom: vs(15),
                    }}
                    showsVerticalScrollIndicator={false}>


                    <View style={{ marginTop: vs(15) }}>

                        {

                            <>
                                <AuthInputBoxSec
                                    mainContainer={{ width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Address Title'}
                                    //inputRef={titleRef}
                                    onChangeText={(val) => setTitle(val)}
                                    value={title}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        landmarkRef.current.focus();
                                    }}
                                    // onFocus={(event: Event) => {
                                    //     _scrollToInput(event.target)
                                    // }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(5), width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Google Map Address'}
                                    //inputRef={addressRef}
                                    onChangeText={(val) => setGoogleAddress(val)}
                                    value={googleAddress}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    editable={false}
                                    numberOfLines={1}
                                    multiline
                                    disableImg={shouldShowEditParam}
                                    iconName={'pencil'}
                                    iconPressAction={shouldShowEditParam ? () => {
                                        onRequestClose()
                                        setTimeout(() => {
                                            navigation.replace('SearchPlaceScreen', {
                                                address_id: addressIDParam
                                            })
                                        }, 500)
                                    } : () => { }}
                                />

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(5), width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Nearest Landmark'}
                                    //inputRef={landmarkRef}
                                    onChangeText={(val) => setNearest(val)}
                                    value={nearest}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        buildingRef.current.focus()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(5), width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Building Name'}
                                    //inputRef={buildingRef}
                                    onChangeText={(val) => setBuilding(val)}
                                    value={building}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        alignSelf: "center",
                                        marginTop: vs(15),
                                        flexDirection: "row",
                                        alignItems: 'center'
                                    }} >

                                    <TouchableOpacity
                                        disabled
                                        activeOpacity={0.8}
                                        style={{
                                            width: "37%",
                                            flexDirection: "row",
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            setDefaultAddress(!defaultAddress)
                                        }}>


                                        <TouchableOpacity
                                            disabled
                                            onPress={() => {
                                                setDefaultAddress(!defaultAddress)
                                            }}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                borderRadius: 5,
                                                backgroundColor: defaultAddress ? Colors.Theme : Colors.White,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: defaultAddress ? 0 : 1.3,
                                                borderColor: Colors.Border
                                            }}>
                                            {
                                                defaultAddress ?
                                                    <Image
                                                        style={{
                                                            height: 14,
                                                            width: 14,
                                                            tintColor: Colors.White
                                                        }}
                                                        resizeMode="contain"
                                                        source={require('../icons/tick.png')}
                                                    />
                                                    :
                                                    null
                                            }
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                color: Colors.inActiveText,
                                                fontFamily: Font.Regular,
                                                fontSize: Font.medium,
                                            }}>
                                            {'Default Address'}
                                        </Text>

                                    </TouchableOpacity>
                                </View>

                            </>

                        }

                        <View style={{ marginTop: vs(25) }}>

                            <Button
                                text={"Save Address"}
                                onPress={() => {
                                    editAddress()
                                }}
                                btnStyle={{ marginTop: vs(10) }}
                                onLoading={isLoading}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Modal >
    )
}
const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: (windowHeight / 1.5),
        backgroundColor: Colors.White,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: vs(40),
        paddingBottom: vs(20),
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999

    },
    closeContainer: {
        height: s(35),
        width: s(35),
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

export default AddEditAddress;

