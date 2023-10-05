import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Platform, StatusBar, FlatList, Image, } from "react-native";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Configurations, localStorage, API, LanguageConfiguration } from "../Helpers/Utils";
import { Add } from "../Icons/SvgIcons/Index";
import ScreenHeader from "../Components/ScreenHeader";
import { useIsFocused } from "@react-navigation/native";
import AddressInputPopup from "../Components/AddressInputPopup";
import AddressContainer from "../Components/AddressContainer";
import { ScreenReferences } from "../Stacks/ScreenReferences";
import { useSelector } from "react-redux";
// import MapView, { Marker } from 'react-native-maps'; 
import { useRef } from "react";
import { Icons } from "../Icons/IReferences";

const windowHeight = Math.round(Dimensions.get("window").height);
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

const ServiceAddress = ({ navigation, route }) => {
    const [addressSheet, setAddressSheet] = useState(false)
    const [addressList, setAddressList] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(-1)
    const [defaultAddress, setDefaultAddress] = useState('')
    const [type, setType] = useState('addAddress')
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchedSuccess, setIsFetchedSuccess] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const isFocused = useIsFocused()

    const { isMTrue, lat, lng, id, googleAddress } = route?.params || { isMTrue: false, lat: 0, lng: 0, id: 0, googleAddress: '' }


    const {
        loginUserData
    } = useSelector(state => state.StorageReducer)

    const lRot = Configurations.textRotate

    useEffect(() => {
        if (isFocused) {
            console.log('focused.....');
            getAddresses()
            if (isMTrue) {
                setAddressSheet(true)
            } else {
                setAddressSheet(false)
            }
        }

    }, [isMTrue])

    const getAddresses = async () => {
        let user_details = loginUserData
        let { user_id, user_type } = user_details

        let url = Configurations.baseURL + "api-provider-list-address";
        var data = new FormData();

        data.append('login_user_id', user_id)
        data.append('service_type', user_type)


        API.post(url, data, 1).then((obj) => {
            // console.log({ results: obj?.result });

            if (obj.status == true) {
                if (obj?.result?.length > 1) {
                    var tArr = []
                    tArr.push(obj?.result[0])
                    setAddressList(tArr)
                    for (const iterator of obj?.result) {
                        if (iterator?.defult == '0') {
                            setDefaultAddress(iterator?.id)
                        }
                    }
                } else {
                    setAddressList((obj?.result == null ? [] : obj?.result))
                }

                setIsFetchedSuccess(true)
            }
            else {
                setAddressList([])
                setIsFetchedSuccess(true)
            }
        }).catch((error) => {
            setAddressList([])
            setIsFetchedSuccess(false)
            // MessageFunctions.showError(obj.message)
            console.log("getAddresses-error ------- " + error);
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

            <ScreenHeader
                leftIcon={true}
                title={'Service Address | Pickup Point'}
                onBackPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ScreenReferences.Home }],
                      });
                }}
                navigation={navigation} />

            <View style={{ backgroundColor: Colors.White, marginTop: vs(1), paddingHorizontal: s(13), paddingVertical: vs(15), }}>
                <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingBottom: vs(20) }}>

                    <View style={{ width: '2%' }} />
                    <View style={{ width: '98%', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            style={{
                                textAlign: Configurations.textRotate,
                                fontSize: Font.medium,
                                fontFamily: Font.Regular,
                                color: Colors.textblack,
                            }}>{'Service Address'}</Text>

                        {(addressList.length == 0 && isFetchedSuccess) &&
                            <View style={{
                                alignItems: 'flex-end'
                            }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                    onPress={() => {
                                        // setIsBottomSheet(true)
                                        // setType('addAddress')
                                        navigation.navigate(ScreenReferences.SearchPlace, {
                                            isNew: true,
                                            address_id: '',
                                        })
                                    }}>
                                    <SvgXml xml={Add} />
                                    <Text
                                        style={{
                                            textAlign: Configurations.textRotate,
                                            fontSize: Font.small,
                                            fontFamily: Font.Regular,
                                            color: '#0888D1',
                                            marginLeft: s(5)
                                        }}>{'Add new address'.toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </View>

                {
                    (addressList.length > 0) &&
                    <AddressContainer
                        index={0}
                        addressDetails={addressList[0]}
                        showModal={(val) => {
                            setAddressSheet(true)
                        }}
                        navigation={navigation}
                        selected={selectedAddress}
                        selectedAddress={(val) => {
                            setSelectedAddress(val)
                        }}
                        editable={(val) => {
                            setIsEditable(val)
                            setType('editAddress')
                        }}
                        isLoading={isLoading}
                        defaultAdd={defaultAddress}
                    />
                }



                <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingVertical: 16, paddingHorizontal: 10, backgroundColor: '#E5E5E58D', borderRadius: 6, marginTop: vs(8) }}>
                    {
                        (Configurations.language == 0) &&
                        <View style={{ width: '12%', alignItems: 'center', }}>
                            <Image
                                source={Icons.InformationButton}
                                style={{
                                    width: 18,
                                    height: 18,
                                    tintColor: '#17181A'
                                }} resizeMethod='scale' resizeMode='contain' >
                            </Image>
                        </View>
                    }
                    <View style={{ width: '88%' }}>
                        <Text style={{ textAlign: lRot, fontSize: s(11), fontFamily: Font.Regular, color: '#6D737E', lineHeight: 16 }}>
                            {LanguageConfiguration.SearchScreenNote[Configurations.language]}
                        </Text>
                    </View>
                    {
                        (Configurations.language == 1) &&
                        <View style={{ width: '12%', alignItems: 'center', }}>
                            <Image
                                source={Icons.InformationButton}
                                style={{
                                    width: 18,
                                    height: 18,
                                    tintColor: '#17181A'
                                }} resizeMethod='scale' resizeMode='contain' >
                            </Image>
                        </View>
                    }
                </View>

                {/* {addressList.length > 0 && <View style={{
                    flex: 1,
                    borderRadius: vs(16)
                }}>
                    <MapView
                    
                        ref={mapRef}
                        style={{
                            flex: 1,
                            borderRadius: vs(16),
                            marginVertical: vs(16)
                        }}
                        initialRegion={{
                            latitude: addressList[0]?.service_lat ? addressList[0]?.service_lat: 100,
                            longitude: addressList[0]?.service_long? addressList[0]?.service_long: 100
                        }}
                        zoomEnabled
                        zoomControlEnabled
                        zoomTapEnabled
                        // minZoomLevel={1}
                        maxZoomLevel={20}
                        loadingEnabled
                        loadingIndicatorColor={Colors.textblue}
                        onLayout={() => {
                            console.log('OnP');
                            mapRef.current.animateToRegion({
                                latitude: addressList[0]?.service_lat,
                                longitude: addressList[0]?.service_long,
                                latitudeDelta: 0.025,
                                longitudeDelta: 0.025,
                            }, 1000)
                        }}>
                        <Marker
                            coordinate={{ latitude: addressList[0]?.service_lat, longitude: addressList[0]?.service_long, latitudeDelta: 1, longitudeDelta: 1, }}
                            title={addressList[0]?.service_address}
                            description={`${addressList[0]?.building_name}, Landmark: ${addressList[0]?.landmark}`}
                            
                            // { (loginUserData?.image != null && loginUserData?.image != '') ? {...{}}: {...{}} }
                            // image={(loginUserData?.image != null && loginUserData?.image != '') ? ({ uri: Configurations.img_url3 + loginUserData?.image }) : undefined}
                        />
                    </MapView>
                </View>} */}
            </View>



            <AddressInputPopup
                navigation={navigation}
                visible={addressSheet}
                onRequestClose={() => {
                    setAddressSheet(false)
                }}
                navToBackThen={false}
                shouldShowEditParam
                addressIDParam={(addressList[selectedAddress]?.aid) ? addressList[selectedAddress]?.aid : -1}
                addressTitleParam={(addressList[selectedAddress]?.title != 'null') ? addressList[selectedAddress]?.title : ''}
                buildingNameParam={(addressList[selectedAddress]?.building_name != 'null') ? addressList[selectedAddress]?.building_name : ''}
                latitudeParam={(addressList[selectedAddress]?.service_lat !== 0) ? addressList[selectedAddress]?.service_lat : 0}
                longitudeParam={(addressList[selectedAddress]?.service_long !== 0) ? addressList[selectedAddress]?.service_long : 0}
                googleAddressParam={(addressList[selectedAddress]?.service_address != 'null') ? addressList[selectedAddress]?.service_address : ''}
                nearestLandmarkParam={(addressList[selectedAddress]?.landmark != 'null') ? addressList[selectedAddress]?.landmark : ''}
                isDefaultParam={addressList[selectedAddress]?.default}
                // landmark
                type={'editAddress'}
                editedAddress={(val) => {
                    getAddresses()
                    let newAddress = {
                        lat: addressList[selectedAddress]?.lat,
                        lng: addressList[selectedAddress]?.lng,
                        address: addressList[selectedAddress]?.address,
                    }
                    localStorage.setItemObject("addressDetails", newAddress);
                }}
            />



        </View>
    );
}

export default ServiceAddress;