import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { getIsAppointmentChatEnabled } from '../Helpers/AppFunctions'
import ScreenHeader from '../Components/ScreenHeader'

const Chat = ({ navigation, route }) => {

    const chatOptions = route?.params?.chatOptions
    !chatOptions ? (() => { navigation.canGoBack() && navigation.goBack(); return (<></>) })() : true
    const isProvider = true
    const isNextChatEnabled = getIsAppointmentChatEnabled()
    const { provider, patient, appointment } = chatOptions

    return (
        <FlatList
            ListHeaderComponent={() => (
                <ScreenHeader navigation={navigation} onBackPress={() => { navigation.goBack() }} title={provider?.name} />
            )}
            style={{
                flex: 1
            }}
        />

    )
}

export default Chat