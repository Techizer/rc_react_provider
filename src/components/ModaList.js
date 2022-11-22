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

import styles, { ThemeColors } from '../styles/main.style';

import FlushMsg from '../utils/FlushMsg';
import { Apis } from '../utils/Apis';
import Loader from '../utils/Loader';
//import { Constants, Location, Permissions } from 'expo';
import { Images, Dimen, Fonts, Color } from '../utils'
import Styles from '../utils/CommonStyles';
import OrderService from '../services/OrderService';
import homestyle from '../styles/home.style';
import StateCityService from '../services/StateCityService';
let ScreenHeight = Dimensions.get('window').height;

class ModalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            listData: [],
            isVisible: true,
            // loginUserData: JSON.parse(global.loginUserData),
            apiLoding: false,
            loading: true,
            ended: false,
            searchText: '',
            enableScrollViewScroll: true,
            selectItem: props.selectItem,
            selectIndex: props.selectIndex,
        };
    }

    componentDidMount() {
        this.setState({
            listData:this.props.listData
        })
            
    }
    // loaderShowHide = status => {
    //     this.setState({
    //         apiLoding: status,
    //     });
    // };
    

    renderFooter = () => {
        const { ended } = this.state;
        if (this.state.listData.length === 0 && ended)
            return (
                <View style={styles.PersonList}>
                    <Text
                        style={{
                            textAlign: 'center',
                        }}>
                        No Data Found
                    </Text>
                </View>
            );
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000', padding: 20 }}
                color="#001684"
            />
        );
    };
    selectContact = item => {

        this.props.closeModal({
            ivrListVisible: false,
            showMsg: true,
            item: item,
        });
    };


    closeModalAction = () => {
        this.props.closeModal({
            ivrListVisible: false,
        });
    };



    // loaderShowHide = status => {
    //     this.setState({
    //         apiLoader: status,
    //     });
    // };

    /**
     * render() this the main function which used to display different view
     * and contain all view related information.
     */

    handleSearch = text => {
        const newData = this.state.listData.filter(item => {

            const itemData = `${item.name.toUpperCase()}`;

            const textData = text.toUpperCase();
            //console.log(itemData)
            return itemData.indexOf(textData) > -1;
        });

        this.setState({ listData: newData });
    };
    onEnableScroll = value => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };
    renderHeaderView = () => {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    value={this.state.searchText}
                    onChangeText={queryText => {
                        //console.log('queryText: ', queryText);
                        this.setState(
                            {
                                searchText: queryText,
                            },
                            () => {
                                this.handleSearch(queryText);
                            },
                        );
                    }}
                    placeholder={'search by name'}
                    placeholderTextColor="#000"
                    style={{
                        //backgroundColor: 'red',
                        width: '100%',
                        height: 40,
                        paddingHorizontal: 20,
                        borderRadius: 25,
                        borderColor: '#0253B3',
                        borderWidth: 1,
                        backgroundColor: '#fff',
                    }}
                />
            </View>
        );
    };

    render() {
        const { enableScrollViewScroll } = this.state;

        return (
            <Modal
                propagateSwipe={50}
                animationType="slide"
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
                    {/* <Loader loading={this.state.apiLoader} /> */}

                    <View style={{
                        margin: 0,
                        backgroundColor: ThemeColors.whiteColor,
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
                                source={require('../assets/images/close.png')}
                                style={{ width: 30, height: 30 }}
                            />

                        </TouchableOpacity>

                        <View
                            style={{
                                //flex: 1,
                                backgroundColor: '#fff',
                                padding: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="always"
                                value={this.state.searchText}
                                onChangeText={queryText => {
                                    this.setState(
                                        {
                                            searchText: queryText,
                                        },
                                        () => {
                                            this.handleSearch(queryText);
                                        },
                                    );
                                }}
                                placeholder="Search by Name"
                                placeholderTextColor="#000"
                                style={{
                                    color: '#000',
                                    width: '100%',
                                    height: 40,
                                    paddingHorizontal: 20,
                                    borderRadius: 25,
                                    borderColor: '#0253B3',
                                    borderWidth: 1,
                                    backgroundColor: '#fff',
                                }}
                            />
                        </View>
                        <View>
                            {console.log("testing",this.state.listData)}
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{
                                    marginBottom: 80
                                }}
                                onTouchStart={() => {
                                    this.onEnableScroll(false);
                                }}
                                onMomentumScrollEnd={() => {
                                    this.onEnableScroll(true);
                                }}
                                data={this.state.listData}
                                //ListHeaderComponent={this.renderHeaderView.bind(this)}
                                renderItem={({ item }) => {
                                    // var ivrTitle = item;

                                    return (

                                        <View
                                            style={{
                                                overflow: 'scroll', flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                borderRadius: 10,
                                                marginTop: 5,
                                                marginBottom: 10,
                                                backgroundColor: Color.grayDash, //ThemeColors.LightgreenColor,
                                                shadowColor: ThemeColors.blackColor,
                                                shadowOpacity: 0.23,
                                                shadowRadius: 2.62,
                                                elevation: 4,
                                                shadowOffset: { height: 2, width: 0 },
                                            }}>
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                }}
                                                onPress={() => {
                                                    this.selectContact(item);
                                                }}>
                                                <View
                                                    style={[
                                                        {
                                                            width: '100%',
                                                        },
                                                    ]}>
                                                    <View
                                                        style={
                                                            {
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                                // borderBottomWidth: 0.5,
                                                                // borderBottomColor: "grey",
                                                                padding: 15
                                                            }
                                                        }>
                                                        <Text
                                                            style={

                                                                {
                                                                    fontSize: 18,
                                                                    color: ThemeColors.blackColor,
                                                                    marginRight: 25,
                                                                    marginLeft: 4,
                                                                }
                                                            }>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                                //Setting the number of column
                                // ListFooterComponent={this.renderFooter.bind(this)}
                                numColumns={1}
                                keyExtractor={(item, index) => {
                                    return 'key-' + index.toString();
                                }}
                            />
                        </View>
                    </View>
                </View>
                {/* </ScrollView> */}
            </Modal>
        );
    }
}

export default ModalList;
