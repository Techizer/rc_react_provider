import { View, Text, FlatList, Dimensions, StatusBar, Platform, Image, TextInput, KeyboardAvoidingView, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getIsAppointmentChatEnabled } from '../Helpers/AppFunctions'
import ScreenHeader from '../Components/ScreenHeader'
import firestore from '@react-native-firebase/firestore'
import { Configurations } from '../Provider/configProvider'
import { Message, MessageRoom } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { s, vs } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icons } from '../Assets/Icons/IReferences'
import { SvgXml } from 'react-native-svg'
import { Send } from '../Assets/Icons/SvgIcons/Index'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
    const messageInputRef = useRef()

    const insets = useSafeAreaInsets()

    const { chatOptions } = route?.params
    const { loginUserData } = useSelector(state => state.Auth)
    const { provider, patient, appointment } = chatOptions
    !chatOptions ? (() => { navigation.canGoBack() && navigation.goBack(); return (<></>) })() : true
    const isProvider = true
    const isNextChatEnabled = getIsAppointmentChatEnabled(appointment?.date, appointment?.acceptance_status)

    const bottomEntryViewHeight = windowHeight / 11

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
                            FCM: '',
                            UserType: 'Doctor'
                        },
                        Messages: []
                    })
                    console.log(room.MessageRoomDetails);
                    firestore()
                        .collection(`Chats-${Configurations.mode}`)
                        .doc(appointment?.order)
                        .set(room).then(() => {
                            console.log('posted');
                        })
                } else {
                    const roomDetails = documentSnapshot.data()
                    console.log({ roomDetails });

                    roomDetails?.MessageRoomDetails?.Messages?.reverse()


                    setRoom(roomDetails)
                }
            })
    }, [])

    const onSendMessage = async () => {

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
                r?.MessageRoomDetails.Messages.push(newMessage)
                return r
            })

            setMessageInput('')

            await firestore().collection(`Chats-${Configurations.mode}`).doc(appointment?.order).update({ 'MessageRoomDetails.Messages': firestore.FieldValue.arrayUnion(newMessage) }).finally(() => {
                setIsAutoResendable(true)
            })
        }

    }


    const renderMessageItem = ({ item, index }) => {
        const messageItem = new Message(item?.MessageDetails)
        const { MessageDetails, isSentByMe } = messageItem
        const { Body, SYSTEM } = MessageDetails
        const isMine = isSentByMe(loginUserData?.user_id)

        // var str = moment(MessageDetails.Milliseconds).toString().split(' ');
        // str.pop()
        // str = str.join(' ').split(':')
        // str.pop()

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
                        backgroundColor: SYSTEM ? '#FFF2D9' : isMine ? '#0168B3' : '#FFFFFF',
                        padding: 8,
                        borderRadius: 8
                    }}>

                        <Text style={{
                            textAlign: SYSTEM ? 'left' : 'left',
                            color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                            fontFamily: Font.Regular,
                            fontSize: SYSTEM ? Font.small : Font.medium,


                        }} >{Body}</Text>
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
                                    width: windowWidth / 8,
                                    height: windowWidth / 8,
                                    borderRadius: windowWidth / 8,
                                }} resizeMethod='scale' resizeMode='contain'
                                    source={{ uri: patient?.image }} />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: '1%' }}>
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                    alignSelf: 'center',
                    width: '100%',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: Colors.White,
                    paddingBottom: (Platform.OS == 'ios') ? insets.bottom - 20 : 0,
                }}>
                    <View style={{ width: windowWidth * 0.8, justifyContent: 'center', }}>
                        <View style={{
                            borderRadius: vs(16),
                            backgroundColor: Colors.backgroundcolor,
                            padding: vs(8),
                            justifyContent: 'center',
                        }}>
                            <TextInput
                                placeholder='Write your message here..'
                                placeholderTextColor={'#515C6F'}
                                style={{ width: '100%', color: Colors.Black, textAlignVertical: 'center', fontSize: Font.small }}
                                multiline
                                value={messageInput}
                                returnKeyType='next'
                                onChangeText={setMessageInput}
                            />

                        </View>
                    </View>

                    <View style={{
                        padding: vs(8),
                        justifyContent: 'center',
                        width: windowWidth * 0.15

                    }}>
                        <Pressable style={{
                            backgroundColor: (messageInput.trim().length <= 0) ? Colors.lightGrey : Colors.Theme,
                            padding: vs(12),
                            height: windowWidth * 0.1,
                            width: windowWidth * 0.1,
                            borderRadius: windowWidth * 0.1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} disabled={messageInput.trim().length <= 0} onPress={onSendMessage}>
                            <SvgXml xml={Send} />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>

    )
}

export default Chat

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
})