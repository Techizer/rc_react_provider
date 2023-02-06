import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Platform, StatusBar, FlatList, } from "react-native";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";

import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, deviceHeight, Configurations, localStorage, API } from "../Helpers/Utils";
import { Add } from "../Assets/Icons/SvgIcons/Index";
import ScreenHeader from "../Components/ScreenHeader";
import { useIsFocused } from "@react-navigation/native";
import AddressInputPopup from "../Components/AddressInputPopup";
import AddressContainer from "../Components/AddressContainer";
import { ScreenReferences } from "../Stacks/ScreenReferences";
import { useSelector } from "react-redux";

const windowHeight = Math.round(Dimensions.get("window").height);
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

const ServiceAddress = ({ navigation, route }) => {
    const [addressSheet, setAddressSheet] = useState(false)
    const [addressList, setAddressList] = useState([1])
    const [selectedAddress, setSelectedAddress] = useState(-1)
    const [defaultAddress, setDefaultAddress] = useState('')
    const [type, setType] = useState('addAddress')
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchedSuccess, setIsFetchedSuccess] = useState(false)
    const [isEditable, setIsEditable] = useState(false)
    const [isMTrueState, setIsMTrueState] = useState(false)
    const isFocused = useIsFocused()
    const sheetRef = React.useRef(null);

    const { isMTrue, lat, lng, id, googleAddress } = route?.params || { isMTrue: false, lat: 0, lng: 0, id: 0, googleAddress: '' }

    
  const {
    loginUserData
  } = useSelector(state => state.Auth)


    useEffect(() => {
        console.log({ isMTrue, lat, lng, id, googleAddress });
        setIsMTrueState(isMTrue)
        getAddresses()
    }, [isFocused, addressSheet])

    const getAddresses = async () => {
        let user_details = loginUserData
        let { user_id, user_type } = user_details

        let url = Configurations.baseURL + "api-provider-list-address";
        var data = new FormData();

        data.append('login_user_id', user_id)
        data.append('service_type', user_type)


        API.post(url, data, 1).then((obj) => {
            console.log({ results: obj?.result });

            if (obj.status == true) {
                setTimeout(() => {
                    setIsLoading(false)
                    if (obj?.result?.length > 1) {
                        var tArr = []
                        tArr.push(obj?.result[0])
                        setAddressList(tArr)
                    } else{
                        setAddressList(obj?.result)
                    }
                }, 250);
                for (const iterator of obj?.result) {
                    if (iterator?.defult == '0') {
                        setDefaultAddress(iterator?.id)
                    }
                }
                setIsFetchedSuccess(true)
            }
            else {
                setAddressList([])
                // MessageFunctions.showError(obj.message)
                setIsLoading(false)
                setIsFetchedSuccess(false)
            }
        }).catch((error) => {
            setIsLoading(false)
            setAddressList([])
            setIsFetchedSuccess(false)
            // MessageFunctions.showError(obj.message)
            console.log("getAddresses-error ------- " + error);
        });
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.backgroundcolor }}>

            <ScreenHeader
                leftIcon={true}
                title={'Service Address | Pickup Point'}
                style={{
                    paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0,
                    height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight
                }}
                onBackPress={() => {
                    navigation.goBack()
                }}
                navigation={navigation} />

            <View style={{ backgroundColor: Colors.White, marginTop: vs(7), paddingHorizontal: s(13), paddingVertical: vs(15) }}>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={addressList}
                    ListHeaderComponent={() => {
                        return (
                            <View
                                style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingBottom: vs(20) }}>

                                <View style={{ width: '2%' }} />
                                <View style={{ width: '98%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text
                                        style={{
                                            textAlign: Configurations.textRotate,
                                            fontSize: Font.regulartext_size,
                                            fontFamily: Font.SemiBold,
                                            color: Colors.textblack,
                                        }}>{'Service Address'}</Text>

                                    {(addressList.length === 0 && isFetchedSuccess) &&
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
                                                        fontSize: Font.sregulartext_size,
                                                        fontFamily: Font.Medium,
                                                        color: '#0888D1',
                                                        marginLeft: s(5)
                                                    }}>{'Add new address'.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }

                                </View>
                            </View>

                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <AddressContainer
                                index={index}
                                addressDetails={item}
                                showModal={(val) => {
                                    setAddressSheet(val)
                                    // sheetRef.current.snapTo(0)
                                }}
                                navigation={navigation}
                                selected={selectedAddress}
                                selectedAddress={(val) => {
                                    console.log('..............', addressList[val]);
                                    setSelectedAddress(val)
                                }}
                                editable={(val) => {
                                    setIsEditable(val)
                                    setType('editAddress')
                                }}
                                isLoading={isLoading}
                                defaultAdd={defaultAddress}


                            />
                        );
                    }}
                    contentContainerStyle={{ paddingBottom: addressList.length > 5 ? (windowWidth * 40) / 100 : 0 }}
                />
            </View>


            
            <AddressInputPopup
                navigation={navigation}
                visible={addressSheet || isMTrueState}
                onRequestClose={() => {
                    setAddressSheet(false)
                    setIsMTrueState(false)
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