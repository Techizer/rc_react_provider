import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, StatusBar, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, localimag, handleback, Lang_chg, apifuntion, msgTitle } from './Provider/utilslib/Utils';
import { DrawerSubMenu } from './Components'
import Styles from './Styles';
import { DrawerActions } from '@react-navigation/native';
import { s, vs } from 'react-native-size-matters';
import { Appointment, MyAppointment, dummyUser, leftArrow, rightArrow } from './icons/SvgIcons/Index';
import { SvgXml } from 'react-native-svg';
import DrawerItemContainer from './Components/DrawerItem';
import { DrawerIcons } from './icons/drawer';
global.add_location = 'NA';
const windowWidth = Dimensions.get('window').width
export default class Drawerscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      address_new: 'NA',
      name: '',
      profile_img: null,
      totalCompletionPercentage: 0
      //address_old: ''
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (add_location != 'NA') {
        this.setState({
          address_new: add_location.address,
          latitude: add_location.latitude,
          longitude: add_location.longitude
        })
      }
      this.getProfile()
      this.getPercentage()
    });
  }

  getPercentage = async () => {
    var user_details = await localStorage.getItemObject("user_arr");
    let { user_id, user_type } = user_details;
    let url = config.baseURL + "api-provider-profile-complete";

    var data = new FormData();
    console.log({ user_id, user_type });
    data.append("login_user_id", user_id);
    data.append("user_type", user_type);
    apifuntion
      .postApi(url, data, 1)
      .then((completionData) => {
        this.setState({
          totalCompletionPercentage: completionData?.result?.total_complete
        })
      })
      .catch((error) => {
        console.log({ errorz: error });
        // setIsLoading(false)
        // setIsDelete(false)
        // msgProvider.showError(obj.message)
        // onRequestClose()
        // console.log("-------- error ------- " + error);
      });
  }

  getProfile = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let address_arr = await localStorage.getItemObject('address_arr')
    let user_type = user_details['user_type']
    this.setState({
      address_new: address_arr,
      user_type: user_type
    })

    this.setState({
      name: user_details['first_name'],
      email: user_details['email'],
      mobile: user_details['phone_number'],
      //address_old: user_details['current_address'],
    })
    if (user_details.image != null) {
      this.setState({
        profile_img: config.img_url3 + user_details['image'],
      })
    }

  }
  confirm_click = async () => {
    this.logoutApi()
  }
  logout = async () => {
    await localStorage.removeItem('user_arr');
    await localStorage.removeItem('user_login');
    this.setState({ show: false })
    this.props.navigation.navigate('Login')

  }
  logoutApi = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let user_id = user_details['user_id']
    let url = config.baseURL + "api-logout";
    var data = new FormData();
    data.append('user_id', user_id)

    apifuntion.postApi(url, data).then((obj) => {
      if (obj.status == true) {
        setTimeout(() => {
          this.logout()
        }, 500);
      } else {
        setTimeout(() => {
          msgProvider.showError(obj.message)
        }, 700);
        return false;
      }
    }).catch((error) => {
    })

  }
  // render() {
  //   return (
  //     <ScrollView
  //         showsVerticalScrollIndicator={false}
  //         style={{ flex: 1, backgroundColor: '#0888D1' }}>
  //         <View
  //           style={{
  //             flex: 1,
  //             width: '90%',
  //             alignSelf: 'center',
  //             paddingBottom: (mobileW * 15) / 100,
  //           }}>
  //           <View style={{ alignItems: 'center', }}>
  //             <View style={{
  //               borderWidth: 3,
  //               borderColor: '#C5EAFF',
  //               width: (mobileW * 26) / 100,
  //               height: (mobileW * 26) / 100,
  //               justifyContent: 'center',
  //               marginTop: mobileW * 4 / 100,
  //               marginVertical: (mobileW * 1) / 100,
  //               borderRadius: (mobileW * 26) / 200
  //             }}>
  //               <ImageBackground
  //                 imageStyle={{ borderRadius: (mobileW * 12.5) / 100, }}
  //                 style={{

  //                   width: (mobileW * 25) / 100,
  //                   height: (mobileW * 25) / 100,
  //                   alignSelf: 'center'

  //                 }}
  //                 source={this.state.profile_img == 'NA' || this.state.profile_img == null ? Icons.AccountFilled : { uri: this.state.profile_img }}
  //               >
  //                 <View
  //                   style={{
  //                     marginTop: (mobileW * 18) / 100,
  //                     marginLeft: (mobileW * 20) / 100,
  //                     alignSelf: 'center',
  //                     justifyContent: 'center',
  //                   }}>
  //                   <View
  //                     style={{
  //                       width: (mobileW * 6) / 100,
  //                       height: (mobileW * 6) / 100,
  //                       borderRadius: (mobileW * 4) / 100,
  //                       borderWidth: 2,
  //                       borderColor: Colors.bordercolorblue,
  //                       justifyContent: 'center',
  //                       backgroundColor: 'white',
  //                     }}>
  //                     <TouchableOpacity activeOpacity={0.9} onPress={() => {
  //                       this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                         this.props.navigation.navigate('MyProfile')
  //                     }}>
  //                       <Image
  //                         style={{
  //                           alignSelf: 'center',
  //                           height: (mobileW * 3) / 100,
  //                           width: (mobileW * 3) / 100,
  //                           alignSelf: 'center',
  //                         }}
  //                         source={Icons.camera}></Image>
  //                     </TouchableOpacity>
  //                   </View>
  //                 </View>
  //               </ImageBackground>
  //             </View>
  //             <Text
  //               style={{
  //                 color: Colors.white_color,
  //                 fontFamily: Font.SemiBold,
  //                 fontSize: Font.regulartext_size,
  //                 textAlign: 'center',
  //                 marginTop: (mobileW * 1.5) / 100,
  //               }}>{this.state.name}
  //             </Text>
  //             <Text
  //               style={{
  //                 color: Colors.drawertextblue,
  //                 fontFamily: Font.placeholderfontfamily,
  //                 fontSize: mobileW * 3.5 / 100,
  //                 textAlign: 'center',
  //                 marginTop: (mobileW * 1) / 100,
  //               }}>{this.state.email}
  //             </Text>

  //           </View>

  //           {/* Appoints and bookings section */}
  //           <View
  //             style={{
  //               marginTop: (mobileW * 8) / 100,
  //               marginBottom: (mobileW * 4) / 100,
  //             }}>
  //             <Text
  //               style={{
  //                 color: Colors.white_color,
  //                 fontFamily: Font.Medium,
  //                 fontSize: Font.headingfont,
  //                 textAlign: config.textRotate,

  //               }}>{Lang_chg.heading[config.language]}
  //             </Text>

  //             {/* --------------------------------------------------------------------upcoming */}

  //             <View
  //               style={{
  //                 borderWidth: 1,
  //                 borderColor: Colors.drawerblue,
  //                 borderRadius: (mobileW * 3) / 100,
  //                 marginTop: mobileW * 2 / 100,

  //               }}>
  //               <View style={{ width: '96%', alignSelf: 'center' }}>
  //                 <DrawerSubMenu
  //                   iconImage={Icons.user2}
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('Appointmenttab')
  //                     // , { title: Lang_chg.upcoming_heading[config.language], api_status: 0 });
  //                   }}
  //                   menuTitle={Lang_chg.MyAppointments[config.language]}
  //                   menuSubtitle={Lang_chg.MyAppointmentsSub[config.language]}
  //                   isBorderBottom={true}
  //                 />
  //                 {/* <TouchableOpacity
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('Show_other_appoinment', { title: Lang_chg.upcoming_heading[config.language], api_status: 0 });
  //                   }}
  //                   style={{
  //                     flexDirection: 'row',

  //                     paddingTop: (mobileW * 4) / 100,


  //                   }}>
  //                   <View style={{ width: '15%' }}>
  //                     <Image
  //                       style={Styles.drawercardicon}
  //                       source={Icons.user2}></Image>
  //                   </View>

  //                   <View
  //                     style={{
  //                       width: '85%',
  //                       marginLeft: mobileW * 1 / 100,
  //                       flexDirection: 'row',
  //                       borderBottomWidth: 1,
  //                       justifyContent: 'space-between',
  //                       borderColor: Colors.drawerblue,

  //                     }}>
  //                     <View style={{ width: '83%', }} >
  //                       <Text
  //                         style={{
  //                           color: Colors.white_color,
  //                           fontFamily: Font.SemiBold,
  //                           fontSize: Font.regulartext_size,
  //                           textAlign: config.textRotate,
  //                         }}>
  //                         {Lang_chg.upcoming_heading[config.language]}
  //                       </Text>
  //                       <Text
  //                         style={{
  //                           color: Colors.gainsboro,

  //                           fontFamily: Font.Regular,
  //                           fontSize: Font.sregulartext_size,
  //                           textAlign: config.textRotate,
  //                           marginVertical: (mobileW * 1) / 100,
  //                           marginBottom: (mobileW * 4) / 100,
  //                         }}>
  //                         {Lang_chg.upcoming_text[config.language]}
  //                       </Text>
  //                     </View>
  //                     <View style={{ width: '12%', alignSelf: 'center' }}>
  //                       <Image
  //                         style={{
  //                           tintColor: Colors.arrowcolor,
  //                           alignSelf: 'center',
  //                           resizeMode: 'contain',
  //                           width: (mobileW * 3.5) / 100,
  //                           height: (mobileW * 3.5) / 100,
  //                           marginBottom: (mobileW * 2) / 100,
  //                         }}
  //                         source={config.textalign == 'right' ? Icons.arabic_next : Icons.RightArrow}></Image>

  //                     </View>
  //                   </View>
  //                 </TouchableOpacity> */}

  //                 <DrawerSubMenu
  //                   iconImage={Icons.PriceListArt}
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('PriceListtab')
  //                     // , { title: Lang_chg.upcoming_heading[config.language], api_status: 0 });
  //                   }}
  //                   menuTitle={(this.state.user_type == 'lab') ? Lang_chg.packagelist_heading[config.language] : Lang_chg.pricelist_heading[config.language]}
  //                   menuSubtitle={(this.state.user_type == 'lab') ? Lang_chg.packagelist_subheading[config.language] : Lang_chg.MyAppointmentsSub[config.language]}
  //                   isBorderBottom={true}
  //                 />

  //                 <DrawerSubMenu
  //                   iconImage={Icons.calender2}
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('AvailabilityScheduletab')
  //                     // { title: Lang_chg.upcoming_heading[config.language], api_status: 0 });
  //                   }}
  //                   menuTitle={Lang_chg.scheduleavailability_heading[config.language]}
  //                   menuSubtitle={Lang_chg.scheduleavailabilitysub_heading[config.language]}
  //                   isBorderBottom={false}
  //                 />
  //                 {/* <TouchableOpacity
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('Show_other_appoinment', { title: Lang_chg.ongoing_heading[config.language], api_status: 1 });
  //                   }}
  //                   style={{
  //                     flexDirection: 'row',
  //                     paddingTop: (mobileW * 4) / 100,

  //                   }}>
  //                   <View style={{ width: '15%' }}>
  //                     <Image
  //                       style={Styles.drawercardicon}
  //                       source={Icons.calender}></Image>
  //                   </View>
  //                   <View
  //                     style={{
  //                       width: '85%',
  //                       flexDirection: 'row',
  //                       borderBottomWidth: 1,
  //                       borderColor: Colors.drawerblue,
  //                       marginLeft: mobileW * 1 / 100,
  //                       justifyContent: 'space-between'
  //                     }}>
  //                     <View style={{ width: '83%', }} >
  //                       <Text
  //                         style={{
  //                           color: Colors.white_color,
  //                           fontFamily: Font.SemiBold,
  //                           fontSize: Font.regulartext_size,
  //                           textAlign: config.textRotate,
  //                         }}>
  //                         {Lang_chg.ongoing_heading[config.language]}
  //                       </Text>
  //                       <Text
  //                         style={{
  //                           color: Colors.gainsboro,
  //                           fontFamily: Font.Regular,
  //                           fontSize: Font.sregulartext_size,
  //                           textAlign: config.textRotate,
  //                           marginVertical: (mobileW * 1) / 100,
  //                           marginBottom: (mobileW * 4) / 100,
  //                         }}>
  //                         {Lang_chg.ongoing_text[config.language]}
  //                       </Text>
  //                     </View>
  //                     <View style={{ width: '12%', alignSelf: 'center' }}>
  //                       <Image
  //                         style={{
  //                           tintColor: Colors.arrowcolor,
  //                           alignSelf: 'center',
  //                           resizeMode: 'contain',
  //                           width: (mobileW * 3.5) / 100,
  //                           height: (mobileW * 3.5) / 100,
  //                           marginBottom: (mobileW * 2) / 100,
  //                         }}
  //                         source={config.textalign == 'right' ? Icons.arabic_next : Icons.RightArrow}></Image>
  //                     </View>
  //                   </View>
  //                 </TouchableOpacity>

  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                       this.props.navigation.navigate('Show_other_appoinment', { title: Lang_chg.past_heading[config.language], api_status: 2 });
  //                   }}
  //                   style={{
  //                     flexDirection: 'row',
  //                     paddingTop: (mobileW * 4) / 100,
  //                   }}>
  //                   <View style={{ width: '15%' }}>
  //                     <Image
  //                       style={Styles.drawercardicon}
  //                       source={Icons.calender2}></Image>
  //                   </View>
  //                   <View
  //                     style={{
  //                       width: '85%',
  //                       flexDirection: 'row',
  //                       marginLeft: mobileW * 1 / 100,
  //                       justifyContent: 'space-between',
  //                       // borderBottomWidth: (mobileW * 0.4) / 100,
  //                       borderColor: Colors.drawerblue,
  //                     }}>
  //                     <View >
  //                       <Text
  //                         style={{
  //                           color: Colors.white_color,
  //                           fontFamily: Font.SemiBold,
  //                           fontSize: Font.regulartext_size,
  //                           textAlign: config.textRotate,
  //                         }}>
  //                         {Lang_chg.past_heading[config.language]}
  //                       </Text>
  //                       <Text
  //                         style={{
  //                           color: Colors.gainsboro,
  //                           fontFamily: Font.Regular,
  //                           fontSize: Font.sregulartext_size,
  //                           textAlign: config.textRotate,
  //                           marginVertical: (mobileW * 1) / 100,
  //                           marginBottom: (mobileW * 4) / 100,
  //                         }}>
  //                         {Lang_chg.past_text[config.language]}
  //                       </Text>
  //                     </View>
  //                     <View style={{ width: '12%', alignSelf: 'center' }}>
  //                       <Image
  //                         style={{
  //                           tintColor: Colors.arrowcolor,
  //                           alignSelf: 'center',
  //                           resizeMode: 'contain',
  //                           width: (mobileW * 3.5) / 100,
  //                           height: (mobileW * 3.5) / 100,
  //                           marginBottom: (mobileW * 2) / 100,
  //                         }}
  //                         source={config.textalign == 'right' ? Icons.arabic_next : Icons.RightArrow}></Image>
  //                     </View>
  //                   </View>
  //                 </TouchableOpacity> */}
  //               </View>
  //             </View>
  //           </View>

  //           <Text
  //             style={{
  //               marginVertical: (mobileW * 1) / 100,
  //               marginBottom: (mobileW * 2) / 100,
  //               color: Colors.white_color,
  //               fontFamily: Font.Medium,
  //               fontSize: Font.headingfont,
  //               textAlign: config.textRotate,
  //             }}>
  //             {Lang_chg.acccount$more_heading[config.language]}
  //           </Text>

  //           {/* --------------------------------------------------------account */}

  //           <View
  //             style={{
  //               borderWidth: 1,
  //               borderColor: Colors.drawerblue,
  //               borderRadius: (mobileW * 3) / 100,
  //             }}>
  //             <View
  //               style={{
  //                 width: '95%',
  //                 alignSelf: 'center',
  //                 alignItems: 'center',
  //               }}>
  //               {/* <TouchableOpacity
  //                 onPress={() => {
  //                   this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                     this.props.navigation.navigate('Editprofile');
  //                 }}
  //                 style={{
  //                   // backgroundColor:'red',
  //                   flexDirection: 'row',
  //                   paddingTop: (mobileW * 1) / 100,
  //                   alignItems: 'center',
  //                 }}>
  //                 <View style={{ width: '15%' }}>
  //                   <Image
  //                     style={Styles.drawercardicon}
  //                     source={Icons.setting}></Image>
  //                 </View>
  //                 <View
  //                   style={{
  //                     alignItems: 'center',
  //                     width: '85%',
  //                     flexDirection: 'row',
  //                     marginLeft: mobileW * 1 / 100,
  //                     borderBottomWidth: 1,
  //                     borderColor: Colors.drawerblue,
  //                     paddingVertical: (mobileW * 4) / 100,
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{ width: '83%', }} >
  //                     <Text
  //                       style={{
  //                         color: Colors.white_color,
  //                         fontFamily: Font.Medium,
  //                         fontSize: Font.headingfont_booking,
  //                         textAlign: config.textRotate,
  //                       }}>
  //                       {Lang_chg.acccountsetting_heading[config.language]}
  //                     </Text>
  //                   </View>
  //                   <View style={{ width: '12%', alignSelf: 'center' }}>
  //                     <Image
  //                       style={{
  //                         tintColor: Colors.arrowcolor,
  //                         alignSelf: 'center',
  //                         resizeMode: 'contain',
  //                         width: (mobileW * 3.5) / 100,
  //                         height: (mobileW * 3.5) / 100,
  //                       }}
  //                       source={config.textalign == 'right' ? Icons.arabic_next : Icons.RightArrow}></Image>
  //                   </View>
  //                 </View>
  //               </TouchableOpacity> */}

  //               <DrawerSubMenu
  //                 iconImage={Icons.setting}
  //                 onPress={() => {
  //                   this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                     this.props.navigation.navigate('MyProfile');
  //                 }}
  //                 menuTitle={Lang_chg.profilesetting_heading[config.language]}
  //                 //menuSubtitle={Lang_chg.past_text[config.language]}
  //                 isBorderBottom={true}
  //               />

  //               <DrawerSubMenu
  //                 iconImage={Icons.transactionhistory}
  //                 onPress={() => {
  //                   this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                     this.props.navigation.navigate('Transactiontab');
  //                 }}
  //                 menuTitle={Lang_chg.transactionhistory_heading[config.language]}
  //                 //menuSubtitle={Lang_chg.past_text[config.language]}
  //                 isBorderBottom={true}
  //               />

  //               <DrawerSubMenu
  //                 iconImage={Icons.reviewrating}
  //                 onPress={() => {
  //                   this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                     this.props.navigation.navigate('ReviewRating');
  //                 }}
  //                 menuTitle={Lang_chg.reviewrating_heading[config.language]}
  //                 //menuSubtitle={Lang_chg.past_text[config.language]}
  //                 isBorderBottom={true}
  //               />

  //               <DrawerSubMenu
  //                 iconImage={Icons.support}
  //                 onPress={() => {
  //                   this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                     this.props.navigation.navigate('More');
  //                 }}
  //                 menuTitle={Lang_chg.acccountsupport_heading[config.language]}
  //                 //menuSubtitle={Lang_chg.past_text[config.language]}
  //                 isBorderBottom={false}
  //               />

  //               {/* <TouchableOpacity activeOpacity={0.9} onPress={() => {
  //                 this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                   this.props.navigation.navigate('More');
  //               }}
  //                 style={{

  //                   flexDirection: 'row',
  //                   paddingTop: (mobileW * 1) / 100,
  //                   alignItems: 'center',
  //                 }}>
  //                 <View style={{ width: '15%' }}>
  //                   <Image
  //                     style={Styles.drawercardicon}
  //                     source={Icons.support}></Image>
  //                 </View>
  //                 <View
  //                   style={{
  //                     alignItems: 'center',
  //                     width: '85%',
  //                     flexDirection: 'row',
  //                     marginLeft: mobileW * 1 / 100,
  //                     paddingVertical: (mobileW * 4) / 100,
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{ width: '83%', }} >
  //                     <Text

  //                       style={{
  //                         color: Colors.white_color,
  //                         fontFamily: Font.SemiBold,
  //                         fontSize: Font.regulartext_size,
  //                         textAlign: config.textRotate
  //                       }}>
  //                       {Lang_chg.acccountsupport_heading[config.language]}
  //                     </Text>
  //                   </View>
  //                   <View style={{ width: '12%', alignSelf: 'center' }}>
  //                     <Image
  //                       style={{
  //                         tintColor: Colors.arrowcolor,
  //                         alignSelf: 'center',
  //                         resizeMode: 'contain',
  //                         width: (mobileW * 3.5) / 100,
  //                         height: (mobileW * 3.5) / 100,
  //                       }}
  //                       source={config.textalign == 'right' ? Icons.arabic_next : Icons.RightArrow}></Image>
  //                   </View>
  //                 </View>
  //               </TouchableOpacity> */}
  //             </View>
  //           </View>

  //           {/* Logout */}
  //           <TouchableOpacity
  //             onPress={() => {
  //               this.props.navigation.dispatch(DrawerActions.closeDrawer()),
  //                 this.setState({ modalVisible3: true })
  //             }}
  //             style={{
  //               borderWidth: 1,
  //               borderColor: Colors.drawerblue,
  //               borderRadius: (mobileW * 2) / 100,
  //               marginTop: (mobileW * 4) / 100,
  //             }}>
  //             <View style={{ width: '95%', alignSelf: 'center' }}>
  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   paddingVertical: (mobileW * 2) / 100,
  //                   justifyContent: 'center',
  //                   alignItems: 'center',
  //                 }}>
  //                 <View style={{ width: '15%' }}>
  //                   {config.language == 1 ?
  //                     <Image
  //                       style={Styles.drawercardicon}
  //                       source={Icons.logout_opp}></Image> :
  //                     <Image
  //                       style={Styles.drawercardicon}
  //                       source={Icons.logout}></Image>
  //                   }
  //                 </View>
  //                 <View
  //                   style={{
  //                     width: '85%',
  //                     flexDirection: 'row',
  //                     marginLeft: mobileW * 1 / 100,
  //                     borderColor: Colors.drawerblue,
  //                     paddingVertical: (mobileW * 3) / 100,
  //                   }}>

  //                   <Text
  //                     style={{
  //                       color: Colors.drawertextblue,
  //                       fontFamily: Font.Medium,
  //                       fontSize: Font.headingfont_booking,
  //                       textAlign: config.textRotate,
  //                     }}>
  //                     {Lang_chg.logout_text[config.language]}
  //                   </Text>

  //                 </View>
  //               </View>
  //             </View>
  //           </TouchableOpacity>

  //           {/* version */}
  //           {/* <Text
  //             style={{
  //               textAlign: 'center',
  //               color: Colors.drawertextblue,
  //               marginTop: (mobileW * 7) / 100,
  //             }}>
  //             {Lang_chg.drawerversion[config.language]}
  //           </Text> */}
  //           <Modal
  //             animationType="fade"
  //             transparent={true}
  //             visible={this.state.modalVisible3}

  //             onRequestClose={() => { this.setState({ modalVisible3: false }) }}>
  //             <TouchableOpacity activeOpacity={0.9} onPress={() => {
  //               this.setState({
  //                 // modalVisible3: false 
  //               })
  //             }} style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
  //               <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
  //                 networkActivityIndicatorVisible={true} />
  //               <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

  //                 <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

  //                   <View style={{ alignSelf: 'flex-start', width: mobileW * 50 / 100, paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row' }}>
  //                     <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={require('./icons/logo.png')}></Image>
  //                     <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{Lang_chg.Logout[config.language]}</Text>
  //                   </View>
  //                   <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 1 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>

  //                     <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 4 / 100, }}>{Lang_chg.logut_msg[config.language]}</Text>
  //                   </View>



  //                   <View style={{
  //                     flexDirection: 'row', justifyContent: 'space-around', width: '40%', paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 9 / 100,
  //                     alignSelf: 'flex-end', right: 10,
  //                   }}>
  //                     <TouchableOpacity onPress={() => { this.setState({ modalVisible3: false }) }}
  //                       style={{ height: mobileW * 10 / 100, width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
  //                       <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{Lang_chg.no_txt[config.language]}</Text>
  //                     </TouchableOpacity>

  //                     <TouchableOpacity onPress={() => { this.setState({ modalVisible3: false }), this.confirm_click() }}
  //                       activeOpacity={0.8}
  //                       style={{
  //                         // backgroundColor: 'red',
  //                         width: mobileW * 40 / 100,
  //                         height: mobileW * 10 / 100,
  //                         justifyContent: 'center'
  //                       }}>
  //                       <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{Lang_chg.Logout[config.language]}</Text>
  //                     </TouchableOpacity>
  //                   </View>

  //                 </View>

  //               </View>
  //             </TouchableOpacity>
  //           </Modal>
  //         </View>
  //       </ScrollView>
  //   );
  // }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: Colors.White, paddingBottom: Platform.OS === 'ios' ? vs(150) : vs(65), }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              // paddingHorizontal: s(15),
              paddingBottom: Platform.OS === 'ios' ? vs(16) : vs(16),
            }}
          >
            {/* user Profile */}
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('Editprofile');
                }, 350);
              }}
              activeOpacity={0.7}
              style={{ width: '100%', alignItems: "center", flexDirection: 'row', paddingTop: vs(20), height: vs(140), backgroundColor: Colors.White }}>

              <View style={{ width: '31%' }} >
                {
                  (this.state.profile_img == "NA" || this.state.profile_img == "" || this.state.profile_img == null) ?
                    <SvgXml xml={dummyUser} style={{
                      alignSelf: "center",
                    }} />
                    :
                    // <SvgUri uri={this.state.profile_img} />
                    <Image
                      source={{ uri: this.state.profile_img }}
                      style={{ height: s(85), width: s(85), borderRadius: s(85), backgroundColor: Colors.backgroundcolor, alignSelf: 'center' }}
                    />

                }
              </View>

              <View style={{ width: '69%' }} >

                <View style={{ width: '100%', flexDirection: 'row', }} >

                  <View style={{ width: '80%', justifyContent: 'center' }}>
                    <Text
                      style={{
                        color: Colors.Black,
                        fontFamily: Font.Medium,
                        fontSize: Font.xxxlarge,
                        textAlign: config.textRotate,

                      }}>
                      {this.state.name}
                    </Text>
                  </View>

                  <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <SvgXml xml={
                      config.textalign == "right"
                        ? leftArrow : rightArrow
                    } height={vs(11.98)} width={s(6.42)} />
                  </View>
                </View>

                <View style={{ width: '100%', }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      // this.props.navigation.dispatch(DrawerActions.toggleDrawer())
                      setTimeout(() => {
                        this.props.navigation.dispatch(DrawerActions.closeDrawer())
                        this.props.navigation.navigate('Editprofile');
                      }, 350);
                    }}>
                    <Text
                      style={{
                        color: Colors.Theme,
                        fontFamily: Font.Medium,
                        fontSize: Font.medium,
                        textAlign: config.textRotate,
                        marginTop: vs(5)

                      }}>
                      {config.language == 0 ? 'View & edit profile' : 'عرض وتحرير الملف الشخصي'}
                    </Text>
                  </TouchableOpacity>

                  {
                    this.state.totalCompletionPercentage > 0 &&
                    <Text
                      style={{
                        color: Colors.DarkGrey,
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        textAlign: config.textRotate,
                        marginTop: vs(4)
                      }}>
                      {config.language == 0 ? `${this.state.totalCompletionPercentage}% Completed` : `${this.state.totalCompletionPercentage}٪ اكتمل`}
                    </Text>
                  }

                </View>
              </View>
            </TouchableOpacity>

            {/* Appoints and bookings section */}
            <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


            <View style={{ width: '100%', backgroundColor: Colors.White }}>

              <View style={{ paddingHorizontal: vs(19) }}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                    fontSize: 14,
                    textAlign: config.textRotate,
                  }}>
                  {'Appointment'}
                </Text>
              </View>

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.MyAppointment}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer()),
                    this.props.navigation.navigate('Appointmenttab')
                }}

                title={Lang_chg.MyAppointments[config.language]}
                subtitle={Lang_chg.MyAppointmentsSub[config.language]}

              />



              <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


              <View style={{ paddingHorizontal: vs(19) }}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                    fontSize: 14,
                    textAlign: config.textRotate,
                  }}>
                  {'Booking Preferences'}
                </Text>
              </View>

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.ScheduleAvailability}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('AvailabilityScheduletab')
                }}

                title={Lang_chg.scheduleavailability_heading[config.language]}
                subtitle={Lang_chg.scheduleavailabilitysub_heading[config.language]}

              />

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.PriceList}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('PriceListtab')
                }}

                title={Lang_chg.pricelist_heading[config.language]}
                subtitle={Lang_chg.pricelistsub_heading[config.language]}

              />

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.ServiceAddress}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('ServiceAddressF1')
                }}

                title={'Service Address'}
                subtitle={'Setup your pickup address'}
                disable

              />

              <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>

              <View style={{ paddingHorizontal: vs(19) }}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontFamily: Font.Medium,
                    fontSize: 14,
                    textAlign: config.textRotate,
                  }}>
                  {'Account & More'}
                </Text>
              </View>

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.ProfileSettings}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('MyProfile');
                }}

                title={'Profile Settings'}

              />

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.TransactionsAndMore}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('Transactiontab');
                }}

                title={'Transaction & More'}

              />

              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.ReviewAndRating}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('ReviewRating');
                }}

                title={'Review & Rating'}

              />
              <DrawerItemContainer
                rightIcon={
                  config.textalign == "right"
                    ? leftArrow : rightArrow
                }
                leftIcon={DrawerIcons.SupportAndMore}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.props.navigation.navigate('More');
                }}

                title={'Support & More'}

              />

              <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>

              <DrawerItemContainer
                leftIcon={DrawerIcons.Logout}

                onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                  this.setState({ modalVisible: false })
                  this.confirm_click()
                }}

                title={Lang_chg.Logout[config.language]}
                titleStyle={{
                  color: 'grey'
                }}
              />

              <View style={{ width: '92%', height: 0, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


            </View>



            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  // this.setState({ modalVisible3: false })
                }}
                style={{
                  backgroundColor: "#00000080",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  marginTop: -50,
                }}
              >

                <View
                  style={{
                    borderRadius: 20,
                    width: (windowWidth * 90) / 100,
                    position: "absolute",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "40%",
                        paddingBottom: (windowWidth * 5) / 100,
                        marginTop: (windowWidth * 9) / 100,
                        alignSelf: "flex-end",
                        right: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modalVisible: false }),
                            this.confirm_click();
                        }}
                        activeOpacity={0.8}
                        style={{
                          height: (windowWidth * 10) / 100,
                          width: (windowWidth * 40) / 100,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: (windowWidth * 4) / 100,
                            color: Colors.Blue,
                            alignSelf: "center",
                          }}
                        >
                          {Lang_chg.Logout[config.language]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
