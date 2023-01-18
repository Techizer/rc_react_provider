/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from 'react';
import {
    Text,
    View,
    Modal,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    PermissionsAndroid
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    Colors,
    Font,
    config,
    localStorage,
    LanguageConfiguration,
} from '../Helpers/Utils';
import { s, vs } from 'react-native-size-matters';
import ScreenHeader from './ScreenHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import AddressInputPopup from './AddressInputPopup';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';

let ScreenHeight = Dimensions.get('window').height;

class SearchPlaceScreen extends Component {

    address_id = this?.props?.route?.params?.address_id;
    isNew = this?.props?.route?.params?.isNew;

    constructor(props) {
        super(props);
        
        this.state = {
            contacts: [],
            listData: [],
            isVisible: false,
            place_key: '',
            countryKey: '',
            searchPlaceVisible: false,
            service_lat: '',
            service_long: '',
            service_address: '',
            addressData: {
                latitude: '',
                longitude: '',
                latdelta: '',
                longdelta: '',
                address: '',
                type: '',
                addressBottomSheet: false,
                country: ''
            }
            // loginUserData: JSON.parse(global.loginUserData),
        };
    }

    componentDidMount() {
        // this.locationRef.focus()
        this.getSpecificCountryCode()
        this.getPlaceKey()

    }

    getSpecificCountryCode = async () => {

        let user_details = await localStorage.getItemObject('user_arr');
        const { work_area } = user_details
        if (work_area === 'UAE') {
            this.setState({
                countryKey: 'AE'
            })
        }
        else if (work_area === 'Saudi Arabia') {
            this.setState({
                countryKey: 'SA'
            })
        }
    }

    selectGooglePlace = ({
        data,
        details,
        latitude,
        longitude,
    }) => {
        console.log({ data, details });
        this.setState(
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



    getadddressfromlatlong = (event) => {
        // alert('hi')

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

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
                this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                console.log({ data2, details })
                this.setState(
                    {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                    },
                    () => {
                        this.selectGooglePlace({
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

    getalldata = (position) => {

        let longitude = position.coords.longitude
        let latitude = position.coords.latitude
        console.log('positionlatitude', position.coords)
        console.log('positionlongitude', longitude)
        this.setState({ latitude: latitude, longitude: longitude, loading: false })
        // myLatitude = latitude,
        //   myLongitude = longitude
        current_lat_long = position

        let event = { latitude: latitude, longitude: longitude, latitudeDelta: this.state.latdelta, longitudeDelta: this.state.longdelta }
        this.getadddressfromlatlong(event)
        this.update_adress()
    }

    callLocation = async (that) => {
        this.setState({ loading: true })
        localStorage.getItemObject('position').then((position) => {

            if (position != null) {
                var pointcheck1 = 0
                this.getalldata(position)
                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    (position) => {

                        localStorage.setItemObject('position', position)
                        this.getalldata(position);
                        pointcheck1 = 1
                    },
                    (error) => {
                        let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

                        this.getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
                );
                that.watchID = Geolocation.watchPosition((position) => {


                    if (pointcheck1 != 1) {
                        localStorage.setItemObject('position', position)
                        this.getalldata(position)
                    }

                });

            }
            else {

                var pointcheck = 0
                Geolocation.getCurrentPosition(
                    //Will give you the current location
                    (position) => {

                        localStorage.setItemObject('position', position)

                        this.getalldata(position)
                        pointcheck = 1
                    },
                    (
                        error) => {
                        let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

                        this.getalldata(position)
                    },
                    { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
                );
                that.watchID = Geolocation.watchPosition((position) => {
                    //Will give you the location on location change
                    console.log('data', position);

                    if (pointcheck != 1) {

                        localStorage.setItemObject('position', position)
                        this.getalldata(position)
                    }

                });
            }
        })
    }

    getlatlong = async () => {

        let permission = await localStorage.getItemString('permission')
        if (permission != 'denied') {
            var that = this;
            //Checking for the permission just after component loaded
            if (Platform.OS === 'ios') {
                this.callLocation(that);
            } else {
                // this.callLocation(that);
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
                            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.latitude } }
                            that.getalldata(position)
                            localStorage.setItemString('permission', 'denied')

                        }
                    } catch (err) { console.warn(err) }
                }
                requestLocationPermission();
            }
        } else {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }
            this.getalldata(position)
        }
    }

    getPlaceKey = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        console.log("user_details:: ", user_details);
        let place_key = user_details['place_key'];
        this.setState({
            place_key: place_key
        }, () => {
            //setTimeout(() => this.locationRef.focus(), 100)
        })
    }

    closeModalAction = () => {
        // this.props.closeGooglePlace({
        //     ivrListVisible: false,

        // });
        this.setState({
            searchPlaceVisible: false,
        });
    };

    render() {



        const lLan = config.language
        const lRot = config.textRotate

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

                    <ScreenHeader navigation={this.props.navigation} title='Service Address | Pickup Point' leftIcon={true} onBackPress={() => {
                        this.props.navigation.replace(ScreenReferences.ServiceAddress)
                    }} />
                    <AddressInputPopup
                        navigation={this.props.navigation}
                        visible={this.state.isVisible}
                        onRequestClose={() => {
                            this.setState({
                                isVisible: false
                            })
                        }}
                        shouldShowEditParam={false}
                        addressIDParam={this.address_id}
                        addressTitleParam={''}
                        buildingNameParam={''}
                        nearestLandmarkParam={''}
                        latitudeParam={this.state.service_lat}
                        longitudeParam={this.state.service_long}
                        googleAddressParam={this.state.service_address}
                        navToBackThen={true}
                        
                        //addressList[selectedAddress]
                        type={this.isNew ? 'addAddress' : 'editAddress'}
                        editedAddress={(val) => {
                            // getAddresses()
                            // let newAddress = {
                            //     lat: addressList[selectedAddress]?.lat,
                            //     lng: addressList[selectedAddress]?.lng,
                            //     address: addressList[selectedAddress]?.address,
                            // }
                            // localStorage.setItemObject("addressDetails", newAddress);
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
                                this.locationRef = instance;
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
                                key: this.state.place_key, //'AIzaSyDh_I54vPj40JriRJy4LBbS3zTBC41WXjk',//'AIzaSyAFnw06GvFjnUL-po_jmrQAwHyZ9trWO2Y',
                                language: 'en',
                                components: `country:${this.state.countryKey}`

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
                                this.setState(
                                    {
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                    },
                                    () => {
                                        console.log({ data });
                                        this.selectGooglePlace({
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
                            this.getlatlong()
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
}

export default SearchPlaceScreen;
