import { View, Text, FlatList, Dimensions, StatusBar, Platform, Image, TextInput, KeyboardAvoidingView, Pressable, StyleSheet, Keyboard, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import { getIsAppointmentChatEnabled } from '../Helpers/AppFunctions'
import ScreenHeader from '../Components/ScreenHeader'
import firestore from '@react-native-firebase/firestore'
import { Configurations } from '../Provider/configProvider'
import { Message, MessageRoom } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { vs, s } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { SvgXml } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Attachment, Send, _Cross } from '../Assets/Icons/SvgIcons/Index'
import { Icons } from '../Assets/Icons/IReferences'
import { API } from '../Helpers/API'
import { Media } from '../Helpers/MediaProvider'
import { MessageFunctions } from '../Helpers/Message'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications'
import MediaOptions from '../Components/MediaOptions'
import ChatMessage from '../Components/ChatMessage'
import Button from '../Components/Button'


const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60



const Chat = ({ navigation, route }) => {
    const [room, setRoom] = useState<MessageRoom>()
    const [isAutoResendable, setIsAutoResendable] = useState<Boolean>(true)
    const [messageInput, setMessageInput] = useState<string>('')
    const insets = useSafeAreaInsets()
    const messageInputRef = useRef()

    const { chatOptions } = route?.params

    const {
        loginUserData,
        fcmDeviceToken
    } = useSelector(({ Auth }) => Auth)

    const { provider, patient, appointment } = chatOptions
    !chatOptions ? (() => { navigation.canGoBack() && navigation.goBack(); return (<></>) })() : true
    const isProvider = true
    const isNextChatEnabled = getIsAppointmentChatEnabled(appointment?.bookingDate, appointment?.acceptance_status)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [mediaOptions, setMediaOptions] = useState(false);
    const [docs, setDocs] = useState([]);

    const [attachment, setAttachment] = useState([])
    const [type, setType] = useState('')
    const [isExpired, setIsExpired] = useState(false)

    console.log('Main DateTime', moment(appointment?.bookingDate));
    

    useEffect(() => {
        firestore()
            .collection(`Chats-${Configurations.mode}`)
            .doc(appointment?.order)
            .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    const thisRoom = new MessageRoom({
                        ID: appointment?.order,
                        AppointmentID: appointment?.id,
                        Created: new Date(),
                        Expired: isNextChatEnabled,
                        LastOpened: new Date(),
                        Patient: {
                            ID: patient?.id,
                            Image: patient?.image,
                            IsTyping: false,
                            FCM: ''
                        },
                        Provider: {
                            ID: provider?.id,
                            Image: provider?.image,
                            IsTyping: false,
                            FCM: fcmDeviceToken,
                            UserType: 'Doctor'
                        },
                        Messages: []
                    })
                    // console.log(room.MessageRoomDetails);
                    firestore()
                        .collection(`Chats-${Configurations.mode}`)
                        .doc(appointment?.order)
                        .set(thisRoom)
                        .then(() => {
                            console.log('posted');
                        })
                } else {
                    const roomDetails = documentSnapshot?.data()
                    // console.log({ roomDetails });
                    roomDetails?.MessageRoomDetails?.Messages?.reverse()
                    console.log('Room', room?.MessageRoomDetails.Messages);
                    
                    setRoom(roomDetails)
                }
            })
    }, [])

    useEffect(() => {
        messageInputRef?.current?.focus()
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardVisible(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [])

    const Galleryopen = () => {
        let tempArr = []
        Media
            .launchGellery(true)
            .then((obj) => {
                // console.log('Galleryopen..............', obj);
                const fileName = obj?.path.split('/')
                const source = {
                    name: Platform.OS == 'ios' ? obj.filename : fileName[fileName.length - 1],
                    type: obj.mime,
                    uri: obj?.path,
                };
                tempArr.push(source)
                setAttachment(tempArr)
                setType('image')
                setMediaOptions(false)
            })
            .catch((error) => {
                console.log('Galleryopen-error', error);
            });

    };

    const Camerapopen = async () => {


        let tempArr = []
        Media
            .launchCamera(true)
            .then((obj) => {
                const fileName = obj?.path.split('/')
                const source = {
                    name: fileName[fileName.length - 1],
                    type: obj.mime,
                    uri: obj?.path,
                };
                tempArr.push(source)
                setAttachment(tempArr)
                setType('image')
                setMediaOptions(false)
            }).catch((error) => {
                console.log('Camerapopen..............', error);
            });


        Media
            .launchCamera(true)
            .then((obj) => {
                // console.log('Camerapopen..............', obj);
                const fileName = obj?.path.split('/')
                const source = {
                    name: fileName[fileName.length - 1],
                    type: obj.mime,
                    uri: obj?.path,
                };
                setMediaOptions(false)
                const newMessage = new Message({
                    Body: messageInput,
                    DateTime: new Date(),
                    DocPaths: docs,
                    ImagePaths: [obj?.path],
                    Milliseconds: moment().valueOf(),
                    NumChars: messageInput.length,
                    ReadBit: 1,
                    ReceiverID: patient?.id,
                    SenderID: loginUserData?.user_id,
                    Shown: true,
                    SYSTEM: false
                })
                setRoom(r => {
                    r?.MessageRoomDetails.Messages.unshift(newMessage)
                    return r
                })
                UploadFile(new Array(source), newMessage)
            })
            .catch((error) => {
                console.log('Camerapopen..............', error);
            });
    };

    const selectFile = async () => {
        let tempArr = []
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                ],
            });
            console.log('Document Pick Response', res);
            const source = {
                name: res[0].name,
                type: res[0].type,
                uri: res[0].uri,
            };
            tempArr.push(source)
            setAttachment(tempArr)
            setType('pdf')
            setMediaOptions(false)

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('You did not select any file')
            } else {
                console.log('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const UploadFile = async (msg: Message) => {
        let url = Configurations.baseURL + "api-chat-image";
        var data = new FormData();
        for (var i = 0; i < attachment.length; i++) {
            data.append("chat_image[]", attachment[i]);
        }

        API.post(url, data, 1)
            .then(async (obj) => {
                if (obj.status == true) {
                    console.log("UploadFile-res...", obj);
                    if (type === 'image') {
                        msg.MessageDetails.ImagePaths = obj.result
                    } else {
                        msg.MessageDetails.DocPaths = obj.result
                    }
                    await firestore().collection(`Chats-${Configurations.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(msg) }).finally(() => {
                        setIsAutoResendable(true)
                    })

                } else {
                    MessageFunctions.showError(obj.message);
                    return false;
                }
            }).catch((error) => {
                console.log("UploadFile-error ------- " + error);
            })
    };

    const onSendMessage = async () => {

        if (attachment.length == 0) {
            if (isAutoResendable) {
                setIsAutoResendable(false)

                const newMessage = new Message({
                    Body: messageInput,
                    DateTime: new Date(),
                    DocPaths: [],
                    ImagePaths: [],
                    Milliseconds: moment().valueOf(),
                    NumChars: messageInput.length,
                    ReadBit: 1,
                    ReceiverID: patient?.id,
                    SenderID: loginUserData?.user_id,
                    Shown: true,
                    SYSTEM: false
                })
                setRoom(r => {
                    r?.MessageRoomDetails.Messages.unshift(newMessage)
                    return r
                })
                setMessageInput('')
                await firestore()
                    .collection(`Chats-${Configurations.mode}`)
                    .doc(appointment?.order)
                    .update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(newMessage) })
                    .finally(() => {
                        setIsAutoResendable(true)
                    })
            }
        } else {
            const newMessage = new Message({
                Body: messageInput,
                DateTime: new Date(),
                DocPaths: type === 'pdf' ? [attachment[0].uri] : [],
                ImagePaths: type === 'image' ? [attachment[0].uri] : [],
                Milliseconds: moment().valueOf(),
                NumChars: messageInput.length,
                ReadBit: 1,
                ReceiverID: patient?.id,
                SenderID: loginUserData?.user_id,
                Shown: true,
                SYSTEM: false
            })
            setAttachment([])
            setRoom(r => {
                r?.MessageRoomDetails.Messages.unshift(newMessage)
                return r
            })
            setMessageInput('')
            UploadFile(newMessage)


        }
    }

    const renderMessageItem = ({ item, index }) => {
        return (
            <ChatMessage
                Item={item}
            />
        )
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.backgroundcolor,
            }}>
            <ScreenHeader
                navigation={navigation}
                leftIcon
                onBackPress={() => { navigation.goBack() }}
                renderHeaderWOBack={() => {
                    return (
                        <View style={{
                            flex: 1,
                            height: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingRight: '1%'
                        }}>

                            <View style={{ width: windowWidth / 7, marginLeft: '0.5%' }}>
                                <Image style={{
                                    width: windowWidth / 10,
                                    height: windowWidth / 10,
                                    borderRadius: windowWidth / 10,
                                }}
                                    resizeMethod='scale'
                                    resizeMode='contain'
                                    source={{ uri: patient?.image }} />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <Text style={{
                                    color: Colors.Black,
                                    fontFamily: Font.SemiBold,
                                    fontSize: Font.medium
                                }} allowFontScaling={false} >{patient?.name}</Text>

                                <Text style={{
                                    color: '#8F98A7',
                                    fontFamily: Font.Medium,
                                    fontSize: Font.xsmall
                                }} allowFontScaling={false}>{`Consultation ID: ${appointment?.order}`}</Text>

                            </View>

                        </View>
                    )
                }}
                style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }}
            />

            <KeyboardAvoidingView
                style={styles.mainContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? vs(28) : 0}
            >
                <View style={styles.content}>
                    <FlatList
                        style={{ flex: 1, zIndex: 2 }}
                        contentContainerStyle={{ paddingHorizontal: '2%', zIndex: 3, paddingBottom: vs(28), paddingTop: vs(32) }}
                        data={room?.MessageRoomDetails?.Messages}
                        keyExtractor={(i, _i) => 'message' + _i}
                        inverted={true}
                        renderItem={renderMessageItem}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => (<View style={{ marginVertical: vs(6) }} />)}
                    // ListEmptyComponent={() => (<Text style={{ width: '100%', alignSelf: 'center', textAlign: 'center' }} >No Messages</Text>)}
                    />
                </View>

                <View style={{
                    width: '100%',
                    backgroundColor: Colors.White,
                    paddingBottom: (Platform.OS == 'ios') ? insets.bottom - (windowWidth * 3) / 100 : vs(9),
                    paddingVertical: vs(9),
                    paddingHorizontal: s(13),
                }}>

                    {
                        isExpired ?
                            <Button
                                text={'Chat is closed'}
                                btnStyle={{ backgroundColor: '#FFA800' }}
                                isDisabled={true}
                            />
                            :
                            <View
                                style={{
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{
                                    width: '88%',
                                }}>
                                    {
                                        attachment.length > 0 &&
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: Colors.Border,
                                            paddingBottom: vs(4),
                                            marginBottom: vs(4),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            // height: 50,
                                            // paddingVertical: vs(10),
                                            // backgroundColor:'#d6d6d6'
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-end',
                                            }}>
                                                {
                                                    type === 'image' ?
                                                        <Image
                                                            source={{ uri: attachment[0].uri }}
                                                            style={{ height: 50, width: 50, borderRadius: (windowWidth * 2) / 100, }}
                                                        />
                                                        :
                                                        <Image
                                                            source={Icons.Pdf}
                                                            style={{ height: 50, width: 50, borderRadius: (windowWidth * 2) / 100, }}
                                                        />
                                                }
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontSize: Font.small,
                                                        fontFamily: Font.Regular,
                                                        color: Colors.DarkGrey,
                                                        paddingHorizontal: s(5),
                                                        width: '75%',
                                                    }}
                                                >
                                                    {attachment[0].name}
                                                </Text>
                                            </View>
                                            <TouchableHighlight
                                                onPress={() => {
                                                    setAttachment([])
                                                }}
                                                underlayColor={Colors.Highlight}
                                                style={styles.closeContainer}>
                                                <SvgXml xml={_Cross} height={vs(20)} width={s(20)} />
                                            </TouchableHighlight>

                                        </View>
                                    }
                                    {/* --------------------------------- */}
                                    <View style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        borderRadius: Platform.OS === 'ios' ? vs(15) : vs(20),
                                        backgroundColor: Colors.backgroundcolor,
                                        paddingHorizontal: vs(12),
                                        paddingVertical: Platform.OS == 'ios' ? vs(7) : 0,
                                        justifyContent: 'space-between',
                                        maxHeight: (windowWidth * 35) / 100,
                                    }}>
                                        <View style={{
                                            width: '88%',
                                            justifyContent: 'center',
                                        }}>
                                            <TextInput
                                                placeholder='Write your message here..'
                                                placeholderTextColor={'#515C6F'}
                                                style={{ width: '100%', color: Colors.Black, fontSize: Font.small }}
                                                multiline
                                                value={messageInput}
                                                returnKeyType='next'
                                                ref={messageInputRef}
                                                onChangeText={setMessageInput}
                                            />
                                        </View>

                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                Keyboard.dismiss()
                                                setTimeout(() => {
                                                    setMediaOptions(true)
                                                }, 350);
                                            }}
                                            style={{
                                                width: '10%',
                                                paddingVertical: Platform.OS == 'ios' ? 0 : vs(10),
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-end',
                                                // alignSelf: 'flex-end',
                                            }}>
                                            <View
                                                style={{
                                                    width: (windowWidth * 4.9) / 100,
                                                    height: (windowWidth * 4.9) / 100,
                                                    borderRadius: (windowWidth * 20) / 100,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <SvgXml xml={Attachment} width={(windowWidth * 4.5) / 100} height={(windowWidth * 4.5) / 100} />
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={{
                                    justifyContent: 'flex-end',
                                    width: '12%',
                                    alignItems: 'flex-end',
                                    // alignSelf: 'flex-end',
                                    // paddingBottom:(windowWidth*1)/100,

                                }}>
                                    <Pressable style={{
                                        backgroundColor: Colors.Theme,
                                        height: windowWidth * 0.09,
                                        marginBottom: Platform.OS === 'ios' ? vs(0.5) : vs(4),
                                        width: '80%',
                                        borderRadius: windowWidth * 0.1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                        disabled={
                                            (messageInput.trim().length <= 0 && attachment.length == 0) ?
                                                true
                                                :
                                                (messageInput.trim().length <= 0 && attachment.length > 0) ? false
                                                    :
                                                    (messageInput.trim().length > 0 || attachment.length > 0) ? false
                                                        :
                                                        false
                                        }
                                        onPress={() => {
                                            onSendMessage()
                                        }}>

                                        <SvgXml xml={Send} />
                                    </Pressable>


                                </View>

                            </View>
                    }


                </View>

            </KeyboardAvoidingView>

            <MediaOptions
                visible={mediaOptions}
                onRequestClose={() => {
                    setMediaOptions(false)
                }}
                selectedOption={(val: string) => {
                    if (val == '1') {
                        selectFile()
                    } else if (val == '2') {
                        Camerapopen()
                    } else {
                        Galleryopen()
                    }
                }}
            />


        </View>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.backgroundcolor,
    },
    content: {
        flex: 1,
        paddingHorizontal: s(2)
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: Platform.select({ ios: 0, android: 10 }), // adjust the value according to your needs
    },
    input: {
        flex: 1,
        height: 40,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    flatListView: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        alignSelf: "center",
        paddingTop: 5,
        paddingBottom: 70
    },
    msgImg: {
        height: (windowWidth * 40) / 100,
        width: (windowWidth * 40) / 100,

    },
    closeContainer: {
        height: s(20),
        width: s(20),
        borderRadius: s(20),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.DarkGrey,
        zIndex: 999
    },
})
export default Chat