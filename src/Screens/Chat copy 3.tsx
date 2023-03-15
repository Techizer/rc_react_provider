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
import { Attachment, Send } from '../Assets/Icons/SvgIcons/Index'
import { Icons } from '../Assets/Icons/IReferences'
import { API } from '../Helpers/API'
import { Media } from '../Helpers/MediaProvider'
import { MessageFunctions } from '../Helpers/Message'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications'
import MediaOptions from '../Components/MediaOptions'

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
    const isNextChatEnabled = getIsAppointmentChatEnabled(appointment?.date, appointment?.acceptance_status)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [mediaOptions, setMediaOptions] = useState(false);
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        firestore()
            .collection(`Chats-${Configurations.mode}`)
            .doc(appointment?.order)
            .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    const room = new MessageRoom({
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
                        .set(room)
                        .then(() => {
                            console.log('posted');
                        })
                } else {
                    const roomDetails = documentSnapshot.data()
                    // console.log({ roomDetails });
                    roomDetails?.MessageRoomDetails?.Messages?.reverse()
                    setRoom(roomDetails)
                }
            })
    }, [])

    useEffect(() => {
        messageInputRef.current.focus()
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
                console.log('Galleryopen-error', error);
            });
    };

    const Camerapopen = async () => {
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
        let oldMsgs = room?.MessageRoomDetails.Messages
        try {
            const res = await DocumentPicker.pick({
                type: [
                    //   DocumentPicker.types.pdf,
                    //   DocumentPicker.types.docx,
                    //   DocumentPicker.types.doc,
                    //   DocumentPicker.types.ppt,
                    //   DocumentPicker.types.xls,
                    //   DocumentPicker.types.audio,
                    // DocumentPicker.types.images,
                    DocumentPicker.types.allFiles,
                    //   DocumentPicker.types.plainText,
                    //   DocumentPicker.types.video,
                ],
            });
            console.log('Document Pick Response', res);
            const source = {
                name: res[0].name,
                type: res[0].type,
                uri: res[0].uri,
            };
            setMediaOptions(false)
            const newMessage = new Message({
                Body: messageInput,
                DateTime: new Date(),
                DocPaths: docs,
                ImagePaths: [res[0].uri],
                Milliseconds: moment().valueOf(),
                NumChars: messageInput.length,
                ReadBit: 1,
                ReceiverID: patient?.id,
                SenderID: loginUserData?.user_id,
                Shown: true,
                SYSTEM: false
            })
            // oldMsgs=oldMsgs?.push(newMessage)
            // oldMsgs=oldMsgs?.reverse()
            setRoom(r => {
                r?.MessageRoomDetails.Messages.unshift(newMessage)
                return r
            })
            UploadFile(new Array(source), newMessage)

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('You did not select any file')
            } else {
                console.log('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const UploadFile = async (arr: any, msg: Message) => {
        let url = Configurations.baseURL + "api-chat-image";
        var data = new FormData();
        for (var i = 0; i < arr.length; i++) {
            data.append("chat_image[]", arr[i]);
        }

        API.post(url, data, 1)
            .then((obj) => {
                if (obj.status == true) {
                    console.log("UploadFile-res...", obj);
                    onSendMessage(obj?.result, msg)
                } else {
                    MessageFunctions.showError(obj.message);
                    return false;
                }
            }).catch((error) => {
                console.log("UploadFile-error ------- " + error);
            })
    };

    const onSendMessage = async (imgs = [], msg: Message) => {

        console.log({ length: imgs.length });

        if (imgs.length == 0) {

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

                await firestore().collection(`Chats-${Configurations.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(newMessage) }).finally(() => {
                    setIsAutoResendable(true)
                })
            }
        } else {
            console.log({ msg });
            if (msg) {
                msg.MessageDetails.ImagePaths = imgs
                await firestore().collection(`Chats-${Configurations.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(msg) }).finally(() => {
                    setIsAutoResendable(true)
                })
            }

        }

    }

    const renderMessageItem = ({ item, index }) => {
        const messageItem = new Message(item?.MessageDetails)
        const { MessageDetails, isSentByMe } = messageItem
        const { Body, SYSTEM, ImagePaths } = MessageDetails
        const isMine = isSentByMe(loginUserData?.user_id)

        var str = moment(MessageDetails.Milliseconds).format('hh:mm A, DD MMM YY')

        return (

            <View style={{
                width: '100%',
                alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                justifyContent: 'center',
                zIndex: 5,
            }}>
                <View style={{
                    width: SYSTEM ? '86%' : '92%',
                    alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: SYSTEM ? '#FFF2D9' : (isMine && ImagePaths?.length > 0) ? 'transparent' : isMine ? '#0168B3' : '#FFFFFF',
                        padding: ImagePaths?.length > 0 ? 0 : 8,
                        borderRadius: 8,
                    }}>

                        {
                            ImagePaths?.length > 0 ?
                                <View
                                    style={[styles.msgImg, { alignSelf: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start', }]}>
                                    <Image source={{ uri: ImagePaths[0] }}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            borderRadius: (windowWidth * 3) / 100,
                                        }}
                                        resizeMode='cover'
                                    />
                                </View>
                                :
                                <Text style={{
                                    textAlign: SYSTEM ? 'left' : 'left',
                                    color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                    fontFamily: Font.Regular,
                                    fontSize: SYSTEM ? Font.small : Font.medium
                                }}>
                                    {Body}
                                </Text>
                        }
                    </View>

                    {!SYSTEM &&
                        <Text style={{
                            textAlign: isMine ? 'right' : 'left',
                            color: '#8F98A7',
                            fontFamily: Font.Regular,
                            fontSize: Font.xsmall,
                            width: '100%',
                            marginTop: vs(3),


                        }}>
                            {str}
                        </Text>
                    }

                </View>

            </View>

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
                                }} allowFontScaling={false} >{`Consultation ID: ${appointment?.order}`}</Text>

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
                    />
                </View>

                <View style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    backgroundColor: Colors.White,
                    paddingBottom: (Platform.OS == 'ios') ? insets.bottom - 10 : 9,
                    paddingVertical: vs(9),
                    paddingHorizontal: s(13),

                }}>
                    <View style={{
                        width: '87%',
                        flexDirection: 'row',
                        borderRadius: vs(25),
                        backgroundColor: Colors.backgroundcolor,
                        paddingHorizontal: vs(12),
                        paddingVertical: Platform.OS == 'ios' ? vs(10) : 0,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // height:40,
                        maxHeight: 200,
                    }}>
                        <View style={{
                            width: '85%',
                            justifyContent: 'center',
                        }}>
                            <TextInput
                                placeholder='Write your message here..'
                                placeholderTextColor={'#515C6F'}
                                style={{ width: '100%', color: Colors.Black, fontSize: Font.small }}
                                multiline
                                value={messageInput}
                                returnKeyType='next'
                                onChangeText={setMessageInput}
                                ref={messageInputRef}
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
                                    width: (windowWidth * 5) / 100,
                                    height: (windowWidth * 5) / 100,
                                    borderRadius: (windowWidth * 20) / 100,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <SvgXml xml={Attachment} width={(windowWidth * 4.5) / 100} height={(windowWidth * 4.5) / 100} />
                                {/* <Image
                                    resizeMode="contain"
                                    source={Icons.Attachment}
                                    style={{
                                        width: (windowWidth * 4.5) / 100,
                                        height: (windowWidth * 4.5) / 100,
                                    }}
                                /> */}
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{
                        justifyContent: 'center',
                        width: '12%',
                        alignItems: 'center',

                    }}>
                        <Pressable style={{
                            backgroundColor: Colors.Theme,
                            height: windowWidth * 0.09,
                            width: '80%',
                            borderRadius: windowWidth * 0.1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                            disabled={messageInput.trim().length <= 0}
                            onPress={() => {
                                onSendMessage([], null)
                            }}>

                            {
                                messageInput.trim().length <= 0 ?
                                    <Image
                                        resizeMode="contain"
                                        source={Icons.Mic}
                                        style={{
                                            width: (windowWidth * 6) / 100,
                                            height: (windowWidth * 6) / 100,
                                            tintColor: Colors.White,
                                        }}
                                    />
                                    :
                                    <SvgXml xml={Send} />
                            }
                        </Pressable>


                    </View>



                </View>

            </KeyboardAvoidingView>

            <MediaOptions
                visible={mediaOptions}
                onRequestClose={() => {
                    setMediaOptions(false)
                }}
                selectedOption={(val: string) => {
                    // selectFile()
                    if (val == '2') {
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

    }
})
export default Chat