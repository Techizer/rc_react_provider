import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Message } from '../Schemas/MessageRoomSchema'
import { Colors, Font } from '../Provider/Colorsfont'
import { vs, s } from 'react-native-size-matters'
import moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FullFileView from './FullFileView'
import { windowWidth } from '../Helpers/Utils'
import { Icons } from '../Icons/IReferences'


const ChatMessage = ({
    Item,
    navigation
}) => {

    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
    const [isFileVisible, setIsFileVisible] = useState(false);
    const toggleNumberOfLines = () => {
        setTextShown(!textShown);
    }

    const insets = useSafeAreaInsets()
    const messageInputRef = useRef()

    const { loginUserData } = useSelector(state => state.StorageReducer)


    const onTextLayout = useCallback(e => {
        setLengthMore(e.nativeEvent.lines.length >= 4);
    }, []);
    return (

        <>

            {
                Item?.messages.map((message) => {
                    const { Body, SYSTEM, ImagePaths, DocPaths } = message.MessageDetails
                    const isMine = JSON.parse(message.MessageDetails.SenderID == loginUserData?.user_id)
                    var time = moment(message.MessageDetails.Milliseconds).format('h:mm A')
                    return (
                        <View style={{
                            width: '100%',
                            alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                            justifyContent: 'center',
                            zIndex: 5,
                            marginBottom: SYSTEM ? vs(8) : vs(5),
                        }}>
                            <View style={{
                                maxWidth: SYSTEM ? (windowWidth / 1.3) : (windowWidth / 1.4),
                                alignItems: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                            }}>
                                <Pressable
                                    onPress={() => {
                                        if (ImagePaths?.length > 0 || DocPaths?.length > 0) {
                                            navigation.navigate('FileView', { Images: ImagePaths, Docs: DocPaths })
                                        }
                                    }}
                                    style={{
                                        backgroundColor: SYSTEM ? '#FFF2D9' : isMine ? Colors.buttoncolorblue : '#FFFFFF',
                                        padding: 8,
                                        borderRadius: 8,
                                    }}>

                                    {
                                        (ImagePaths?.length > 0 || DocPaths?.length > 0) ?
                                            <View
                                                style={[{
                                                    backgroundColor: isMine ? Colors.buttoncolorblue : '#FFFFFF',
                                                    borderRadius: 8,
                                                    width: (windowWidth / 2),
                                                    alignSelf: SYSTEM ? 'center' : isMine ? 'flex-end' : 'flex-start',
                                                }]}>

                                                {
                                                    DocPaths.length > 0 ?
                                                        <View style={{
                                                            width: '100%',
                                                            height: (windowWidth / 3),
                                                            borderRadius: 8,
                                                            backgroundColor: Colors.Highlight
                                                        }}>
                                                            <View style={{
                                                                height: (windowWidth / 4.4),
                                                                width: '100%',
                                                            }}>
                                                                <Image
                                                                    source={{ uri: DocPaths[1] }}
                                                                    style={{ height: '100%', width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, }}
                                                                    resizeMode='cover'
                                                                />

                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                height: '30%',
                                                                alignItems: 'center',
                                                                paddingHorizontal: '3%'
                                                            }}>
                                                                <Image
                                                                    source={Icons.Pdf}
                                                                    style={{ height: 22, width: 22, }}
                                                                    resizeMode='contain'
                                                                />

                                                                <Text
                                                                    numberOfLines={1}
                                                                    style={{
                                                                        fontSize: Font.small,
                                                                        fontFamily: Font.Regular,
                                                                        paddingHorizontal: '3%'
                                                                    }}>{DocPaths[2]}</Text>
                                                            </View>
                                                        </View>
                                                        :
                                                        <Image
                                                            source={{ uri: ImagePaths[0] }}
                                                            style={{
                                                                width: '100%',
                                                                height: windowWidth / 3,
                                                                borderRadius: 8,
                                                            }}
                                                        />
                                                }

                                                {
                                                    Body != '' &&
                                                    <>
                                                        <Text
                                                            style={{
                                                                textAlign: SYSTEM ? 'left' : 'left',
                                                                color: isMine ? '#FFFFFF' : '#0C1016',
                                                                fontFamily: Font.Regular,
                                                                fontSize: 11,
                                                                marginTop: vs(5)
                                                            }} >{Body}</Text>

                                                    </>
                                                }

                                                {
                                                    !SYSTEM &&
                                                    <Text style={{
                                                        textAlign: 'right',
                                                        color: isMine ? Colors.white_color : '#8F98A7',
                                                        fontFamily: Font.Regular,
                                                        fontSize: Font.xsmall,
                                                        width: '100%',
                                                        marginTop: vs(16),


                                                    }}>
                                                        {time}
                                                    </Text>
                                                }

                                            </View>
                                            :
                                            <>
                                                <Text
                                                    onTextLayout={onTextLayout}
                                                    style={{
                                                        textAlign: SYSTEM ? 'left' : 'left',
                                                        color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                                        fontFamily: Font.Regular,
                                                        fontSize: SYSTEM ? Font.small : Font.medium,


                                                    }} >{Body}</Text>

                                                {!SYSTEM &&
                                                    <Text style={{
                                                        textAlign: 'right',
                                                        color: isMine ? Colors.white_color : '#8F98A7',
                                                        fontFamily: Font.Regular,
                                                        fontSize: Font.xsmall,
                                                        marginTop: windowWidth / 40,
                                                        alignSelf: 'flex-end'
                                                    }}>
                                                        {time}
                                                    </Text>
                                                }

                                                {/* {
                                                    lengthMore ?
                                                        <Text
                                                            onPress={toggleNumberOfLines}
                                                            style={{
                                                                fontSize: Font.small,
                                                                fontFamily: Font.Regular,
                                                                marginTop: 10,
                                                                color: SYSTEM ? '#A47C32' : isMine ? '#FFFFFF' : '#0C1016',
                                                            }}>{textShown ? 'Read less' : 'Read more'}</Text>
                                                        : null
                                                } */}
                                            </>
                                    }
                                </Pressable>
                            </View>

                        </View>

                    )

                })
            }

            <View style={styles.date}>
                <View style={styles.horizontalLine}></View>
                <View style={{
                    backgroundColor: Colors.backgroundcolor,
                    paddingHorizontal: 10,
                    position: 'absolute',
                    alignSelf: 'center',
                    zIndex: 9999,
                    paddingBottom: 3
                }}>
                    <Text>{Item.date}</Text>
                </View>
            </View>


            {/* <FullFileView
                visible={isFileVisible}
                onRequestClose={() => {
                    setIsFileVisible(false)
                }}
                Images={ImagePaths}
                Docs={DocPaths}
            /> */}
        </>

    )

}

const styles = StyleSheet.create({
    msgImg: {
        height: (windowWidth * 40) / 100,
        width: '92%',
        maxWidth: '92%',
    },
    date: {
        height: windowWidth / 10,
        width: '100%',
        justifyContent: 'center',
        // marginBottom: windowWidth / 10

    },
    horizontalLine: {
        width: '100%',
        height: 0.4,
        backgroundColor: Colors.lightGrey
    },
})
export default ChatMessage;