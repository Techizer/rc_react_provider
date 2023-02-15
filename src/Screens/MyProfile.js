import { Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Font, Configurations, mobileW, API, MessageFunctions, MessageHeadings } from '../Helpers/Utils';
import Styles from '../Styles';
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DashBoardBox } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useSelector } from 'react-redux';
import { vs } from 'react-native-size-matters';

export default MyProfile = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    country_code: '',
    febtn: false,
    mabtn: false,
    allergies: 'No',
    workArea: '',
    smoking: '',
    alcohol: '',

    activity_level: '',
    food: '',
    occupation: '',
    occ_food_activity: 'activity',

    name: '',
    email: '',
    number: '',
    dob: '',
    nationality: '',
    address: '',
    id_number: '',


    injuries: '',
    chronic: '',
    blood_group: '',

    mobile: '',
    profile_img: 'NA',
    mediamodal: false,
    isDatePickerVisibletwo: false,
    dob_date: '',
    current_medication: 'No',
    chronic_diseases: 'No',
    surgeries: 'No',
    injuries: 'No',
    past_medication: 'No',
    past_medication_data: '',
    injuries_data: '',
    surgeries_data: '',
    current_medication_data: '',
    chronic_diseases_data: '',
    nationality: '',
    profile_image: '',
    notification_count: '',
    date_new: new Date(),
    mediamodal: false,
    id_image: '',
    certificate: '',
    scfhs_image: '',
  }, [])

  useEffect(() => {
    navigation.addListener('focus', () => {
      getProfile()

      // getNationalities()
      getNotificationsCount()

    });
  }, [])


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  const getNotificationsCount = async () => {
    let user_details = loginUserData
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        setState({ notification_count: obj.result })
        console.log('obj nationaltity', obj)

      } else {


        return false;
      }
    }).catch((error) => {

      console.log("-------- error ------- " + error);
    })

  }

  const setDate = (res) => {
    let check_month
    let check_date
    let date = res.getDate()
    let month = res.getMonth() + 1
    let year = res.getFullYear()
    if (month < 9) {
      check_month = '0' + month
    }
    else {
      check_month = month
    }
    if (date < 9) {
      check_date = '0' + date
    }
    else {
      check_date = date
    }
    let date1 = year + '-' + check_month + '-' + check_date
    setState({ date_new: new Date(date1) })
    setState({ dob_date: date1, isDatePickerVisibletwo: false, })
  }

  const getProfile = async () => {
    let user_details = loginUserData
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    let url = Configurations.baseURL + "api-get-provider-profile";
    console.log("url", url)
    var data = new FormData();
    data.append('id', user_id)
    data.append('service_type', user_type)



    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result123456', obj.result)

        let result = obj.result
        console.log('result.nationality',)
        setState({
          name: result['first_name'],
          email: result['email'],
          phone_number: result['phone_number'],
          emailfocusget: true,
          user_id: result['user_id'],
          user_type: result['user_type'],
          country_code: result['country_code'],
          workArea: result['workArea'],
          address: result['address'],
          description: result['description'],
          id_number: result['id_number'],
          speciality: result['speciality'],
          qualification: result['qualification'],
          experience: result['experience'],
          lab_test_count: result['lab_test_count'],
          scfhs_number: result['scfhs_number'],
          hosp_moh_lic_no: result['hosp_moh_lic_no'],
          hosp_reg_no: result['hosp_reg_no'],
          avg_rating: result['avg_rating'],
          booking_count: result['booking_count'],
          id_image: { filename: result['id_image'] },
          certificate: { filename: result['qualification_certificate'] },
          scfhs_image: { filename: result['scfhs_image'] },
          hosp_reg_image: { filename: result['hosp_reg_image'] },
          moh_lic_image: { filename: result['moh_lic_image'] },

        }, () => {
          console.log("id_image:: ", classStateData.id_image);
          console.log("certificate:: ", classStateData.certificate);
          console.log("scfhs_image:: ", classStateData.scfhs_image);
        })

        if (result['phone_number'] != null && result['phone_number'] != '') {
          setState({ mobile: result['phone_number'] })
        }
        if (result['address'] != null && result['address'] != '') {

        }

        if (result['dob'] != null && result['dob'] != '') {
          setState({ dob_date: result['dob'] })
        }

        if (result.nationality != null && result.nationality != '') {

          setState({ nationality: result['nationality'] })
        }
        if (result['gender'] != null && result['gender'] != '') {
          setState({
            gender: result['gender'],
            febtn: (result['gender'] == 'Female') ? true : false,
            mabtn: (result['gender'] == 'Male') ? true : false,
          })
        }
        if (result['smoking'] != null && result['smoking'] != '') {
          setState({ smoking: result['smoking'] })
        }
        if (result['blood_group'] != null) {
          setState({ blood_group: result['blood_group'] })
        }
        if (result['food_preference'] != null) {
          setState({ food: result['food_preference'] })
        }
        if (result['alcohol'] != null) {
          setState({ alcohol: result['alcohol'] })
        }
        if (result['occupation'] != null) {
          setState({ occupation: result['occupation'] })
        }
        if (result['activity_level'] != null) {
          setState({ activity_level: result['activity_level'] })
        }
        if (result['allergies_data'] != null && result['allergies_data'] != '') {
          setState({ allergies_data: result['allergies_data'] })
        }
        if (result['allergies'] != null && result['allergies'] != '') {
          setState({ allergies: result['allergies'] })
        }
        if (result['chronic_diseases'] != null && result['chronic_diseases'] != '') {
          setState({ chronic_diseases: result['chronic_diseases'] })
        }
        if (result['chronic_diseases_data'] != null && result['chronic_diseases_data'] != '') {
          setState({ chronic_diseases_data: result['chronic_diseases_data'] })
        }
        if (result['current_medication'] != null && result['current_medication'] != '') {
          setState({ current_medication: result['current_medication'] })
        }
        if (result['current_medication_data'] != null && result['current_medication_data'] != '') {
          setState({ current_medication_data: result['current_medication_data'] })
        }
        if (result['injuries'] != null && result['injuries'] != '') {
          setState({ injuries: result['injuries'] })
        }
        if (result['injuries_data'] != null && result['injuries_data'] != '') {
          setState({ injuries_data: result['injuries_data'] })
        }
        if (result['past_medication_data'] != null && result['past_medication_data'] != '') {
          setState({ past_medication_data: result['past_medication_data'] })
        }
        if (result['past_medication'] != null && result['past_medication'] != '') {
          setState({ past_medication: result['past_medication'] })
        }
        if (result['surgeries'] != null && result['surgeries'] != '') {
          setState({ surgeries: result['surgeries'] })
        }
        if (result['surgeries_data'] != null && result['surgeries_data'] != '') {
          setState({ surgeries_data: result['surgeries_data'] })
        }





        if (result.image != null) {
          setState({
            profile_img: Configurations.img_url3 + result['image'],
          })
        }

      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });
  }

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  return (
    <View style={{ flex: 1, }}>
      <SafeAreaView
        style={{ backgroundColor: Colors.statusbarcolor, flex: 0 }}
      />

      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.statusbarcolor}
        hidden={false}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />

      <DateTimePicker
        isVisible={classStateData.isDatePickerVisibletwo}
        mode="date"
        value={classStateData.date_new}
        maximumDate={new Date()}
        onConfirm={(date) => { setDate(date), setState({ isDatePickerVisibletwo: false }) }}
        onCancel={() => { setState({ isDatePickerVisibletwo: false }) }}
      />

      <View style={{ flex: 1, }}>

        <ScreenHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          leftIcon
          rightIcon={true}
          navigation={navigation}
          notiCount={classStateData.notification_count > 0 ? classStateData.notification_count : false}
          title={'My Profile'}
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

        <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: mobileW * 15 / 100 }} showsVerticalScrollIndicator={false}>
            <View style={{
              backgroundColor: 'white',
              marginTop: vs(1)
            }}>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 7) / 100,
                  flexDirection: 'row',

                }}>

                <View style={{ width: '28%', alignSelf: 'center' }}>
                  <View
                    style={{
                      width: (mobileW * 21) / 100,
                      height: (mobileW * 21) / 100,
                      borderRadius: (mobileW * 10.5) / 100,
                      borderWidth: 2.5,
                      borderColor: Colors.bordercolor_light_blue,

                      alignItems: 'center'
                    }}>
                    <Image
                      style={{
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 20) / 100,
                        borderRadius: mobileW * 10 / 100,

                        alignSelf: 'center',

                      }}
                      source={classStateData.profile_img == 'NA' ||
                        classStateData.profile_img == null ||
                        classStateData.profile_img == '' ? Icons.ProfileImage :
                        { uri: classStateData.profile_img }}
                    ></Image>
                  </View>
                </View>

                <View style={{ width: '70%', alignSelf: 'center', }}>
                  <View style={{
                    width: '100%', alignSelf: 'center',
                    flexDirection: 'row',
                    // backgroundColor: 'red',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      color: Colors.placeholder_text_color,
                      fontFamily: Font.Medium, fontSize: 18,
                      textAlign: Configurations.textRotate,
                    }}>{classStateData.name}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(ScreenReferences.EditProfile);
                      }}
                      style={{
                        flexDirection: 'row',
                        borderColor: '#E2E7EE',
                        borderWidth: 1,
                        borderRadius: 8,
                        width: (mobileW * 18) / 100,
                        height: (mobileW * 6.5) / 100,
                        // alignItems: 'flex-end'
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      <Image
                        style={{
                          width: (mobileW * 3.2) / 100,
                          height: (mobileW * 3.2) / 100,
                          marginRight: (mobileW * 1.5) / 100,
                          // borderRadius: mobileW * 10 / 100,
                          // alignSelf: 'center',
                        }}
                        source={Icons.EditIcon}
                      ></Image>
                      <Text style={{
                        color: Colors.textblue,
                        fontFamily: Font.Regular, fontSize: 12,
                      }}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: '100%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                    <Text
                      style={{
                        color: Colors.textblue,
                        fontFamily: Font.Regular,
                        fontSize: 14, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>{classStateData.speciality}</Text>
                  </View>

                  <View style={{
                    width: '100%',
                    marginTop: mobileW * 2 / 100,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <MaterialCommunityIcons
                        style={{
                        }}
                        name={"email-outline"}
                        size={(mobileW * 4.5) / 100}
                        color={Colors.placeholder_textcolorlight} />


                      <Text
                        style={{
                          color: Colors.placeholder_textcolorlight,
                          fontFamily: Font.Regular,
                          fontSize: 12, //(mobileW * 3) / 100,
                          textAlign: Configurations.textRotate,
                          paddingHorizontal: 8

                        }}>{classStateData.email}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 8
                    }}>
                      <Feather
                        style={{
                        }}
                        name={"phone"}
                        size={(mobileW * 4.5) / 100}
                        color={Colors.placeholder_textcolorlight} />
                      <Text
                        style={{
                          color: Colors.placeholder_textcolorlight,
                          fontFamily: Font.Regular,
                          fontSize: 12, //(mobileW * 3) / 100,
                          textAlign: Configurations.textRotate,
                          paddingHorizontal: 8
                        }}>{classStateData.phone_number}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{
                height: 45,
                marginTop: (mobileW * 10) / 100,
                paddingLeft: 20,
                paddingRight: 20
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor: 'red',
                  width: '100%',
                  borderBottomWidth: 1,
                  borderBottomColor: '#DFDFDF',
                  paddingBottom: 17
                }}>
                  <View style={{
                    width: '32%',
                    justifyContent: 'center',
                    // backgroundColor: 'blue',
                    borderRightWidth: 1,
                    borderRightColor: '#DFDFDF',
                  }}>
                    <Text
                      style={{
                        color: Colors.placeholder_textcolorlight,
                        fontFamily: Font.Regular,
                        fontSize: 12, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>{(classStateData.user_type == "lab") ? 'Established' : 'Experience'}
                    </Text>
                    <Text
                      style={{
                        marginTop: (mobileW * 2) / 100,
                        color: Colors.lightgraytext,
                        fontFamily: Font.Medium,
                        fontSize: 16, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>{classStateData.experience} {(classStateData.user_type == "lab") ? '' : 'YR'}
                    </Text>
                  </View>
                  <View style={{
                    width: '32%',
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderRightColor: '#DFDFDF',
                    paddingLeft: 15
                    // backgroundColor: 'blue'
                  }}>
                    <Text
                      style={{
                        color: Colors.placeholder_textcolorlight,
                        fontFamily: Font.Regular,
                        fontSize: 12, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>{(classStateData.user_type == "lab") ? 'Bookings' : 'Bookings'}
                    </Text>
                    <Text
                      style={{
                        marginTop: (mobileW * 2) / 100,
                        color: Colors.lightgraytext,
                        fontFamily: Font.Medium,
                        fontSize: 16, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>
                        {/* {(classStateData.user_type == "lab") ? ((classStateData?.lab_test_count != null && classStateData?.lab_test_count != 'N/A') ? classStateData?.lab_test_count: '0') : classStateData.booking_count} */}
                        {classStateData.booking_count}
                    </Text>
                  </View>
                  <View style={{
                    width: '32%',
                    justifyContent: 'center',
                    paddingLeft: 15
                    // backgroundColor: 'blue'
                  }}>
                    <Text
                      style={{
                        color: Colors.placeholder_textcolorlight,
                        fontFamily: Font.Regular,
                        fontSize: 12, //(mobileW * 3) / 100,
                        textAlign: Configurations.textRotate,
                      }}>Rating
                    </Text>
                    <View style={{
                      marginTop: (mobileW * 2) / 100,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <AntDesign
                        style={{
                          alignSelf: 'center',
                          marginRight: (mobileW * 1) / 100,
                        }}
                        name={"star"}
                        size={(mobileW * 4) / 100}
                        color={"#FFA800"} />
                      <Text
                        style={{
                          color: Colors.lightgraytext,
                          fontFamily: Font.Medium,
                          fontSize: 16, //(mobileW * 3) / 100,
                          textAlign: Configurations.textRotate,
                        }}>{parseFloat(classStateData.avg_rating).toFixed(1)}
                      </Text>
                    </View>

                  </View>
                </View>
              </View>

              <View style={{
                marginTop: (mobileW * 5) / 100,
                marginBottom: (mobileW * 5) / 100,
                paddingLeft: 20,
                paddingRight: 20
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // backgroundColor: 'red',
                  width: '100%',
                }}>
                  <Text style={[Styles.textcontent, {
                    fontSize: mobileW * 3 / 100,
                    color: Colors.lightgraytext
                  }]}>{classStateData.description}</Text>
                </View>
              </View>


            </View>

            <View style={{
              backgroundColor: 'white',
              marginTop: 10,
              padding: 20,
            }}>
              <Text style={Styles.textheading}>Important Details</Text>
              {
                (classStateData.user_type == "lab") ?
                  <>

                    {(classStateData.hosp_moh_lic_no != null && classStateData.hosp_moh_lic_no != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Health Registration ID</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData.hosp_moh_lic_no}</Text>
                        </View>
                      </View>
                    }
                    {(classStateData.hosp_reg_no != null && classStateData.hosp_reg_no != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Registration Number</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData.hosp_reg_no}</Text>
                        </View>
                      </View>
                    }

                  </> :
                  <>


                    {(classStateData.speciality != null && classStateData.speciality != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Speciality</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData.speciality}</Text>
                        </View>
                      </View>
                    }

                    {(classStateData.id_number != null && classStateData.id_number != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Identity Number</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData.id_number}</Text>
                        </View>
                      </View>
                    }

                    {(classStateData.qualification != null && classStateData.qualification != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Qualification</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData.qualification}</Text>
                        </View>
                      </View>
                    }

                    {(classStateData.scfhs_number != null && classStateData.scfhs_number != '') &&
                      <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between'
                      }}>
                        <View style={{
                          // backgroundColor: 'red'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.tabtextcolor
                          }}>Health Registration ID</Text>
                        </View>
                        <View style={{
                          // backgroundColor: 'blue'
                        }}>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: 14,
                            color: Colors.textblue
                          }}>{classStateData?.scfhs_number}</Text>
                        </View>
                      </View>
                    }

                  </>
              }
            </View>

            <View style={{
              backgroundColor: 'white',
              height: 200,
              marginTop: 10,
              padding: 20,
            }}>
              <Text style={Styles.textheading}>Document</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: 20,
                // justifyContent: 'space-between'
              }}>
                {
                  (classStateData.user_type == "lab") ?
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <>
                        {(classStateData.hosp_moh_lic_no != '' && classStateData.hosp_moh_lic_no != null) && <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginLeft: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              // borderRadius: mobileW * 10 / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={classStateData.moh_lic_image == 'NA' ||
                              classStateData.moh_lic_image == null ||
                              classStateData.moh_lic_image == '' ? Icons.Prescription :
                              { uri: Configurations.img_url3 + classStateData.moh_lic_image.filename }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{classStateData.hosp_moh_lic_no}</Text>
                        </View>}

                        {(classStateData.hosp_reg_no != '' && classStateData.hosp_reg_no != null) && <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginLeft: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              // borderRadius: mobileW * 10 / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={classStateData.hosp_reg_image == 'NA' ||
                              classStateData.hosp_reg_image == null ||
                              classStateData.hosp_reg_image == '' ? Icons.Prescription :
                              { uri: Configurations.img_url3 + classStateData.hosp_reg_image.filename }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{classStateData.hosp_reg_no}</Text>
                        </View>}
                      </>
                    </ScrollView> :
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <>
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              // borderRadius: mobileW * 10 / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={classStateData.id_image == 'NA' ||
                              classStateData.id_image == null ||
                              classStateData.id_image == '' ? Icons.Prescription :
                              { uri: Configurations.img_url3 + classStateData.id_image.filename }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{classStateData.id_number}</Text>
                        </View>

                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginLeft: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              // borderRadius: mobileW * 10 / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={classStateData.certificate == 'NA' ||
                              classStateData.certificate == null ||
                              classStateData.certificate == '' ? Icons.Prescription :
                              { uri: Configurations.img_url3 + classStateData.certificate.filename }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{classStateData.qualification}</Text>
                        </View>
                        {(classStateData.scfhs_number != '' && classStateData.scfhs_number != null) &&
                          <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                            borderColor: '#DFDFDF',
                            borderWidth: 1,
                            borderRadius: 10,
                            marginLeft: 10
                          }}>
                            <Image
                              style={{
                                width: (mobileW * 20) / 100,
                                height: (mobileW * 20) / 100,
                                // borderRadius: mobileW * 10 / 100,
                                marginBottom: 10,
                                alignSelf: 'center',

                              }}
                              source={classStateData.scfhs_image == 'NA' ||
                                classStateData.scfhs_image == null ||
                                classStateData.scfhs_image == '' ? Icons.Prescription :
                                { uri: Configurations.img_url3 + classStateData.scfhs_image.filename }}
                            ></Image>
                            <Text numberOfLines={1} style={{ color: Colors.Black }}>{classStateData.scfhs_number}</Text>
                          </View>}
                      </>
                    </ScrollView>
                }


              </View>
            </View>

            <DashBoardBox
              textTitle={'Schedule Availability'}
              // textInfo={item?.details}
              infoIcon={''}
              rightText={"Edit"}
              isBorder={false}
              isMargin={true}
              onPress={() => {
                navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack);
              }}
            />
            <DashBoardBox
              textTitle={(classStateData.user_type == "lab") ? 'Tests & Packages' : 'Price List'}
              // textInfo={item?.details}
              infoIcon={''}
              rightText={"Edit"}
              isBorder={true}
              isMargin={false}
              onPress={() => {
                navigation.navigate(ScreenReferences.PriceListTabStack);
              }}
            />

          </KeyboardAwareScrollView>
      </View>

    </View>
  );
}