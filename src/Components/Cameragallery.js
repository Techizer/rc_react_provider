import React, { Component, useState } from "react"
import { View, Dimensions, Modal, TouchableOpacity, Text } from "react-native"
import { Colors, Font, Configurations, LanguageConfiguration } from '../Helpers/Utils';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default CameraGallery = ({ navigation, route, mediamodal, Canclemedia, isCamera, Camerapopen = () => {}, isGallery, Galleryopen = () => {}, isDocument, DocumentGalleryopen = () => {} }) => {

    const [modalVisible, setModalVisible] = useState()

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={mediamodal}
            onRequestClose={() => {
                setModalVisible(false)
            }}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => { Canclemedia() }} style={{ flex: 1, backgroundColor: '#00000030', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: screenWidth, }}>
                    <View style={{ width: '94%', backgroundColor: Colors.mediabackground, borderRadius: 5, paddingVertical: screenWidth * 4 / 100, alignSelf: 'center', marginTop: '3%' }}>
                        <View style={{ width: '85%', alignSelf: 'center' }}>
                            <Text style={{ fontFamily: Font.Medium, textAlign: Configurations.textRotate, fontSize: screenWidth * 5 / 100, color: '#000' }}>{LanguageConfiguration.select_option[Configurations.language]}</Text>
                            {
                                (isCamera) &&
                                <TouchableOpacity style={{ marginTop: '7%' }} activeOpacity={0.9} onPress={() => { Camerapopen() }}>
                                    <Text style={{ fontFamily: Font.Regular, textAlign: Configurations.textalign, fontSize: screenWidth * 4.5 / 100, color: '#000' }}>{LanguageConfiguration.MediaCamera[Configurations.language]}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (isGallery) &&
                                <TouchableOpacity style={{ marginTop: '7%' }} onPress={() => { Galleryopen() }}>
                                    <Text style={{ fontFamily: Font.Regular, textAlign: Configurations.textalign, fontSize: screenWidth * 4.5 / 100, color: '#000' }}>{LanguageConfiguration.Mediagallery[Configurations.language]}</Text>
                                </TouchableOpacity>
                            }
                            {
                                (isDocument) &&
                                <TouchableOpacity style={{ marginTop: '7%' }} onPress={() => { DocumentGalleryopen() }}>
                                    <Text style={{ fontFamily: Font.Regular, textAlign: Configurations.textalign, fontSize: screenWidth * 4.5 / 100, color: '#000' }}>{LanguageConfiguration.Documentgallery[Configurations.language]}</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{ marginTop: '7%' }} onPress={() => { Canclemedia() }}>
                                <Text style={{ fontFamily: Font.Regular, textAlign: Configurations.textalign, fontSize: screenWidth * 4.5 / 100, color: '#000' }}>{LanguageConfiguration.cancelmedia[Configurations.language]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )

}
