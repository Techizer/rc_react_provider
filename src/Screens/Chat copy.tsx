import { View, Text, FlatList, Dimensions, StatusBar, Platform, Image, TextInput, KeyboardAvoidingView, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getIsAppointmentChatEnabled } from '../Helpers/AppFunctions'
import ScreenHeader from '../Components/ScreenHeader'
import firestore from '@react-native-firebase/firestore'
import { Configurations } from '../Provider/configProvider'
import { Message, MessageRoom } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { vs } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

const Chat = ({ navigation, route }) => {

    const [room, setRoom] = useState<MessageRoom>()
    const [isAutoResendable, setIsAutoResendable] = useState<Boolean>(true)
    const [messageInput, setMessageInput] = useState<String>('')
    const messageInputRef = useRef()

    const { chatOptions } = route?.params
    const { loginUserData } = useSelector(state => state.Auth)
    const { provider, patient, appointment } = chatOptions
    !chatOptions ? (() => { navigation.canGoBack() && navigation.goBack(); return (<></>) })() : true
    const isProvider = true
    const isNextChatEnabled = getIsAppointmentChatEnabled(appointment?.date, appointment?.acceptance_status)

    const bottomEntryViewHeight = windowHeight / 11

    const dummyMessages = []
    // dummyMessages.push(new Message({
    //     SYSTEM: true,
    //     Body: '1. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     SenderID: provider?.id,
    //     ReceiverID: patient?.id,
    // }))

    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '2. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     ReceiverID: provider?.id,
    //     SenderID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '3. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     SenderID: provider?.id,
    //     ReceiverID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '4. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     ReceiverID: provider?.id,
    //     SenderID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: true,
    //     Body: '5. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     SenderID: provider?.id,
    //     ReceiverID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '6. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm,  Crated on 28th of February 2023 on Tuesday at 3 pm,  Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     SenderID: provider?.id,
    //     ReceiverID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '2. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     ReceiverID: provider?.id,
    //     SenderID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '3. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     SenderID: provider?.id,
    //     ReceiverID: patient?.id,
    // }))
    // dummyMessages.push(new Message({
    //     SYSTEM: false,
    //     Body: '4. Appointment Crated on 28th of February 2023 on Tuesday at 3 pm',
    //     DateTime: new Date(appointment?.date),
    //     DocPaths: [],
    //     ImagePaths: [],
    //     Milliseconds: moment(new Date(appointment?.date)).valueOf(),
    //     NumChars: 'Appointment Crated on 28th of February 2023 on Tuesday at 3 pm'.length,
    //     ReadBit: true,
    //     Shown: true,
    //     ReceiverID: provider?.id,
    //     SenderID: patient?.id,
    // }))



    useEffect(() => {
        // test message
        firestore()
            .collection(`Chats-${Configurations.mode}`)
            .doc(appointment?.order)
            .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.data() || !documentSnapshot.exists) {
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
                        .set(room).then(data => {
                            console.log('posted');
                        })
                } else {
                    console.log({ datas: documentSnapshot.data() });
                    const roomDetails = documentSnapshot.data()?.MessageRoomDetails
                    setRoom(roomDetails)
                }
            })
    }, [])


    const renderMessageItem = ({ item, index }) => {
        const messageItem = new Message(item?.MessageDetails)
        const { MessageDetails, isSentByMe } = messageItem
        const { Body, SYSTEM } = MessageDetails
        const isMine = isSentByMe(loginUserData?.user_id)
        return (
            <View style={{
                width: '100%',
                alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                justifyContent: 'center',
                zIndex: 5
            }}>
                <View style={{
                    width: SYSTEM ? '86%' : '92%',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: SYSTEM ? '#FFF2D9' : isMine ? '#0168B3' : '#FFFFFF',
                        padding: 8,
                        borderRadius: 8
                    }}>

                        <Text style={{
                            textAlign: SYSTEM ? 'center' : 'left',
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
                            paddingVertical: vs(1),
                            paddingHorizontal: vs(12)


                        }} >{moment(MessageDetails.Milliseconds).toString()}</Text>
                    }


                </View>

            </View>

        )
    }

    return (
        <>
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
                                    source={{ uri: provider?.image }} />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: '1%' }}>
                                <Text style={{
                                    color: Colors.Black,
                                    fontFamily: Font.SemiBold,
                                    fontSize: Font.medium
                                }} allowFontScaling={false} >{provider?.name}</Text>

                                <Text style={{
                                    color: '#8F98A7',
                                    fontFamily: Font.Medium,
                                    fontSize: Font.xsmall
                                }} allowFontScaling={false} >{`Consultation ID: ${appointment?.order}`}</Text>

                            </View>

                        </View>
                    )
                }}
                style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

            <View style={{
                flex: 1,
                height: '100%',
                paddingBottom: Math.max(bottomEntryViewHeight, vs(70)) + vs(2),
                backgroundColor: 'transparent',
                zIndex: 1
            }}>
                <FlatList
                    style={{ flex: 1, zIndex: 2 }}
                    contentContainerStyle={{ paddingHorizontal: '2%', zIndex: 3, paddingBottom: vs(28), paddingTop: vs(32) }}
                    data={room?.MessageRoomDetails?.Messages?.reverse()}
                    keyExtractor={(i, _i) => 'message' + _i}
                    inverted={room?.MessageRoomDetails?.Messages ? true: false}
                    renderItem={renderMessageItem}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (<View style={{ marginVertical: vs(10) }} />)}
                    ListEmptyComponent={() => ( <Text style={{ width: '100%', alignSelf: 'center', textAlign: 'center' }} >No Messages</Text> )}
                />
            </View>


            <KeyboardAvoidingView style={{
                position: 'absolute',
                bottom: 0,
                height: bottomEntryViewHeight,
                width: '100%',
                backgroundColor: Colors.White,
                minHeight: vs(70),
                paddingTop: 0.05 * bottomEntryViewHeight,
                paddingBottom: 0.25 * bottomEntryViewHeight,
                justifyContent: 'center',
                zIndex: 4
            }}>
                <View style={{
                    flex: 1,
                    alignSelf: 'center',
                    width: '96%',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        borderRadius: vs(16),
                        backgroundColor: '#F0F0F0',
                        padding: vs(8),
                        justifyContent: 'center'
                    }}>
                        <TextInput
                            placeholder='Write your message here..'
                            placeholderTextColor={'#515C6F'}
                            style={{ width: '100%', color: Colors.Black, textAlignVertical: 'center' }}
                            multiline
                        />

                        <Pressable>

                        </Pressable>


                    </View>

                </View>
            </KeyboardAvoidingView>
        </>

    )
}

export default Chat