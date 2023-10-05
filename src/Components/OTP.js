import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, Image, StyleSheet, TouchableHighlight, Keyboard, FlatList, Alert, Platform, ActivityIndicator, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from 'react-native-toast-message'
import OTPTextInput from "react-native-otp-textinput";

import { Colors, Font } from "../Provider/Colorsfont";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API, Configurations, MessageFunctions, windowHeight, windowWidth } from "../Helpers/Utils";
import { Icons } from "../Icons/IReferences";
import { leftArrow } from "../Icons/SvgIcons/Index";
import Button from "./Button";
import StickyButton from "./StickyButton";
import OTPInput from "./OTPInput";
import { setRememberedEmail, setUserFCMToken, setUserLoginData } from "../Redux/Actions/UserActions";
import { ScreenReferences } from "../Stacks/ScreenReferences";
import { FBPushNotifications } from "../Helpers/FirebasePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


const OTP = ({
    visible,
    onRequestClose,
    contact,
    step,
    workArea,
    type,
    countryCode,
    status = () => { }
}) => {

    const insets = useSafeAreaInsets()
    const dispatch = useDispatch();
    const { reset } = useNavigation();

    const styles = useMemo(() => {
        return StyleSheet.create({

            mainContainer: {
                width: windowWidth,
                height: windowHeight,
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
                height: windowHeight,
                backgroundColor: Colors.White,
                position: 'absolute',
                bottom: 0,
                zIndex: 9999,
                // paddingTop: insets.top

            },
            title: {
                fontSize: (windowWidth * 6) / 100,
                fontFamily: Font.Regular,
                color: Colors.Black
            },
            desc: {
                fontSize: Font.small,
                fontFamily: Font.Regular,
                color: Colors.lightGrey,
                marginTop: vs(5)
            },
        });
    }, [])

    const [secondsRemaining, setSecondsRemaining] = useState(60);

    const [classStateData, setClassStateData] = useState({
        OTP: '',
        sendOTP: false,
        isOTPSent: true,
        isVerifying: false,
        isVerified: false,
    })

    let timerInterval;

    useEffect(() => {
        let timerInterval;
        let isPaused = false;

        if (visible && !classStateData.isVerifying) {
            timerInterval = setInterval(() => {
                if (!isPaused) {
                    setSecondsRemaining((lastSec) => {
                        if (lastSec <= 1) {
                            clearInterval(timerInterval);
                        }
                        return lastSec - 1;
                    });
                }
            }, 1000);
        }

        return () => clearInterval(timerInterval);

    }, [visible, classStateData.isVerifying, secondsRemaining]);

    const setState = (payload) => {
        setClassStateData(prev => ({ ...prev, ...payload }))
    }

    const resetState = () => {
        clearInterval(timerInterval)
        onRequestClose()
        setSecondsRemaining(60)
        setState({
            OTP: '',
            sendOTP: false,
            isOTPSent: true,
            isVerifying: false,
            isVerified: false,
        })
    }

    const secureEmail = (email) => {

        const [username, domain] = email.split('@');
        const firstThree = username.slice(0, 3);

        const securedEmail = `${firstThree}****@${domain}`;

        return securedEmail;
    }


    const secureNumber = (phoneNumber) => {

        const firstThree = phoneNumber.slice(0, 3);
        const lastThree = phoneNumber.slice(-3);

        const securedPhoneNumber = `${firstThree}******${lastThree}`;
        return securedPhoneNumber;
    }

    const showConfirmDialogReject = () => {
        return Alert.alert(
            "Cancel",
            "Are you sure you want to reject this appointment?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        resetState()
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    };


    const SendOTP = async () => {
        setState({ OTP: '' })
        let conditionsFailed = false;
        Keyboard.dismiss()

        if (conditionsFailed) {
            return false
        } else {

            setState({ sendOTP: true })
            let url = '';
            var data = new FormData();
            if (type == 'Login') {
                url = Configurations.baseURL + "api-login-send-otp";
                data.append('countrycode', countryCode)
                data.append('phone_number', `${contact}`)
                data.append('type', `provider`)

            } else {
                url = Configurations.baseURL + "api-send-otp";
                if (step == 50) {
                    data.append('otptype', 'email')
                    data.append('emailId', contact)
                } else {
                    data.append('otptype', 'mobile')
                    data.append('phone_number', contact)
                    data.append('work_area', workArea)
                }
            }


            console.log(data._parts);

            API.post(url, data, 1).then((obj) => {

                console.log('Send OTP Response', obj)
                if (obj.status == true) {
                    setState({ isOTPSent: true })
                    MessageFunctions.showSuccess('OTP sent to your email')
                    setSecondsRemaining(60)

                } else {
                    MessageFunctions.showError(obj?.message)
                }
            }).catch((error) => {
                MessageFunctions.showError('Something went wrong, please try again later.')
                console.log("Send OTP-error ------- ", error)
            }).finally(() => {
                setState({ sendOTP: false })
            })
        }

    }


    const VerifyOTP = async () => {
        clearInterval(timerInterval)
        let conditionsFailed = false;
        Keyboard.dismiss()


        if (classStateData.OTP == '' && classStateData.isOTPSent) {
            MessageFunctions.showError(`Please enter OTP sent to your ${step == 50 ? 'email' : 'Phone'}`)
            conditionsFailed = true;
            return
        }

        if (conditionsFailed) {
            return false
        } else {
            setState({ isVerifying: true })

            let url = Configurations.baseURL + "api-verification";
            var data = new FormData();
            if (step == 50) {
                data.append('otptype', 'email')
                data.append('emailId', contact)
                data.append('code', classStateData.OTP)
            } else {
                data.append('otptype', 'mobile')
                data.append('phone_number', contact)
                data.append('code', classStateData.OTP)
            }

            API.post(url, data, 1).then((obj) => {

                console.log('Verify OTP Response', obj)

                if (obj.status == true) {
                    setState({ isVerifying: false, isVerified: true })
                    status(true)
                    onRequestClose()
                    resetState()
                } else {
                    setState({ isVerifying: false })
                    MessageFunctions.showError(obj?.message)
                    status(false)
                }
            }).catch((error) => {
                setState({ isVerifying: false })
                console.log("verify OTP-error ------- ", error)
            })
        }


    }

    const Login = async () => {

        clearInterval(timerInterval)
        let conditionsFailed = false;
        Keyboard.dismiss()


        if (classStateData.OTP == '' && classStateData.isOTPSent) {
            MessageFunctions.showError(`Please enter OTP sent to your ${step == 50 ? 'email' : 'Phone'}`)
            conditionsFailed = true;
            return
        }

        if (conditionsFailed) {
            return false
        } else {
            setState({ isVerifying: true })
            let url = Configurations.baseURL + "api-service-provider-login";
            var data = new FormData();

            const fcm = await FBPushNotifications.getFcmToken()

            data.append('phone_number', contact)
            data.append('code', classStateData.OTP)
            data.append('device_type', Configurations.device_type)
            data.append('fcm_token', fcm)

            console.log(data._parts);
            API.post(url, data, 1).then((obj) => {
                setState({ isVerifying: false })
                if (obj.status == true) {

                    dispatch(setUserLoginData(obj?.result))
                    dispatch(setUserFCMToken(fcm))
                    dispatch(setRememberedEmail(contact))
                    AsyncStorage.setItem('userId', obj?.result?.user_id)

                    resetState()

                    setTimeout(() => {
                        reset({
                            index: 0,
                            routes: [{ name: ScreenReferences.Home }],
                        });
                    }, 700);

                } else {
                    setTimeout(() => {
                        MessageFunctions.showError(obj.message)
                    }, 700);
                    return false;
                }
            }).catch((error) => {
                setState({ isVerifying: false })
                MessageFunctions.showError('Something went wrong, please try again later')
                console.log("Login------ error ------- ", error)

            })
        }

    }


    return (

        <View style={{ flex: 1, }}>
            <Modal
                animationType='slide'
                visible={visible}
                transparent
                presentationStyle='overFullScreen'
            >



                <View style={[styles.mainContainer]}>

                    <View style={[styles.modalContainer]}>

                        <KeyboardAwareScrollView
                            // keyboardOpeningTime={200}
                            extraScrollHeight={50}
                            enableOnAndroid={true}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{
                                height: windowHeight,
                                // paddingTop: Platform.OS == 'ios' ? insets.top : 0
                            }}
                            showsVerticalScrollIndicator={false}>



                            <View
                                style={{
                                    width: "100%",
                                    height: (windowWidth * 30) / 100,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingTop: Platform.OS == 'ios' ? insets.top : 0,
                                }}>

                                {
                                    secondsRemaining <= 0 &&

                                    <TouchableHighlight
                                        underlayColor={Colors.Highlight}
                                        onPress={() => {
                                            resetState()
                                        }}
                                        style={{ height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <SvgXml xml={leftArrow} height={vs(17.11)} width={s(9.72)} fill={'red'} fillOpacity={1} />

                                    </TouchableHighlight>


                                }
                            </View>

                            <Toast />


                            <View style={{ paddingHorizontal: s(16) }}>

                                <Text style={styles.title}>{step == 50 ? 'Email Verification' : 'Phone Verification'}</Text>
                                {
                                    step == 50 ?
                                        <Text style={styles.desc}>{`We have sent code to your email:  ${secureEmail(contact)}`}</Text>
                                        :
                                        <Text style={styles.desc}>{`We have sent code to your Phone:  +${secureNumber(contact)}`}</Text>
                                }

                                <View style={{ paddingHorizontal: s(25), marginTop: (windowWidth * 8) / 100, }}>
                                    {/* <OTPTextInput
                                        style={{
                                            height: (windowWidth * 14) / 100,
                                            width: (windowWidth * 15) / 100,
                                            color: "#000",
                                            alignSelf: "center",
                                            fontFamily: Font.Regular,
                                            fontSize: (windowWidth * 5) / 100,
                                            borderWidth: 2,
                                            borderColor: Colors.Border,
                                            borderRadius: (windowWidth * 2) / 100,
                                            textAlign: "center",

                                        }}
                                        ref={otpRef}
                                        numberOfInputs={4}
                                        cellTextLength={1}
                                        handleTextChange={(val) => {
                                            setState({ OTP: val })
                                        }}
                                        tintColor={Colors.Blue}
                                        offTintColor="#f5f5ff"
                                        keyboardType={"number-pad"}
                                        backgroundColor={Colors.backgroundcolor}
                                        autoFocus={false}
                                        editable={classStateData.isOTPSent}
                                    /> */}

                                    <OTPInput
                                        onComplete={(code) => {
                                            setState({ OTP: code })
                                        }}
                                        reset={classStateData.sendOTP}
                                    />
                                </View>

                                < View style={{ width: '100%', alignItems: 'center', }}>

                                    {
                                        ((secondsRemaining > 0 && classStateData.isOTPSent && !classStateData.isVerifying)) &&
                                        <Text
                                            style={{
                                                fontSize: Font.medium,
                                                fontFamily: Font.Regular,
                                                color: Colors.buttoncolorblue
                                            }}
                                        >{secondsRemaining}</Text>
                                    }
                                    {

                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <View
                                                style={{
                                                    height: windowHeight / 20,
                                                    justifyContent: 'center'
                                                }}
                                            >

                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <Text
                                                        style={{
                                                            fontSize: Font.xlarge,
                                                            fontFamily: Font.Regular,
                                                            color: Colors.DarkGrey
                                                        }}
                                                    >{`Didn't receive code? `}
                                                    </Text>

                                                    {
                                                        classStateData.sendOTP ?
                                                            <ActivityIndicator size={'small'} color={Colors.DarkGrey} />
                                                            :
                                                            <TouchableOpacity
                                                                disabled={(secondsRemaining > 0 && classStateData.isOTPSent)}
                                                                activeOpacity={0.6}
                                                                onPress={() => {
                                                                    SendOTP()
                                                                }}>
                                                                <Text
                                                                    style={{
                                                                        fontSize: Font.xlarge,
                                                                        fontFamily: Font.Regular,
                                                                        color: (secondsRemaining > 0 && classStateData.isOTPSent) ? Colors.DarkGrey : Colors.buttoncolorblue
                                                                    }}
                                                                >{'Resend'}</Text>
                                                            </TouchableOpacity>
                                                    }

                                                </View>

                                            </View>



                                        </View>
                                    }
                                </View>

                            </View>



                        </KeyboardAwareScrollView>

                        <StickyButton
                            text={'VERIFY'}
                            onPress={() => {
                                type == 'Login' ? Login() : VerifyOTP()
                            }}
                            onLoading={classStateData.isVerifying}
                        />

                    </View>

                </View>
            </Modal>
        </View>




    )
}


export default OTP;


