import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    PermissionsAndroid,
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    Colors,
    Font,
    Configurations,
    localStorage,
    LanguageConfiguration,
    deviceHeight,
    windowWidth,
} from '../Helpers/Utils';
import { s, vs } from 'react-native-size-matters';
import ScreenHeader from '../Components/ScreenHeader';
import SimpleToast from 'react-native-simple-toast';
import AddressInputPopup from '../Components/AddressInputPopup';
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default SearchPlaceScreen = ({ navigation, route }) => {

    const [classStateData, setClassStateData] = useState({
        place_key: '',
        countryKey: '',
        searchPlaceVisible: false,
        service_lat: '',
        service_long: '',
        service_address: '',
    })

    const sheetRef = useRef()

    const setState = (payload, cb = () => { }) => {
        setClassStateData(prev => ({ ...prev, ...payload }))
        cb()
    }
    const {
        loginUserData
    } = useSelector(state => state.StorageReducer)


    const address_id = route?.params?.address_id;
    const isNew = (route?.params?.isNew !== null && route?.params?.isNew !== '') ? route?.params?.isNew : true;

    useEffect(() => {
        const countryKey = (loginUserData?.work_area === 'UAE') ? 'AE' : 'SA'
        setState({
            place_key: loginUserData?.place_key,
            countryKey: countryKey
        })
    }, [])


    const selectGooglePlace = ({
        data,
        details,
        latitude,
        longitude,
    }) => {
        setState(
            {
                searchPlaceVisible: true,
                service_lat: latitude,
                service_long: longitude,
                service_address: data?.description,
            }
        );

    };

    const getadddressfromlatlong = (event) => {
        // alert('hi')

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + Configurations.mapkey + '&language=' + Configurations.maplanguage)

            .then((response) => response.json())
            .then((resp) => {
                let responseJson = resp.results[0]
                let city = '';
                let administrative_area_level_1 = '';
                for (let i = 0; i < responseJson.address_components.length; i++) {
                    if (responseJson.address_components[i].types[0] == "locality") {
                        city = responseJson.address_components[i].long_name
                        break;
                    }
                    else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
                        city = responseJson.address_components[i].long_name
                    }

                }
                for (let j = 0; j < responseJson.address_components.length; j++) {
                    if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
                        administrative_area_level_1 = responseJson.address_components[j].long_name
                    }

                }
                let details = responseJson
                let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1, 'description': details?.formatted_address }

                post_location = data2
                // GooglePlacesRef && GooglePlacesRef.setAddressText()
                // console.log({ data2, details })
                setState(
                    {
                        service_address: details.formatted_address,
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                    },
                    () => {
                        selectGooglePlace({
                            data: data2,
                            details,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                        });

                    },
                );
                localStorage.setItemObject('address_arr', post_location.address);
                console.log('dfhhdfgb', data2)
            })



    }

    const getalldata = (position) => {

        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        console.log('positionlatitude', position.coords)
        console.log('positionlongitude', longitude)
        setState({ latitude: latitude, longitude: longitude, loading: false })
        current_lat_long = position

        let event = { latitude: latitude, longitude: longitude, latitudeDelta: classStateData.latdelta, longitudeDelta: classStateData.longdelta }
        getadddressfromlatlong(event)
        // update_adress()
    }

    const callLocationAccess = async () => {
        SimpleToast.show('Getting current location')
        setState({ loading: true })
        localStorage.getItemObject('position').then((position) => {

            if (position != null) {
                var pointcheck1 = 0
                getalldata(position)
                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    (position) => {

                        localStorage.setItemObject('position', position)
                        getalldata(position);
                        pointcheck1 = 1
                    },
                    (error) => {
                        let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

                        getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
                );
                watchID = Geolocation.watchPosition((position) => {


                    if (pointcheck1 != 1) {
                        localStorage.setItemObject('position', position)
                        getalldata(position)
                    }

                });

            }
            else {

                var pointcheck = 0
                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    (position) => {

                        localStorage.setItemObject('position', position)

                        getalldata(position)
                        pointcheck = 1
                    },
                    (
                        error) => {
                        let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

                        getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
                );
                watchID = Geolocation.watchPosition((position) => {
                    //Will give you the location on location change
                    console.log('data', position);

                    if (pointcheck != 1) {

                        localStorage.setItemObject('position', position)
                        getalldata(position)
                    }

                });
            }
        })
    }

    const callLocation = async () => {

        if (Platform.OS === 'ios') {
            callLocationAccess()
        }
        else {

            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
            })
                .then((data) => {
                    // The user has accepted to enable the location services
                    // data can be :
                    //  - "already-enabled" if the location services has been already enabled
                    //  - "enabled" if user has clicked on OK button in the popup
                    callLocationAccess()
                })
                .catch((err) => {
                    SimpleToast.show('Please enable your GPS')
                    // callLocation()
                    // The user has not accepted to enable the location services or something went wrong during the process
                    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                    // codes :
                    //  - ERR00 : The user has clicked on Cancel button in the popup
                    //  - ERR01 : If the Settings change are unavailable
                    //  - ERR02 : If the popup has failed to open
                    //  - ERR03 : Internal error
                });

        }




    }

    const getlatlong = async () => {

        var hasPermissions;

        if (Platform.OS === 'ios') {
            callLocation()
        } else if (Platform.OS === 'android') {
            try {
                // SimpleToast.show('Please grant relevant permissions')
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    'title': 'Location Access Required',
                    'message': 'This App needs to Access your location'
                }
                )
                console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    callLocation();
                } else {
                    let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.latitude } }
                    getalldata(position)

                }
            } catch (err) { console.warn(err) }
        }
    }

    const lLan = Configurations.language
    const lRot = Configurations.textRotate

    const windowHeight = Math.round(Dimensions.get("window").height);
    const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
    let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
    headerHeight += (Platform.OS === 'ios') ? 28 : -60


    return (
        <View style={{
            flex: 1,
            // alignItems: "center",
            backgroundColor: Colors.White
        }}>

            <ScreenHeader navigation={navigation} title='Pickup Point for Service' leftIcon={true} onBackPress={() => {
                navigation.pop()
            }} />




            <KeyboardAwareScrollView
                // extraScrollHeight={50}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{
                    justifyContent: 'center',
                }}
                showsVerticalScrollIndicator={false}>


                <View style={{ marginTop: vs(7), flex: 1, width: '100%', backgroundColor: Colors.White }}>

                    <GooglePlacesAutocomplete
                        ref={instance => {
                            locationRef = instance;
                        }}

                        currentLocation={true}
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={200}
                        clearButtonMode={'while-editing'}
                        placeholder='Search for area, street name..'
                        placeholderTextColor="#7C7C7C"
                        minLength={2}
                        autoFocus={true}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        // renderLeftButton={() => (
                        //     <View style={{
                        //         justifyContent: 'center',
                        //         alignItems: 'flex-end',

                        //     }}>
                        //         <Image
                        //             source={require('../Icons/search.png')}
                        //             style={{
                        //                 width: 18,
                        //                 height: 18,
                        //             }} resizeMethod='scale' resizeMode='contain' >
                        //         </Image>
                        //     </View>

                        // )}
                        query={{
                            key: classStateData.place_key,
                            language: 'en',
                            components: `country:${classStateData.countryKey}`
                            // types: 'geocode', //<=== use this to only show country cities
                            // components: 'country:uk', //, <=== use this to restrict to country
                        }}
                        GooglePlacesDetailsQuery={{
                            fields: 'formatted_address,geometry,address_components,types,adr_address,place_id,plus_code'
                        }}
                        textInputProps={{
                            placeholderTextColor: '#7C7C7C',
                            backgroundColor: '#F2F3F2',
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblack,
                        }}
                        onFail={error => {
                        }}
                        onPress={(data, details = null) => {
                            console.log({ data, details })
                            setState(
                                {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                },
                                () => {
                                    console.log({ data });
                                    selectGooglePlace({
                                        data,
                                        details,
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                    });
                                },
                            );
                        }}
                        styles={{
                            textInputContainer: {
                                width: '94%',
                                // backgroundColor: '#F2F3F2',
                                // justifyContent: 'center',
                                alignSelf: 'center',
                                // marginBottom:vs(10),
                                // height:'70%'

                            },
                            textInput: {
                                color: Colors.blackColor,
                                textAlignVertical: 'center',
                                justifyContent: 'center',
                                paddingBottom: -(windowHeight / 300),
                            },
                            predefinedPlacesDescription: {
                                color: '#000',
                            },
                            separator: {
                                height: 0.5,
                            },
                            loader: {
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                height: 20,
                            },
                            listView: {
                                zIndex: 2000
                            }
                        }}
                    />



                    <View style={{ paddingHorizontal: s(13), marginVertical: vs(10) }}>
                        <TouchableOpacity onPress={() => {
                            getlatlong()
                        }} style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                            <View style={{ width: '9%' }}>
                                <Image
                                    source={Icons.CurrentLocation}
                                    style={{
                                        width: 18,
                                        height: 18,
                                    }}></Image>
                            </View>
                            <View style={{ width: '91%', borderBottomWidth: 1, borderBottomColor: Colors.Border, paddingBottom: vs(12) }}>
                                <Text style={{ alignSelf: 'flex-start', fontSize: Font.medium, fontFamily: Font.SemiBold, color: Colors.darkText }}>{LanguageConfiguration.Currentlocation[lLan]}</Text>
                                <Text style={{ alignSelf: 'flex-start', fontSize: Font.small, fontFamily: Font.Regular, color: Colors.dullGrey, marginTop: vs(4) }}>{LanguageConfiguration.Using_gpsofyoudevice[lLan]}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>


                    <View style={{ flexDirection: 'row', width: '94%', alignSelf: 'center', paddingVertical: 16, paddingHorizontal: 10, backgroundColor: '#E5E5E58D', borderRadius: 6 }}>
                        {
                            (lLan == 0) &&
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
                                {LanguageConfiguration.SearchScreenNote[lLan]}
                            </Text>
                        </View>
                        {
                            (lLan == 1) &&
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

                </View>


                {/* <View style={{
                    marginTop: (Platform.OS === 'ios') ? headerHeight + 8 : headerHeight + StatusbarHeight + 8,
                    paddingTop: (windowWidth * 2) / 100,
                    zIndex: 0
                }}>
                    

                   
                </View> */}
            </KeyboardAwareScrollView>

            <AddressInputPopup
                visible={classStateData.searchPlaceVisible}
                navigation={navigation}
                onRequestClose={() => {
                    setState({ searchPlaceVisible: false })
                }}
                shouldShowEditParam={false}
                addressIDParam={address_id}
                addressTitleParam={''}
                buildingNameParam={''}
                nearestLandmarkParam={''}
                latitudeParam={classStateData.service_lat}
                longitudeParam={classStateData.service_long}
                googleAddressParam={classStateData.service_address}
                navToBackThen={true}
                type={isNew ? 'addAddress' : 'editAddress'}
                editedAddress={(val) => {
                }}
            />
        </View>
    );

}