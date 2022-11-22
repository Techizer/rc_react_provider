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
    Dimensions
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
    Colors,
    Font,
    mobileH,
    Mapprovider,
    msgProvider,
    msgText,
    config,
    mobileW,
    localStorage,
    localimag,
    consolepro,
    handleback,
    Lang_chg,
    apifuntion,
    msgTitle,
} from '../Provider/utilslib/Utils';

let ScreenHeight = Dimensions.get('window').height;

class SearchPlaceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            listData: [],
            isVisible: true,
            place_key: ''
            // loginUserData: JSON.parse(global.loginUserData),
        };
    }

    componentDidMount() {
        // this.locationRef.focus()
        this.getPlaceKey()
    }

    getPlaceKey = async () => {
        let user_details = await localStorage.getItemObject('user_arr');
        console.log("user_details:: ", user_details);
        let place_key = user_details['place_key'];
        this.setState({
            place_key: place_key
        },()=>{
            setTimeout(() => this.locationRef.focus(), 100)
        })
    }

    closeModalAction = () => {
        this.props.closeGooglePlace({
            ivrListVisible: false,
        });
    };

    /**
     * render() this the main function which used to display different view
     * and contain all view related information.
     */


    render() {

        return (
            <Modal
                propagateSwipe={50}
                animationType="fade"
                transparent={true}
                visible={true}
                coverScreen={true}
                onRequestClose={() => {
                }}>
                {/* <ScrollView
                    scrollEnabled={enableScrollViewScroll}
                    showsVerticalScrollIndicator={false}> */}
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={{
                        margin: 0,
                        backgroundColor: 'white',
                        borderRadius: 6,
                        padding: 15,
                        paddingTop: 40,
                        width: '100%',
                        height: ScreenHeight,
                        flex: 1
                    }}>
                        <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                position: "relative",
                                right: 0,
                                top: 0,
                                zIndex: 1,
                                justifyContent: 'center',
                                alignContent: 'center',
                                textAlign: 'center',
                            }}
                            onPress={() => {
                                this.closeModalAction(false);
                            }}>
                            <Image
                                // source={require('../assets/images/close.png')}
                                source={localimag.cross}
                                style={{ width: 25, height: 25 }}
                            />

                        </TouchableOpacity>

                        {/* <View>
                            <Text>Current Location</Text>
                            <Text>Using GPS of your device</Text>
                        </View>

                        <View>
                            <Text>Current Location</Text>
                            <Text>Using GPS of your device</Text>
                        </View> */}

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#fff',
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            {/* {
                                (this.state.place_key != '') && */}
                                <GooglePlacesAutocomplete
                                    ref={instance => {
                                        this.locationRef = instance;
                                    }}
                                    clearButtonMode={'while-editing'}
                                    // styles={[{
                                    //     height: 44,
                                    //     color: '#25252E',
                                    //     marginBottom: 15,
                                    //     backgroundColor: '#ffffff',
                                    //     borderColor: '#ECECEC',
                                    //     borderWidth: 1,
                                    //     borderRadius: 4,
                                    //     paddingLeft: 10,
                                    //     paddingRight: 10,
                                    //     fontSize: 16,
                                    // }, {
                                    //     color: '#7C7C7C',
                                    //     //backgroundColor: 'red'
                                    // }]}
                                    placeholder='Search for area, street name..'
                                    placeholderTextColor="#7C7C7C"
                                    minLength={2}
                                    autoFocus={true}
                                    returnKeyType={'default'}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    query={{
                                        key: this.state.place_key, //'AIzaSyDh_I54vPj40JriRJy4LBbS3zTBC41WXjk',//'AIzaSyAFnw06GvFjnUL-po_jmrQAwHyZ9trWO2Y',
                                        language: 'en',
                                        // types: 'geocode', //<=== use this to only show country cities
                                        // components: 'country:uk', //, <=== use this to restrict to country
                                    }}
                                    GooglePlacesDetailsQuery={{
                                        fields: 'formatted_address,geometry,address_components,types,adr_address,place_id,plus_code'
                                    }}
                                    textInputProps={{
                                        // ref: textInput => {

                                        //     if (this.props.autofocus) {
                                        //         textInput && textInput.focus();
                                        //     }
                                        //     if (this.state.showMap) {
                                        //         textInput && textInput.blur();
                                        //     }
                                        // },
                                        // ref: (textInput) => {
                                        //     setTimeout(() => textInput && textInput.focus(), 100);
                                        //   },
                                        placeholderTextColor: '#7C7C7C',
                                        backgroundColor: '#F2F3F2',
                                        height: 40,
                                        fontFamily: Font.fontregular,
                                        fontSize: 14,
                                        //borderBottomWidth: 1,
                                        //borderBottomColor: "#7C7C7C",
                                        //borderBottomWidth: 0.5,
                                        //marginTop: 10
                                        color: Colors.blackColor,
                                        // paddingRight:"20%"
                                    }}
                                    onFail={error => {
                                        //console.log('error ', error);
                                    }}
                                    onPress={(data, details = null) => {
                                        // 'details' is provided when fetchDetails = true
                                        console.log(data);
                                        console.log(details);
                                        this.setState(
                                            {
                                                latitude: details.geometry.location.lat,
                                                longitude: details.geometry.location.lng,
                                            },
                                            () => {
                                                // global.latitude = this.state.latitude;
                                                // global.longitude = this.state.longitude;
                                                console.log('latitude:: ', this.state.latitude)
                                                console.log('longitude:: ', this.state.longitude)

                                                // for (var i = 0; i < details.address_components.length; i++) {
                                                //     for (var j = 0; j < details.address_components[i].types.length; j++) {
                                                //       if (details.address_components[i].types[j] == "postal_code") {
                                                //         // document.getElementById('postal_code').innerHTML = details.address_components[i].long_name;
                                                //         console.log('details.address_components[i].long_name:: ', details.address_components[i].long_name)
                                                //       }
                                                //     }
                                                //   }
                                                // global.userAddress = data.description;
                                                // global.userLat = this.state.latitude;
                                                // global.userLong = this.state.longitude;
                                                this.props.selectGooglePlace({
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
                                            // marginLeft: 5,

                                        },
                                        textInput: {
                                            color: Colors.blackColor
                                            //lineHeight: 20,
                                            // fontSize: 14,
                                            // borderColor: '#f9fafe',
                                            // width: 50,
                                            //backgroundColor: 'green'
                                            //color: 'red', 
                                        },
                                        predefinedPlacesDescription: {
                                            color: '#000',
                                        },
                                        // listView: {
                                        //     position: 'absolute',
                                        //     top: 45,
                                        //     left: -10,
                                        //     width: Dimen.width - 30,
                                        //     height: 200,
                                        //     zIndex: 9999
                                        // },
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
                            {/* } */}
                        </View>

                    </View>
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default SearchPlaceScreen;
