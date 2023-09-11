import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Modal, TouchableHighlight, Keyboard, Platform } from "react-native";
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, Configurations, API, MessageFunctions, windowHeight } from "../Helpers/Utils";
import { Cross, _Cross } from "../Icons/SvgIcons/Index";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import AuthInputBoxSec from "./AuthInputBoxSec";
import Button from "./Button";
import { ScreenReferences } from "../Stacks/ScreenReferences";
import { useSelector } from "react-redux";
import { TextInput } from "react-native-paper";
import { BottomSheetProps, BottomSheetStyles, BottomSheetStylesForLarge, BottomSheetViewStyles } from "../Styles/Sheet";
import StickyButton from "./StickyButton";

const AddressInputPopup = ({ visible, onRequestClose, type = 'addAddress', editedAddress = () => { },
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
    navToBackThen = false
}) => {

    const [title, setTitle] = useState('')
    const [googleAddress, setGoogleAddress] = useState('')
    const [nearest, setNearest] = useState('')
    const [building, setBuilding] = useState('')
    const [defaultAddress, setDefaultAddress] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const scrollRef = useRef()
    const landmarkRef = useRef()
    const buildingRef = useRef()


    const {
        loginUserData
    } = useSelector(state => state.StorageReducer)

    useEffect(() => {
        setGoogleAddress(googleAddress)

        if (type == 'editAddress') {
            setTitle(addressTitleParam)
            setGoogleAddress(googleAddressParam)
            setNearest(nearestLandmarkParam)
            setBuilding(buildingNameParam)
            setDefaultAddress((isDefaultParam != '' && isDefaultParam != '0') ? false : true)
        } else if (type == 'addAddress') {
            setTitle(addressTitleParam)
            setGoogleAddress(googleAddressParam)
            setNearest(nearestLandmarkParam)
            setBuilding(buildingNameParam)
            setDefaultAddress((isDefaultParam != '' && isDefaultParam != '0') ? false : true)
        }

    }, [addressIDParam, addressTitleParam, googleAddressParam, nearestLandmarkParam, buildingNameParam, isDefaultParam, longitudeParam, latitudeParam, shouldShowEditParam])

    const addEditAddress = async () => {
        let user_id = loginUserData["user_id"];

        let endpoint = ''
        if (type === 'editAddress') {
            endpoint = "api-provider-update-address"
        } else if (type === 'addAddress') {
            endpoint = "api-provider-insert-address"
        }

        let url = Configurations.baseURL + endpoint;

        if (title == '') {
            MessageFunctions.showError("Please add address title");
            return false;
        }
        var data = new FormData();

        if (type === 'editAddress') {
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

        } else if (type === 'addAddress') {
            data.append("user_id", user_id);
            data.append("title", title);
            data.append("service_type", loginUserData?.user_type);
            data.append("address", googleAddress);
            data.append("landmark", nearest);
            data.append("building_name", building);
            data.append("lat", latitudeParam);
            data.append("lng", longitudeParam);
            data.append("default", defaultAddress ? '0' : '1');
            data.append("service_address", googleAddress);
            data.append("google_address", googleAddress);
        }


        setIsLoading(true)

        console.log('addData...', data);
        API
            .post(url, data, 1)
            .then((obj) => {
                console.log("addaddress-res----", obj);
                setIsLoading(false)
                if (obj.status == true) {
                    MessageFunctions.showSuccess(obj.message)
                    // refe.current.close()
                    onRequestClose()
                    editedAddress(title)
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setIsLoading(false)
                MessageFunctions.showError(error.message)
                onRequestClose()
                console.log("-------- error ------- " + error);
            }).finally(() => {
                if (navToBackThen) {
                    navigation.replace(ScreenReferences.ServiceAddress)
                }
            })
    };



    return (
        <View style={{ flex: 1 }} pointerEvents={(isLoading || isDelete) ? 'none' : 'auto'}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >

                <View style={styles.mainContainer}>
                    <Toast />
                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            onPress={onRequestClose}
                            style={styles.closeContainer}
                        >
                            <SvgXml xml={Cross} height={vs(12)} width={s(12)} />
                        </TouchableOpacity>

                        <View style={styles.modalContainer}>

                            <View style={BottomSheetViewStyles.TitleBar}>
                                <Text style={BottomSheetViewStyles.Title}>{(type === 'editAddress') ? 'Edit Address' : 'Add Address'}</Text>
                            </View>

                            <KeyboardAwareScrollView
                                extraScrollHeight={50}
                                enableOnAndroid={true}
                                keyboardShouldPersistTaps='handled'
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                    paddingHorizontal: s(13),
                                    paddingBottom: vs(15),
                                }}
                                showsVerticalScrollIndicator={false}>

                                <AuthInputBoxSec
                                    mainContainer={{ width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Address Title'}
                                    onChangeText={(val) => setTitle(val)}
                                    value={title}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        landmarkRef.current.focus();
                                    }}
                                    blurOnSubmit={Platform.OS === 'ios' ? true : false}
                                    editable
                                />

                                <TextInput
                                    style={{
                                        backgroundColor: Colors.tab_background_color,
                                        alignSelf: 'flex-start',
                                        justifyContent: 'flex-start',
                                        textAlignVertical: 'top',
                                        width: '100%',
                                        color: Colors.Black,
                                        fontSize: Font.medium,
                                        textAlign: Configurations.textalign,
                                        fontFamily: Font.Regular,
                                        marginTop: vs(5)
                                    }}
                                    label={'Google Map Address'}
                                    onChangeText={(val) => setGoogleAddress(val)}
                                    value={googleAddress.trim()}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    editable={false}
                                    multiline
                                    mode='outlined'
                                    outlineColor={Colors.field_border_color}
                                    activeOutlineColor={Colors.placholderactive}
                                    allowFontScaling={false}
                                    right={
                                        (shouldShowEditParam) &&
                                        <TextInput.Icon
                                            name={'pencil'}
                                            onPress={shouldShowEditParam ? () => {
                                                refe.current.close()
                                                setTimeout(() => {
                                                    navigation.navigate(ScreenReferences.SearchPlace, {
                                                        address_id: addressIDParam,
                                                        isNew: false
                                                    })
                                                }, 500)
                                            } : () => { }}
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

                                <AuthInputBoxSec
                                    mainContainer={{ marginTop: vs(5), width: '100%' }}
                                    inputFieldStyle={{ height: vs(35) }}
                                    lableText={'Nearest Landmark'}
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
                                    inputRef={landmarkRef}
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
                                    inputRef={buildingRef}
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
                                                        source={require('../Icons/tick.png')}
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

                            </KeyboardAwareScrollView>

                            <StickyButton
                                text={"Save Address"}
                                onPress={() => {
                                    addEditAddress()
                                }}
                                // btnStyle={{ marginTop: vs(10) }}
                                customStyles={{
                                    mainContainer: { width: '100%' }
                                }}
                                onLoading={isLoading}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>


        // <RBSheet
        //     ref={refe}
        //     {...BottomSheetProps}
        //     customStyles={BottomSheetStylesForLarge} >
        //     <View style={BottomSheetViewStyles.MainView}>
        //         <View style={BottomSheetViewStyles.ButtonContainer}>
        //             <TouchableOpacity style={BottomSheetViewStyles.Button} onPress={() => {
        //                 refe.current.close()
        //             }}>
        //                 <SvgXml xml={_Cross}
        //                     width={windowHeight / 26}
        //                     height={windowHeight / 26}
        //                 />
        //             </TouchableOpacity>
        //         </View>

        //         <View style={BottomSheetViewStyles.Body}>

        //             <View style={BottomSheetViewStyles.TitleBar}>
        //                 <Text style={BottomSheetViewStyles.Title}>{(type === 'editAddress') ? 'Edit Address' : 'Add Address'}</Text>
        //             </View>

        //             <KeyboardAwareScrollView contentContainerStyle={BottomSheetViewStyles.ScrollContainer}>
        //                 <View style={{ padding: vs(8) }}>


        //                     <Button
        //                         text={"Save Address"}
        //                         onPress={() => {
        //                             addEditAddress()
        //                         }}
        //                         // btnStyle={{ marginTop: vs(10) }}
        //                         customStyles={{
        //                             mainContainer: {width: '100%'}
        //                         }}
        //                         onLoading={isLoading}
        //                     />
        //                 </View>
        //             </KeyboardAwareScrollView>
        //         </View>
        //     </View>

        // </RBSheet>
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
        height: windowHeight / 1.35,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
    },
    modalContainer: {
        width: windowWidth,
        height: windowHeight / 1.5,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 9999

    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.LightBlack,
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

export default AddressInputPopup;


