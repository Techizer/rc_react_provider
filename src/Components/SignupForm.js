import { TouchableHighlight, Keyboard, FlatList, Modal, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';
import { SvgXml, Circle, Svg } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import { vs, s } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from "react-native-raw-bottom-sheet";

import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts, Media, windowHeight, windowWidth } from '../Helpers/Utils';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { _Cross, leftArrow, rightArrow, dummyUser, roundCheck } from '../Icons/SvgIcons/Index';
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { DocTypes, UserTypes } from '../Helpers/Constants';
import { BottomSheetProps, BottomSheetStyles, BottomSheetViewStyles } from '../Styles/Sheet';
import { setAppState } from '../Redux/Actions/UserActions';
import RegistrationSteps from './RegistrationSteps';
import ListBottomSheet from './ListBottomSheet';
import { getServiceCountries, getSpecialities } from '../Helpers/APIFunctions';
import MediaOptions from './MediaOptions';

export default SignupForm = ({ navigation }) => {

    const [classStateData, setClassStateData] = useState({
        name: '',
        lName: '',
        email: '',
        number: '',
        id: '',
        id_number: '',
        speciality: null,
        qualification: '',
        experience: '',
        scfhs_number: '',
        selectedCountry: null,
        password: '',
        confirm: '',
        mobile: '',
        isLoadingInButton: false,
        imageType: '',
        userType: null,
        dob: '',
        gender: '',
        hosp_moh_lic_no: '',
        hosp_reg_no: '',
        profileImage: null,
        id_image: null,
        certificate: null,
        scfhs_image: null,
    })
    const [progress, setProgress] = useState(0)
    const [dropdown, setDropdown] = useState(-1)
    const [isDropdown, setIsDropdown] = useState(false)
    const [dropdownList, setDropdownList] = useState([])
    const [dropdownTitle, setDropdownTitle] = useState('')
    const [securePass, setSecurePass] = useState(true)
    const [confirmSecurePass, setConfirmSecurepass] = useState(true)
    const [isDatePicker, setIsDatePicker] = useState(false)
    const [mediaOptions, setMediaOptions] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const fNameRef = useRef()
    const lNameRef = useRef()
    const emailRef = useRef()
    const passRef = useRef()
    const confirmPassRef = useRef()
    const qualRef = useRef()
    const expRef = useRef()
    const idRef = useRef()
    const licenseRef = useRef()
    const numberRef = useRef()

    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({
        docType: {
            width: '100%',
            height: (windowWidth * 13) / 100,
            backgroundColor: Colors.white_color,
            borderWidth: 0.5,
            borderColor: Colors.DarkGrey,
            borderRadius: 5,
            paddingHorizontal: '4%',
            justifyContent: 'center'
        },
        docTitle: {
            fontSize: Font.xlarge,
            fontFamily: Font.Regular,
            color: Colors.DarkGrey
        },
        profilePic: {
            height: (windowWidth * 32) / 100,
            width: (windowWidth * 32) / 100,
            borderRadius: (windowWidth * 32) / 100,
            borderWidth: 1.5,
            borderColor: Colors.DarkGrey,
            backgroundColor: Colors.white_color,
            justifyContent: 'center',
            alignItems: 'center'
        },
        finalTextOne: {
            fontSize: (windowWidth * 10) / 100,
            color: Colors.Green,
            fontFamily: Font.Regular,
            alignSelf: 'center'
        },
        finalTextTwo: {
            fontSize: Font.xxxlarge,
            color: Colors.textblue,
            fontFamily: Font.Regular,
            alignSelf: 'center',
            textAlign: 'center'
        },
        finalTextThree: {
            fontSize: Font.xxxlarge,
            color: Colors.textblue,
            fontFamily: Font.Regular,
            alignSelf: 'center',
            textAlign: 'center'
        }
    })

    useEffect(() => {
        if (progress == 75) {
            const getCountries = async () => {
                await getServiceCountries().then((data) => {
                    setDropdownList(data)
                })
            }
            getCountries()
        }
    }, [progress])

    const RenderDocTypes = ({ item, index }) => {
        return (
            <View

                style={[styles.docType, { marginTop: index == 0 ? 0 : (windowWidth / 20) }]}>
                <Text style={styles.docTitle}>{`${index + 1}. ${item.title}`}</Text>
            </View>
        )
    }

    const FirstStep = () => {
        return (
            <>
                <DropDownboxSec
                    mainContainer={{ marginTop: (windowWidth / 35) }}
                    lableText={(classStateData.userType == null) ? 'Select User Type' : classStateData.userType.title}
                    boxPressAction={() => {
                        setDropdown(1)
                        setDropdownTitle('Select User Type')
                        setIsDropdown(!isDropdown)
                        setDropdownList(UserTypes)
                        resetState()
                    }}
                />

                {
                    (classStateData.userType != null && classStateData.userType.value != 'babysitter' && classStateData.userType.value != 'caregiver' && classStateData.userType.value != 'lab') &&
                    <DropDownboxSec
                        mainContainer={{ marginTop: (windowWidth / 35) }}
                        lableText={(classStateData.speciality == null) ? 'Select Speciality' : classStateData.speciality.title}
                        boxPressAction={() => {
                            setDropdown(2)
                            setDropdownTitle('Select Speciality')
                            setIsDropdown(!isDropdown)
                        }}
                    />
                }
            </>
        )
    }

    const SecondStep = () => {
        return (
            <>
                <AuthInputBoxSec
                    mainContainer={{
                        width: '100%',
                    }}
                    lableText={'First Name'}
                    inputRef={fNameRef}
                    onChangeText={(text) =>
                        setState({ name: text })
                    }
                    value={classStateData.name}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        lNameRef.current.focus();
                    }}
                />
                <AuthInputBoxSec
                    mainContainer={{
                        width: '100%',
                        marginTop: (windowWidth / 35)
                    }}
                    lableText={'Last Name'}
                    inputRef={lNameRef}
                    onChangeText={(text) =>
                        setState({ lName: text })
                    }
                    value={classStateData.lName}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        emailRef.current.focus();
                    }}
                />
                <AuthInputBoxSec
                    mainContainer={{
                        width: '100%',
                        marginTop: (windowWidth / 35)
                    }}
                    lableText={'Email Address'}
                    inputRef={emailRef}
                    onChangeText={(text) =>
                        setState({ email: text })
                    }
                    value={classStateData.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        passRef.current.focus();
                    }}
                />
                <AuthInputBoxSec
                    mainContainer={{
                        width: '100%',
                        marginTop: (windowWidth / 35)
                    }}
                    lableText={'Password'}
                    inputRef={passRef}
                    onChangeText={(text) =>
                        setState({ password: text })
                    }
                    value={classStateData.password}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyLabel="next"
                    returnKeyType="next"
                    secureTextEntry={securePass}
                    disableImg={true}
                    iconName={securePass ? 'eye-off' : 'eye'}
                    iconPressAction={() => {
                        setSecurePass(!securePass)
                    }}
                    onSubmitEditing={() => {
                        confirmPassRef.current.focus()
                    }}
                />
                <AuthInputBoxSec
                    mainContainer={{
                        width: '100%',
                        marginTop: (windowWidth / 35)
                    }}
                    lableText={'Password'}
                    inputRef={confirmPassRef}
                    onChangeText={(text) =>
                        setState({ confirm: text })
                    }
                    value={classStateData.confirm}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    secureTextEntry={confirmSecurePass}
                    disableImg={true}
                    iconName={confirmSecurePass ? 'eye-off' : 'eye'}
                    iconPressAction={() => {
                        setConfirmSecurepass(!confirmSecurePass)
                    }}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                    }}
                />


            </>
        )
    }

    const ThirdStep = () => {
        return (
            <>
                <DropDownboxSec
                    lableText={classStateData.selectedCountry == null ? 'Select Country' : classStateData.selectedCountry.title}
                    boxPressAction={() => {
                        setDropdown(3)
                        setDropdownTitle('Select Country')
                        setIsDropdown(!isDropdown)

                    }}
                />
                <View style={{ marginTop: (windowWidth / 35), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', alignSelf: 'center' }}>
                    <View
                        style={{
                            width: '22%',
                        }}>
                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                            }}
                            inputFieldStyle={{
                                textAlign: 'center',
                                marginBottom: (mobileW * 4) / 100,
                            }}
                            lableText={LanguageConfiguration.CC_code[Configurations.language]}
                            maxLength={4}
                            editable={false}
                            value={classStateData.selectedCountry && `+${classStateData.selectedCountry.value}`}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                //passwordInput.focus();
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: '76%',
                        }}>
                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                            }}
                            inputRef={numberRef}
                            lableText={LanguageConfiguration.textinputnumber[Configurations.language]}
                            maxLength={9}
                            onChangeText={(text) =>
                                setState({ mobile: text })
                            }
                            value={classStateData.mobile}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />
                        <View
                            style={{
                                marginTop: (mobileW * 0.5) / 100,
                            }}>
                            <Text
                                style={{
                                    textAlign: Configurations.textRotate,
                                    fontSize: Font.textsize,
                                    fontFamily: Font.headingfontfamily,
                                    color: Colors.textgray,
                                }}>
                                {LanguageConfiguration.mobletexttitle[Configurations.language]}
                            </Text>
                        </View>
                    </View>
                </View>

                {
                    classStateData.userType.value != 'lab' &&
                    <>
                        <View style={{
                            width: '100%', height: 48, alignSelf: 'center', marginTop: (windowWidth / 35), flexDirection: 'row',
                            borderColor: Colors.field_border_color, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => { setIsDatePicker(true) }} style={{ width: '100%', flexDirection: 'row' }}>
                                <View style={{ width: '1%' }}>
                                </View>
                                <View style={{ width: '100%', height: Font.placeholder_height, marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{
                                        width: '78%',
                                        textAlign: Configurations.textRotate,
                                        color: Colors.DarkGrey,
                                        fontSize: Font.xlarge,
                                        fontFamily: Font.Regular,
                                    }}>{classStateData.dob.length <= 0 ? LanguageConfiguration.dob[Configurations.language] : classStateData.dob}</Text>
                                    <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                                        <Image source={Icons.DatePicker}
                                            style={{ height: 25, width: 25 }}>
                                        </Image>
                                    </View>
                                </View>


                            </TouchableOpacity>

                        </View>

                        <View
                            style={{
                                width: '100%',
                                marginTop: windowWidth / 15,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <View style={{ width: '23%' }}>
                                <Text
                                    style={{
                                        color: Colors.placeholder_text,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.xlarge,
                                        textAlign: Configurations.textRotate,
                                    }}>
                                    {LanguageConfiguration.Gender[Configurations.language]}
                                </Text>
                            </View>


                            <View
                                style={{
                                    width: '70%',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                }}>
                                <View style={{ width: '30%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>

                                        <TouchableOpacity onPress={() => { setState({ gender: 'Male' }); }}
                                            style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                                flexDirection: 'row',
                                            }}>
                                            <Icon style={{ alignSelf: 'center' }}
                                                name={(classStateData.gender == 'Male') ? "dot-circle-o" : "circle-thin"}
                                                size={22}
                                                color={(classStateData.gender == 'Male') ? '#0168B3' : '#8F98A7'}></Icon>

                                            <View style={{ width: '70%', alignSelf: 'center' }}>
                                                <Text
                                                    style={{
                                                        marginLeft: mobileW * 1.5 / 100,
                                                        textAlign: Configurations.textRotate,
                                                        color: Colors.placeholder_text,
                                                        fontFamily: Font.Regular,
                                                        fontSize: Font.xlarge,
                                                    }}>
                                                    {LanguageConfiguration.male[Configurations.language]}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        width: '33%',
                                        alignSelf: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                                        <TouchableOpacity onPress={() => { setState({ gender: 'Female' }) }}
                                            style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                            <Icon style={{ alignSelf: 'center' }}
                                                name={(classStateData.gender == 'Female') ? "dot-circle-o" : "circle-thin"}
                                                size={22}
                                                color={(classStateData.gender == 'Female') ? '#0168B3' : '#8F98A7'}></Icon>

                                            <Text
                                                style={{
                                                    textAlign: Configurations.textRotate,
                                                    marginLeft: mobileW * 1.5 / 100,
                                                    color: Colors.placeholder_text,
                                                    fontFamily: Font.Regular,
                                                    fontSize: Font.xlarge,
                                                    // alignSelf: 'center',
                                                }}>
                                                {LanguageConfiguration.female[Configurations.language]}
                                            </Text>

                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </>
                }

                <View
                    style={{
                        width: '90%',
                        paddingVertical: windowWidth / 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <Text
                        style={{
                            color: Colors.placeholder_text,
                            fontFamily: Font.Regular,
                            fontSize: Font.xlarge,
                            textAlign: Configurations.textRotate,
                        }}>
                        {'Profile Picture'}
                    </Text>

                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.profilePic}>
                            {
                                classStateData.profileImage ?
                                    <Image source={{ uri: classStateData.profileImage.uri }}
                                        style={{
                                            height: (windowWidth * 30) / 100,
                                            width: (windowWidth * 30) / 100,
                                            borderRadius: (windowWidth * 30) / 100,
                                        }}
                                    />
                                    :
                                    <SvgXml xml={dummyUser} height={(windowWidth * 30) / 100} width={(windowWidth * 30) / 100} />
                            }
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ paddingVertical: (windowWidth * 3) / 100, }}
                            onPress={() => {
                                setState({ imageType: 'profile' });
                                setMediaOptions(true)
                                numberRef && numberRef?.current?.blur()
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.placeholder_text,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.xlarge,
                                    textAlign: Configurations.textRotate,
                                }}>
                                {'Upload'}
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>

            </>
        )
    }

    const FourthStep = () => {
        return (
            <>
                {
                    (classStateData.userType != null && classStateData.userType.value != 'lab') &&
                    <>
                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 20)
                            }}
                            lableText={'Highest Qualification'}
                            inputRef={qualRef}
                            onChangeText={(text) =>
                                setState({ qualification: text })
                            }
                            value={classStateData.qualification}
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: (windowWidth / 50)
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    width: '60%'
                                }}>{classStateData.certificate ? classStateData.certificate.name : 'Upload certificate copy'}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setMediaOptions(true)
                                    setState({ imageType: 'certificate' });
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: (windowWidth / 3.3),
                                    height: (windowWidth / 10),
                                    borderRadius: (windowWidth / 10),
                                    justifyContent: classStateData.certificate ? 'space-between' : 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.buttoncolorblue,
                                    flexDirection: 'row'
                                }}>
                                <Text
                                    style={{
                                        color: Colors.white_color,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.large,
                                        paddingHorizontal: classStateData.certificate ? '12%' : 0,
                                    }} numberOfLines={1}>
                                    {'Upload'}
                                </Text>
                                {
                                    classStateData.certificate &&
                                    <View style={{
                                        width: (windowWidth / 10),
                                        height: (windowWidth / 10),
                                        borderRadius: (windowWidth / 10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.Green

                                    }}>
                                        <Image source={Icons.Tick} style={{
                                            width: (windowWidth / 20),
                                            height: (windowWidth / 20),
                                            tintColor: Colors.white_color
                                        }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>


                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 35)
                            }}
                            lableText={'Years of Experience'}
                            inputRef={expRef}
                            onChangeText={(text) =>
                                setState({ experience: text })
                            }
                            value={classStateData.experience}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 20)
                            }}
                            lableText={'Enter your ID number'}
                            inputRef={idRef}
                            onChangeText={(text) =>
                                setState({ id_number: text })
                            }
                            value={classStateData.id_number}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: (windowWidth / 50)
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    width: '60%'
                                }}>{classStateData.id_image ? classStateData.id_image.name : 'Upload your ID copy'}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setMediaOptions(true)
                                    setState({ imageType: 'id_image' });
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: (windowWidth / 3.3),
                                    height: (windowWidth / 10),
                                    borderRadius: (windowWidth / 10),
                                    justifyContent: classStateData.id_image ? 'space-between' : 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.buttoncolorblue,
                                    flexDirection: 'row'
                                }}>
                                <Text
                                    style={{
                                        color: Colors.white_color,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.large,
                                        paddingHorizontal: classStateData.id_image ? '12%' : 0,
                                    }} numberOfLines={1}>
                                    {'Upload'}
                                </Text>
                                {
                                    classStateData.id_image &&
                                    <View style={{
                                        width: (windowWidth / 10),
                                        height: (windowWidth / 10),
                                        borderRadius: (windowWidth / 10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.Green

                                    }}>
                                        <Image source={Icons.Tick} style={{
                                            width: (windowWidth / 20),
                                            height: (windowWidth / 20),
                                            tintColor: Colors.white_color
                                        }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                    </>

                }





                {
                    (classStateData.userType != null && classStateData.userType.value != 'babysitter' && classStateData.userType.value != 'caregiver' && classStateData.userType.value != 'lab') &&
                    <>
                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 20)
                            }}
                            lableText={'Enter your Health Registration ID'}
                            inputRef={licenseRef}
                            onChangeText={(text) =>
                                setState({ scfhs_number: text })
                            }
                            value={classStateData.scfhs_number}
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: (windowWidth / 50)
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    width: '60%'
                                }}>{classStateData.scfhs_image ? classStateData.scfhs_image.name : 'Upload Health Registration ID'}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setMediaOptions(true)
                                    setState({ imageType: 'scfhs_image' });
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: (windowWidth / 3.3),
                                    height: (windowWidth / 10),
                                    borderRadius: (windowWidth / 10),
                                    justifyContent: classStateData.scfhs_image ? 'space-between' : 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.buttoncolorblue,
                                    flexDirection: 'row'
                                }}>
                                <Text
                                    style={{
                                        color: Colors.white_color,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.large,
                                        paddingHorizontal: classStateData.scfhs_image ? '12%' : 0,
                                    }} numberOfLines={1}>
                                    {'Upload'}
                                </Text>
                                {
                                    classStateData.scfhs_image &&
                                    <View style={{
                                        width: (windowWidth / 10),
                                        height: (windowWidth / 10),
                                        borderRadius: (windowWidth / 10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.Green

                                    }}>
                                        <Image source={Icons.Tick} style={{
                                            width: (windowWidth / 20),
                                            height: (windowWidth / 20),
                                            tintColor: Colors.white_color
                                        }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                    </>
                }


                {
                    (classStateData.userType != null && classStateData.userType.value == 'lab') &&
                    <>
                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 20)
                            }}
                            lableText={'MOH License Number'}
                            maxLength={15}
                            onChangeText={(text) =>
                                setState({ hosp_moh_lic_no: text })
                            }
                            value={classStateData.hosp_moh_lic_no}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: (windowWidth / 50)
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    width: '60%'
                                }}>{classStateData.id_image ? classStateData.id_image.name : 'Upload MOH License'}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setMediaOptions(true)
                                    setState({ imageType: 'id_image' });
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: (windowWidth / 3.3),
                                    height: (windowWidth / 10),
                                    borderRadius: (windowWidth / 10),
                                    justifyContent: classStateData.id_image ? 'space-between' : 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.buttoncolorblue,
                                    flexDirection: 'row'
                                }}>
                                <Text
                                    style={{
                                        color: Colors.white_color,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.large,
                                        paddingHorizontal: classStateData.id_image ? '12%' : 0,
                                    }} numberOfLines={1}>
                                    {'Upload'}
                                </Text>
                                {
                                    classStateData.id_image &&
                                    <View style={{
                                        width: (windowWidth / 10),
                                        height: (windowWidth / 10),
                                        borderRadius: (windowWidth / 10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.Green

                                    }}>
                                        <Image source={Icons.Tick} style={{
                                            width: (windowWidth / 20),
                                            height: (windowWidth / 20),
                                            tintColor: Colors.white_color
                                        }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>

                        <AuthInputBoxSec
                            mainContainer={{
                                width: '100%',
                                marginTop: (windowWidth / 20)
                            }}
                            lableText={'Registration Number'}
                            maxLength={15}
                            onChangeText={(text) =>
                                setState({ hosp_reg_no: text })
                            }
                            value={classStateData.hosp_reg_no}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />

                        <View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: (windowWidth / 50)
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: Colors.DarkGrey,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.medium,
                                    width: '60%'
                                }}>{classStateData.certificate ? classStateData.certificate.name : 'Upload certificate copy'}</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    setMediaOptions(true)
                                    setState({ imageType: 'certificate' });
                                }}
                                activeOpacity={0.7}
                                style={{
                                    width: (windowWidth / 3.3),
                                    height: (windowWidth / 10),
                                    borderRadius: (windowWidth / 10),
                                    justifyContent: classStateData.certificate ? 'space-between' : 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.buttoncolorblue,
                                    flexDirection: 'row'
                                }}>
                                <Text
                                    style={{
                                        color: Colors.white_color,
                                        fontFamily: Font.Regular,
                                        fontSize: Font.large,
                                        paddingHorizontal: classStateData.certificate ? '12%' : 0,
                                    }} numberOfLines={1}>
                                    {'Upload'}
                                </Text>
                                {
                                    classStateData.certificate &&
                                    <View style={{
                                        width: (windowWidth / 10),
                                        height: (windowWidth / 10),
                                        borderRadius: (windowWidth / 10),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: Colors.Green

                                    }}>
                                        <Image source={Icons.Tick} style={{
                                            width: (windowWidth / 20),
                                            height: (windowWidth / 20),
                                            tintColor: Colors.white_color
                                        }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                    </>
                }


            </>
        )
    }

    const FinalStep = () => {
        return (
            <>
                <Text style={styles.finalTextOne}>{'THANK YOU!\n'}</Text>
                <Text style={styles.finalTextTwo}>{'You have successfully finished registering a new account.\n\n\n\n\n\n'}</Text>
                <Text style={styles.finalTextThree}>{`Your request is now under review and you’ll receive an email confirmation once it’s approved`}</Text>
            </>
        )
    }

    const resetState = (payload) => {
        setClassStateData({
            name: '',
            lName: '',
            email: '',
            number: '',
            id: '',
            id_number: '',
            speciality: null,
            qualification: '',
            experience: '',
            scfhs_number: '',
            selectedCountry: null,
            password: '',
            confirm: '',
            mobile: '',
            isLoadingInButton: false,
            imageType: '',
            dob: '',
            gender: '',
            hosp_moh_lic_no: '',
            hosp_reg_no: '',
            profileImage: null,
            id_image: null,
            certificate: null,
            scfhs_image: null,
        })
    }

    const setState = (payload) => {
        setClassStateData(prev => ({ ...prev, ...payload }))
    }

    const onSelction = async (item, index) => {

        dropdown == 1 ?
            (
                setState({ userType: item, speciality: null }),
                await getSpecialities(index).then((data) => {
                    setDropdownList(data)
                }).finally(() => {
                })
            )
            :
            dropdown == 2 ?
                setState({ speciality: item })
                :
                setState({ selectedCountry: item })
    }


    const GalleryOpen = () => {

        Media.launchGellery(true).then((obj) => {
            const pths = obj.path.split('/')
            const source = {
                name: pths[pths.length - 1],
                type: obj.mime,
                uri: obj.path,
            };

            if (classStateData.imageType === 'id_image') {
                setState({ id_image: source });
            } else if (classStateData.imageType === 'certificate') {
                setState({ certificate: source });
            } else if (classStateData.imageType === 'scfhs_image') {
                setState({ scfhs_image: source });
            } else {
                setState({ profileImage: source });
            }
            setMediaOptions(false)
        }).catch((error) => {
            console.log('GalleryOpen..............', error);
        });
    }

    const CamerapOpen = async () => {
        Media.launchCamera(true, true)
            .then((obj) => {
                // console.log('Camerapopen..............', obj);
                const fileName = obj?.path.split('/')
                const source = {
                    name: fileName[fileName.length - 1],
                    type: obj.mime,
                    uri: obj?.path,
                };

                if (classStateData.imageType === 'id_image') {
                    setState({ id_image: source });
                } else if (classStateData.imageType === 'certificate') {
                    setState({ certificate: source });
                } else if (classStateData.imageType === 'scfhs_image') {
                    setState({ scfhs_image: source });
                } else {
                    setState({ profileImage: source });
                }

                setMediaOptions(false)
            }).catch((error) => {
                console.log('Camerapopen..............', error);
            });
    };

    const DocumentOpen = async () => {
        Media.launchDocumentGellery(true).then((res) => {

            const source = {
                name: res.name,
                type: res.type,
                uri: res.uri,
            };

            if (classStateData.imageType === 'id_image') {
                setState({ id_image: source });
            } else if (classStateData.imageType === 'certificate') {
                setState({ certificate: source });
            } else if (classStateData.imageType === 'scfhs_image') {
                setState({ scfhs_image: source });
            } else {
                setState({ profileImage: source });
            }
            setMediaOptions(false)
        })
    }


    const setDate = (res) => {
        let check_month
        let check_date
        let date = res.getDate()
        let month = res.getMonth() + 1
        let year = res.getFullYear()
        if (parseInt(month) < 10) {
            check_month = '0' + month
        }
        else {
            check_month = month
        }
        if (parseInt(date) < 10) {
            check_date = '0' + date
        }
        else {
            check_date = date
        }
        let date1 = year + '-' + check_month + '-' + check_date
        setState({ dob: date1 })
    }

    const checkIsValid = (val) => {

        let conditionsFailed = false;
        var digits = classStateData.id.toString().split('');
        var realDigits = digits.map(Number)

        if (val == 50) {
            if (classStateData.userType == null) {
                MessageFunctions.showError(MessageTexts.emptyUsertype[Configurations.language])
                return false;
            }
            if ((classStateData.userType != null
                && (classStateData.userType.value == 'doctor'
                    ||
                    classStateData.userType.value == 'nurse'
                    ||
                    classStateData.userType.value == 'physiotherapy'
                )) && classStateData.speciality == null) {
                MessageFunctions.showError('Please select your speciality')
                return false;
            } else {
                setProgress(val)

            }
        }
        if (val == 75) {
            if (classStateData.name.length <= 0 || classStateData.name.trim().length <= 0) {
                MessageFunctions.showError(MessageTexts.emptyFirstName[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.lName.length <= 0 || classStateData.lName.trim().length <= 0) {
                MessageFunctions.showError(MessageTexts.emptyLastName[Configurations.language])
                conditionsFailed = true;
                return
            }
            let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (classStateData.email.trim() <= 0) {
                MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (regemail.test(classStateData.email.trim()) !== true) {
                MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.password.length <= 0) {
                MessageFunctions.showError(MessageTexts.validataionnewpass[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.password.length <= 7) {
                MessageFunctions.showError(MessageTexts.emptyPasswordValid[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.confirm.length <= 0) {
                MessageFunctions.showError(MessageTexts.emptyconfirmPassword[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.confirm.length <= 7) {
                MessageFunctions.showError(MessageTexts.emptyPasswordValid[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.confirm != classStateData.password) {
                MessageFunctions.showError(MessageTexts.Password_notmatch[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (conditionsFailed) {
                return false;
            } else {
                setProgress(val)
            }
        }

        if (val == 100) {
            console.log(classStateData.gender);
            if (classStateData.selectedCountry == null) {
                MessageFunctions.showError(MessageTexts.emptyCountrycode[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.mobile.length <= 0 || classStateData.mobile.trim().length <= 0) {
                MessageFunctions.showError(MessageTexts.emptymobileNumber[Configurations.language])
                conditionsFailed = true;
                return
            }
            if (classStateData.selectedCountry.title == 'UAE') {
                if (realDigits[0] == 0 || realDigits[0] == 1 || realDigits[0] == 2 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 8 || realDigits[0] == 9) {
                    MessageFunctions.showError(MessageTexts.validIDnumberUAE[Configurations.language])
                    conditionsFailed = true;
                    return
                }
            } else {
                if (realDigits[0] == 0 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 7 || realDigits[0] == 8 || realDigits[0] == 9) {
                    MessageFunctions.showError(MessageTexts.validIDnumber[Configurations.language])
                    conditionsFailed = true;
                    return
                }
            }
            if (classStateData.userType.value != "lab") {
                if (classStateData.dob.length <= 0 || classStateData.dob.trim().length <= 0) {
                    MessageFunctions.showError("Please choose your date of birth")
                    conditionsFailed = true;
                    return
                }
                if (classStateData.gender.length <= 0 || classStateData.gender.trim().length <= 0) {
                    MessageFunctions.showError("Please choose your gender")
                    conditionsFailed = true;
                    return
                }
            }
            if (classStateData.profileImage == null) {
                MessageFunctions.showError("Please add a professional photo")
                conditionsFailed = true;
                return
            }

            if (conditionsFailed) {
                return false;
            } else {
                setProgress(val)
            }
        }

        if (val == 125) {
            if (classStateData.userType.value == "lab") {
                if (classStateData.hosp_moh_lic_no.length <= 0 || classStateData.hosp_moh_lic_no.trim().length <= 0) {
                    MessageFunctions.showError("Please enter MOH license number")
                    conditionsFailed = true;
                    return
                }
                if ((classStateData.hosp_moh_lic_no.length < 10 || classStateData.hosp_moh_lic_no.trim().length < 10)) {
                    MessageFunctions.showError("Please enter  MOH license number between 10 to 15 digits")
                    conditionsFailed = true;
                    return
                }
                if ((classStateData.hosp_moh_lic_no.length > 15 || classStateData.hosp_moh_lic_no.trim().length > 15)) {
                    MessageFunctions.showError("Please enter health registration ID between 10 to 15 digits")
                    conditionsFailed = true;
                    return
                }

                if (classStateData.id_image == null) {
                    MessageFunctions.showError("Please upload MOH license")
                    conditionsFailed = true;
                    return
                }

                if (classStateData.hosp_reg_no.length <= 0 || classStateData.hosp_reg_no.trim().length <= 0) {
                    MessageFunctions.showError("Please enter company registration certificate number")
                    conditionsFailed = true;
                    return
                }
                if ((classStateData.hosp_reg_no.length < 8 || classStateData.hosp_reg_no.trim().length < 8)) {
                    MessageFunctions.showError("Please enter minimum 8 or 11 digits company registration certificate number")
                    conditionsFailed = true;
                    return
                }

                if (classStateData.hosp_reg_no.length > 11 || classStateData.hosp_reg_no.trim().length > 11) {
                    MessageFunctions.showError("Please enter minimum 8 or 11 digits company registration certificate number")
                    conditionsFailed = true;
                    return
                }

                if (classStateData.certificate == null) {
                    MessageFunctions.showError("Please upload company registration certificate")
                    conditionsFailed = true;
                    return
                }

            } else {
                if (classStateData.qualification.length <= 0 || classStateData.qualification.trim().length <= 0) {
                    MessageFunctions.showError("Please enter your qualification")
                    conditionsFailed = true;
                    return
                }
                if (classStateData.certificate == null) {
                    MessageFunctions.showError("Please upload cerificate image")
                    conditionsFailed = true;
                    return
                }
                if (classStateData.experience.length <= 0 || classStateData.experience.trim().length <= 0) {
                    MessageFunctions.showError("Please enter your years of experience")
                    conditionsFailed = true;
                    return
                }
                if ((classStateData.id_number.length < 10 || classStateData.id_number.trim().length < 10)) {
                    MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
                    conditionsFailed = true;
                    return
                }

                if ((classStateData.id_number.length > 15 || classStateData.id_number.trim().length > 15)) {
                    MessageFunctions.showError("Please enter ID Number between 10 to 15 digits")
                    conditionsFailed = true;
                    return
                }
                if (classStateData.id_image == null) {
                    MessageFunctions.showError("Please upload ID image")
                    conditionsFailed = true;
                    return
                }
                if ((classStateData.userType.value != 'babysitter' && classStateData.userType.value != 'caregiver' && classStateData.userType.value != 'lab')) {
                    if ((classStateData.scfhs_number.length < 8 || classStateData.scfhs_number.trim().length < 8)) {
                        MessageFunctions.showError("Please enter minimum 8 or 11 digits Health Registration ID")
                        conditionsFailed = true;
                        return
                    }

                    if (classStateData.scfhs_number.length > 11 || classStateData.scfhs_number.trim().length > 11) {
                        MessageFunctions.showError("Please enter minimum 8 or 11 digits Health Registration ID")
                        conditionsFailed = true;
                        return
                    }
                    if (classStateData.scfhs_image == null) {
                        MessageFunctions.showError("Please upload Health Registration Certificate")
                        conditionsFailed = true;
                        return
                    }
                }
            }
            if (conditionsFailed) {
                return false;
            } else {
                onSignup()
            }
        }

        return true
    }

    const onSignup = async () => {
        Keyboard.dismiss()
        const isValid = checkIsValid()

        if (isValid) {

            setState({
                isLoadingInButton: true
            })

            const localFCM = await FBPushNotifications.getFcmToken()

            let url = Configurations.baseURL + "api-service-provider-registration";
            var phone_number_send = classStateData.selectedCountry.value + classStateData.mobile
            var data = new FormData();

            data.append('service_type', classStateData.userType.value)
            data.append('name', `${classStateData.name} ${classStateData.lName}`)
            data.append('email', classStateData.email.trim())
            data.append('mobile_number', phone_number_send)
            data.append('work_area', classStateData.selectedCountry.name)
            data.append('dob', classStateData.dob)
            data.append('gender', classStateData.gender)
            data.append('password', classStateData.password)
            data.append('confirm_password', classStateData.confirm)
            data.append('device_type', Configurations.device_type)
            data.append('device_lang', 'ENG')
            data.append('fcm_token', localFCM)
            data.append('profileImg', classStateData.profileImage)
            data.append('id_number', classStateData.id_number)
            data.append('speciality', classStateData.speciality ? classStateData.speciality.value : '')
            data.append('qualification', classStateData.qualification)
            data.append('experience', classStateData.experience)
            data.append('scfhs_number', classStateData.scfhs_number)
            data.append('hosp_moh_lic_no', classStateData.hosp_moh_lic_no)
            data.append('hosp_reg_no', classStateData.hosp_reg_no)

            if (classStateData.id_image != null) {

                data.append('id_image', classStateData.id_image)
            }
            if (classStateData.certificate != null) {

                data.append('certificate', classStateData.certificate)
            }
            if (classStateData.userType.value == 'doctor' || classStateData.userType.value == 'nurse' || classStateData.userType.value == 'physiotherapy') {
                if (classStateData.scfhs_image != null) {

                    data.append('scfhs_image', classStateData.scfhs_image)
                }
            }
            else {
                data.append('scfhs_image', "")
            }

            // console.log({ data: data._parts });
            // return
            API.post(url, data, 1).then((obj) => {

                console.log('Signup Response', obj.message)
                if (obj.status == true) {

                    setTimeout(() => {
                        setIsRegistered(true)
                    }, 500);
                    setTimeout(() => {
                        navigation.pop()
                    }, 5000);

                } else {
                    setTimeout(() => {
                        MessageFunctions.showError(obj.message)
                    }, 200)
                    return false;
                }
            }).catch((error) => {
                console.log("Signup-error ------- ", error)
            }).finally(() => {
                setState({
                    isLoadingInButton: false
                })
            })

        } else return isValid
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white_color, paddingTop: insets.top, paddingBottom: (insets.bottom) }}>

            <KeyboardAwareScrollView
                // keyboardOpeningTime={200}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    paddingBottom: windowWidth / 3,

                }}
                showsVerticalScrollIndicator={false}>


                {/* <View style={{ height: windowHeight}}> */}




                <View
                    style={{
                        width: "100%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image
                            style={{
                                width: (mobileW * 40) / 100,
                                height: (mobileW * 40) / 100,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                            source={Icons.LogoWithText} />
                    </View>

                    {
                        !isRegistered &&
                        <TouchableHighlight
                            underlayColor={Colors.Highlight}
                            onPress={() => {
                                if (progress != 0) {
                                    setProgress(pre => pre - 25)
                                } else {
                                    navigation.pop()
                                }
                            }}
                            style={{ position: 'absolute', left: 0, height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
                        >
                            <SvgXml xml={
                                Configurations.textalign == "right"
                                    ? rightArrow : leftArrow
                            } height={vs(17.11)} width={s(9.72)} fill={'red'} fillOpacity={1} />

                        </TouchableHighlight>
                    }
                </View>


                <View style={{
                    width: '90%',
                    alignSelf: 'center'
                }}>
                    {
                        !isRegistered &&
                        (
                            progress == 0 ?
                                <View>
                                    <Text
                                        style={{
                                            textAlign: Configurations.textRotate,
                                            fontSize: Font.xxxlarge,
                                            fontFamily: Font.Regular,
                                            color: Colors.Black,
                                        }}>
                                        {LanguageConfiguration.Signuptext1[Configurations.language]}
                                    </Text>
                                </View>
                                :
                                <View>
                                    {
                                        (progress == 25 || progress == 50) &&
                                        <Text
                                            style={{
                                                fontSize: Font.headingblack,
                                                fontFamily: Font.blackheadingfontfamily,
                                                textAlign: Configurations.textRotate,
                                                color: Colors.Black,
                                            }}>
                                            {LanguageConfiguration.Signup[Configurations.language]}
                                        </Text>
                                    }
                                    <Text
                                        style={{
                                            textAlign: Configurations.textRotate,
                                            fontSize: progress == 100 ? Font.xxlarge : Font.large,
                                            fontFamily: Font.Regular,
                                            color: Colors.Black,
                                            marginTop: (windowWidth / 60),
                                        }}>
                                        {progress == 75 ? LanguageConfiguration.serviceLocation[Configurations.language] : progress == 100 ? LanguageConfiguration.FinishSignup[Configurations.language] : LanguageConfiguration.Signuptext5[Configurations.language]}
                                    </Text>
                                </View>
                        )
                    }




                    {
                        progress == 0 ?

                            <View style={{ marginTop: (windowWidth / 12) }}>
                                {
                                    DocTypes.map((item, index) => {
                                        return (
                                            <RenderDocTypes key={index} item={item} index={index} />
                                        )
                                    })
                                }
                            </View>
                            :

                            progress == 25 ?
                                <View style={{ marginTop: (windowWidth / 12) }}>
                                    {FirstStep()}
                                </View>
                                :
                                progress == 50 ?
                                    <View style={{ marginTop: (windowWidth / 12) }}>
                                        {SecondStep()}
                                    </View>
                                    :
                                    progress == 75 ?
                                        <View style={{ marginTop: 0 }}>
                                            {ThirdStep()}
                                        </View>
                                        :
                                        (progress == 100 && !isRegistered) ?
                                            <View style={{ marginTop: 0 }}>
                                                {FourthStep()}
                                            </View>
                                            :
                                            (isRegistered) ?
                                                <View style={{ marginTop: 0 }}>
                                                    {FinalStep()}
                                                </View>
                                                :
                                                null
                    }


                </View>

                {/* </View> */}


            </KeyboardAwareScrollView>

            <DateTimePicker
                dateFormat={"YYYY-MM-DD"}
                isVisible={isDatePicker}
                mode="date"
                maximumDate={new Date()}
                onConfirm={(date) => {
                    setDate(date)
                    setIsDatePicker(false)
                }}
                onCancel={() => { setIsDatePicker(false) }}
            />

            <ListBottomSheet
                visible={isDropdown}
                onRequestClose={() => setIsDropdown(false)}
                data={dropdownList}
                title={dropdownTitle}
                selection={(item, index) => {
                    onSelction(item, index)
                }}
            />

            <MediaOptions
                visible={mediaOptions}
                onRequestClose={() => {
                    setMediaOptions(false)
                }}
                selectedOption={(val) => {
                    if (val == '1') {
                        DocumentOpen()
                    } else if (val == '2') {
                        CamerapOpen()
                    } else {
                        GalleryOpen()
                    }
                }}
            />

            <RegistrationSteps
                onNext={(val) => {
                    if (val == 25) {
                        setProgress(val)
                    } else {
                        checkIsValid(val)
                    }
                }}
                progressValue={0.8}
                loading={classStateData.isLoadingInButton}
                completed={isRegistered}
            />

        </View>
    );
}

