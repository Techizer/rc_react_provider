import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Modal,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    PermissionsAndroid
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    Colors,
    Font,
    Configurations,
    localStorage,
    LanguageConfiguration,
} from '../Helpers/Utils';
import { s, vs } from 'react-native-size-matters';
import ScreenHeader from '../Components/ScreenHeader';
import SimpleToast from 'react-native-simple-toast';
import AddressInputPopup from '../Components/AddressInputPopup';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';

let ScreenHeight = Dimensions.get('window').height;

export default SearchPlaceScreen = ({ navigation, route }) => {

    const [classStateData, setClassStateData] = useState({
        isVisible: false,
        place_key: '',
        countryKey: '',
        searchPlaceVisible: false,
        service_lat: '',
        service_long: '',
        service_address: '',
    })

    
  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

    address_id = route?.params?.address_id;
    isNew = route?.params?.isNew;

    useEffect(() => {
        getSpecificCountryCode()
        getPlaceKey()
    }, [])

    const getSpecificCountryCode = async () => {

        let user_details = await localStorage.getItemObject('user_arr');
        const { work_area } = user_details
        if (work_area === 'UAE') {
            setState({
                countryKey: 'AE'
            })
        }
        else if (work_area === 'Saudi Arabia') {
            setState({
                countryKey: 'SA'
            })
        }
    }

    const selectGooglePlace = ({
        data,
        details,
        latitude,
        longitude,
    }) => {
        console.log({ data, details });
        setState(
            {
                searchPlaceVisible: false,
                service_lat: latitude,
                service_long: longitude,
                service_address: data?.description,
                isVisible: true
            },
            () => {

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
                GooglePlacesRef && GooglePlacesRef.setAddressText(details.formatted_address)
                console.log({ data2, details })
                setState(
                    {
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
        update_adress()
    }

    const callLocation = async (that) => {
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
                that.watchID = Geolocation.watchPosition((position) => {


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
                that.watchID = Geolocation.watchPosition((position) => {
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

    const getlatlong = async () => {

        let permission = await localStorage.getItemString('permission')
        if (permission != 'denied') {
            var that = this;
            //Checking for the permission just after component loaded
            if (Platform.OS === 'ios') {
                callLocation(that);
            } else {
                // callLocation(that);
                async function requestLocationPermission() {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                            'title': 'Location Access Required',
                            'message': 'This App needs to Access your location'
                        }
                        )
                        console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            that.callLocation(that);
                        } else {
                            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.latitude } }
                            that.getalldata(position)
                            localStorage.setItemString('permission', 'denied')

                        }
                    } catch (err) { console.warn(err) }
                }
                requestLocationPermission();
            }
        } else {
            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }
            getalldata(position)
        }
    }

    const getPlaceKey = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        console.log("user_details:: ", user_details);
        let place_key = user_details['place_key'];
        setState({
            place_key: place_key
        }, () => {
            //setTimeout(() => locationRef.focus(), 100)
        })
    }

    const lLan = Configurations.language
    const lRot = Configurations.textRotate

    const windowHeight = Math.round(Dimensions.get("window").height);
    const windowWidth = Math.round(Dimensions.get("window").width);
    const deviceHeight = Dimensions.get('screen').height;
    const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)

    let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
    headerHeight += (Platform.OS === 'ios') ? 28 : -60

    return (
        <Modal
            propagateSwipe={50}
            animationType="fade"
            transparent={false}
            visible={true}
            coverScreen={true}
            onRequestClose={() => {
            }}>
            <View style={{
                flex: 1,
                alignItems: "center",
            }}>

                <ScreenHeader navigation={navigation} title='Service Address | Pickup Point' leftIcon={true} onBackPress={() => {
                    navigation.replace(ScreenReferences.ServiceAddress)
                }} />
                <AddressInputPopup
                    navigation={navigation}
                    visible={classStateData.isVisible}
                    onRequestClose={() => {
                        setState({
                            isVisible: false
                        })
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

                <View
                    style={{
                        flex: 0.5,
                        position: 'absolute',
                        zIndex: 999,
                        paddingHorizontal: 10,
                        paddingTop: 8,
                        justifyContent: 'center',
                        marginTop: headerHeight + StatusbarHeight,
                        width: '100%',
                    }}>
                    <GooglePlacesAutocomplete
                        ref={instance => {
                            locationRef = instance;
                        }}

                        clearButtonMode={'while-editing'}
                        currentLocation
                        currentLocationLabel='Current'
                        placeholder='Search for area, street name..'
                        placeholderTextColor="#7C7C7C"
                        minLength={2}
                        autoFocus={true}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        renderLeftButton={() => (
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'flex-end',

                            }}>
                                <Image
                                    source={require('../Assets/Icons/search.png')}
                                    style={{
                                        width: 18,
                                        height: 18,
                                    }} resizeMethod='scale' resizeMode='contain' >
                                </Image>
                            </View>

                        )}
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
                                width: '100%',
                                backgroundColor: '#F2F3F2',
                                justifyContent: 'center',
                                paddingHorizontal: 8,

                            },
                            textInput: {
                                color: Colors.blackColor,
                                textAlignVertical: 'center',
                                justifyContent: 'center',
                                paddingBottom: -(windowHeight / 300)
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
                        }}
                    />

                </View>

                <View style={{
                    marginTop: (Platform.OS === 'ios') ? headerHeight + 8 : headerHeight + StatusbarHeight + 8
                }}>
                    <TouchableOpacity onPress={() => {
                        SimpleToast.show('Getting current location')
                        getlatlong()
                    }} style={{ flexDirection: 'row', width: '100%', alignSelf: 'flex-start', paddingTop: 4, paddingBottom: 32 }}>
                        {
                            (lLan === 0) &&
                            <View style={{ width: '12%', alignItems: 'center' }}>
                                <Image
                                    source={Icons.CurrentLocation}
                                    style={{
                                        width: 22,
                                        height: 22,
                                    }} resizeMethod='scale' resizeMode='contain' >
                                </Image>
                            </View>
                        }

                        <View style={{ width: '88%' }}>
                            <Text style={{ textAlign: lRot, fontSize: 16, fontFamily: Font.bold_font_family, color: '#17181A' }}>{LanguageConfiguration.Currentlocation[lLan]}</Text>
                            <Text style={{ textAlign: lRot, fontSize: 14, fontFamily: Font.Regular, color: '#6D737E', marginTop: vs(4) }}>{LanguageConfiguration.Using_gpsofyoudevice[lLan]}</Text>
                        </View>

                        {
                            (lLan === 1) &&
                            <View style={{ width: '12%', alignItems: 'center' }}>
                                <Image
                                    source={Icons.CurrentLocation}
                                    style={{
                                        width: 22,
                                        height: 22,
                                    }} resizeMethod='scale' resizeMode='contain' >
                                </Image>
                            </View>
                        }
                    </TouchableOpacity>
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

            </View>
            {/* </ScrollView> */}
        </Modal>
    );

}