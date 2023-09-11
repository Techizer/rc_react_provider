import { Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Font, Configurations, mobileW, API, MessageFunctions, MessageHeadings } from '../Helpers/Utils';
import Styles from '../Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DashBoardBox } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { vs } from 'react-native-size-matters';
import { setProfileData } from '../Redux/Actions/UserActions';

export default MyProfile = ({ navigation, route }) => {

  const {
    loginUserData,
    profileData
  } = useSelector(state => state.StorageReducer)

  const [notificationsCount, setNotificationsCount] = useState(0)

  const dispatch = useDispatch()

  console.log({ profileData });

  useEffect(() => {
    navigation.addListener('focus', () => {
      getProfile()
      getNotificationsCount()
    });
  }, [])

  const getNotificationsCount = async () => {
    let url = Configurations.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', loginUserData['user_id'])


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        setNotificationsCount(obj?.result)
      } else {
        return false;
      }
    }).catch((error) => {

      console.log("-------- error nc------- " + error);
    })

  }

  const getProfile = async () => {
    let url = Configurations.baseURL + "api-get-provider-profile";
    console.log("url", url)
    var data = new FormData();
    data.append('id', loginUserData['user_id'])
    data.append('service_type', loginUserData['user_type'])

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        dispatch(setProfileData({ ...obj?.result }))
      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);
        return false;
      }
    }).catch((error) => {
      console.log("-------- error gp------- ", error)
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

      <View style={{ flex: 1, }}>

        <ScreenHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          leftIcon
          rightIcon={true}
          navigation={navigation}
          notiCount={notificationsCount > 0 ? notificationsCount : false}
          title={'My Profile'}
        />
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
                    source={profileData?.image == 'NA' ||
                      profileData?.image == null ||
                      profileData?.image == 'null' ||
                      profileData?.image == '' ? Icons.ProfileImage :
                      { uri: Configurations.img_url3 + profileData?.image }}
                  ></Image>
                </View>
              </View>

              <View style={{ width: '70%', alignSelf: 'center', }}>
                <View style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    color: Colors.placeholder_text_color,
                    fontFamily: Font.Medium, fontSize: 18,
                    textAlign: Configurations.textRotate,
                    width: '75%'
                  }}>{profileData?.first_name}</Text>
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
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <Image
                      style={{
                        width: (mobileW * 3.2) / 100,
                        height: (mobileW * 3.2) / 100,
                        marginRight: (mobileW * 1.5) / 100
                      }}
                      source={Icons.EditIcon}
                    ></Image>
                    <Text style={{
                      color: Colors.textblue,
                      fontFamily: Font.Regular, fontSize: 12,
                    }}>Edit</Text>
                  </TouchableOpacity>
                </View>
                {(profileData.speciality != 'null' && profileData?.speciality != null && profileData?.speciality != '') &&
                  <View style={{ width: '100%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                    <Text
                      style={{
                        color: Colors.textblue,
                        fontFamily: Font.Regular,
                        fontSize: 14,
                        textAlign: Configurations.textRotate,
                      }}>{profileData?.speciality}</Text>
                  </View>
                }
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
                        fontSize: 12,
                        textAlign: Configurations.textRotate,
                        paddingHorizontal: 8

                      }}>{profileData?.email}</Text>
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
                        fontSize: 12,
                        textAlign: Configurations.textRotate,
                        paddingHorizontal: 8
                      }}>{profileData?.phone_number}</Text>
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
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: '#DFDFDF',
                paddingBottom: 17
              }}>
                <View style={{
                  width: '32%',
                  justifyContent: 'center',
                  borderRightWidth: 1,
                  borderRightColor: '#DFDFDF',
                }}>
                  <Text
                    style={{
                      color: Colors.placeholder_textcolorlight,
                      fontFamily: Font.Regular,
                      fontSize: 12,
                      textAlign: Configurations.textRotate,
                    }}>{(profileData?.user_type == "lab") ? 'Established' : 'Experience'}
                  </Text>
                  <Text
                    style={{
                      marginTop: (mobileW * 2) / 100,
                      color: Colors.lightgraytext,
                      fontFamily: Font.Medium,
                      fontSize: 16,
                      textAlign: Configurations.textRotate,
                    }}>{profileData?.user_type == "lab" ? `${profileData?.experience}` : `${profileData?.experience} YR`}
                  </Text>
                </View>
                <View style={{
                  width: '32%',
                  justifyContent: 'center',
                  borderRightWidth: 1,
                  borderRightColor: '#DFDFDF',
                  paddingLeft: 15
                }}>
                  <Text
                    style={{
                      color: Colors.placeholder_textcolorlight,
                      fontFamily: Font.Regular,
                      fontSize: 12,
                      textAlign: Configurations.textRotate,
                    }}>{(profileData?.user_type == "lab") ? 'Bookings' : 'Bookings'}
                  </Text>
                  <Text
                    style={{
                      marginTop: (mobileW * 2) / 100,
                      color: Colors.lightgraytext,
                      fontFamily: Font.Medium,
                      fontSize: 16,
                      textAlign: Configurations.textRotate,
                    }}>
                    {profileData?.booking_count}
                  </Text>
                </View>
                <View style={{
                  width: '32%',
                  justifyContent: 'center',
                  paddingLeft: 15
                }}>
                  <Text
                    style={{
                      color: Colors.placeholder_textcolorlight,
                      fontFamily: Font.Regular,
                      fontSize: 12,
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
                        fontSize: 16,
                        textAlign: Configurations.textRotate,
                      }}>{parseFloat(profileData?.avg_rating).toFixed(1)}
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
                width: '100%',
              }}>
                <Text style={[Styles.textcontent, {
                  fontSize: mobileW * 3 / 100,
                  color: Colors.lightgraytext
                }]}>{profileData?.description}</Text>
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
              (profileData?.user_type == "lab") ?
                <>

                  {(profileData?.hosp_moh_lic_no != null && profileData?.hosp_moh_lic_no != 'null' && profileData?.hosp_moh_lic_no != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Health Registration ID</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.hosp_moh_lic_no}</Text>
                      </View>
                    </View>
                  }
                  {(profileData?.hosp_reg_no != null && profileData?.hosp_reg_no != 'null' && profileData?.hosp_reg_no != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Registration Number</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.hosp_reg_no}</Text>
                      </View>
                    </View>
                  }

                </> :
                <>


                  {(profileData?.speciality != null && profileData?.speciality != 'null' && profileData?.speciality != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Speciality</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.speciality}</Text>
                      </View>
                    </View>
                  }

                  {(profileData?.id_number != null && profileData?.id_number != 'null' && profileData?.id_number != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Identity Number</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.id_number}</Text>
                      </View>
                    </View>
                  }

                  {(profileData?.qualification != null && profileData?.qualification != 'null' && profileData?.qualification != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Qualification</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.qualification}</Text>
                      </View>
                    </View>
                  }

                  {(profileData?.scfhs_number != null && profileData?.scfhs_number != 'null' && profileData?.scfhs_number != '') &&
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Health Registration ID</Text>
                      </View>
                      <View style={{
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{profileData?.scfhs_number}</Text>
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
            }}>
              {
                (profileData?.user_type == "lab") ?
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <>
                      {(profileData?.hosp_moh_lic_no != '' && profileData?.hosp_moh_lic_no != null && profileData?.hosp_moh_lic_no != 'null') && <View style={{
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
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={profileData?.moh_lic_image == 'NA' ||
                            profileData?.moh_lic_image == null ||
                            profileData?.moh_lic_image == '' ? Icons.Prescription :
                            { uri: Configurations.img_url3 + profileData?.moh_lic_image }}
                        ></Image>
                        <Text numberOfLines={1} style={{ color: Colors.Black }}>{profileData?.hosp_moh_lic_no}</Text>
                      </View>}

                      {(profileData?.hosp_reg_no != '' && profileData?.hosp_reg_no != null && profileData?.hosp_reg_no != 'null') && <View style={{
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
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={(profileData?.hosp_reg_image == 'NA' ||
                            profileData?.hosp_reg_image == null ||
                            profileData?.hosp_reg_image == '') ? Icons.Prescription :
                            { uri: Configurations.img_url3 + profileData?.hosp_reg_image }}
                        ></Image>
                        <Text numberOfLines={1} style={{ color: Colors.Black }}>{profileData?.hosp_reg_no}</Text>
                      </View>}
                    </>
                  </ScrollView> :
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <>
                      {(profileData?.id_number != '') && (profileData?.id_number != null) && (profileData?.id_number != 'null') &&
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginRight: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={(profileData?.id_image == null || profileData?.id_image == 'null' || profileData?.id_image == '' || profileData?.id_image == 'NA') ? Icons.Prescription : { uri: Configurations.img_url3 + profileData?.id_image }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{profileData?.id_number}</Text>
                        </View>
                      }
                      {(profileData?.qualification != '') && (profileData?.qualification != null) && (profileData?.qualification != 'null') &&
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginRight: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={profileData?.qualification_certificate == 'NA' ||
                              profileData?.qualification_certificate == null ||
                              profileData?.qualification_certificate == 'null' ||
                              profileData?.qualification_certificate == '' ? Icons.Prescription :
                              { uri: Configurations.img_url3 + profileData?.qualification_certificate }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{profileData?.qualification}</Text>
                        </View>
                      }
                      {(profileData?.scfhs_number != '' && profileData?.scfhs_number != null && profileData?.scfhs_number != 'null') &&
                        <View style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 8,
                          borderColor: '#DFDFDF',
                          borderWidth: 1,
                          borderRadius: 10,
                          marginRight: 10
                        }}>
                          <Image
                            style={{
                              width: (mobileW * 20) / 100,
                              height: (mobileW * 20) / 100,
                              marginBottom: 10,
                              alignSelf: 'center',

                            }}
                            source={(profileData?.scfhs_image == 'NA' ||
                              profileData?.scfhs_image == null ||
                              profileData?.scfhs_image == 'null' ||
                              profileData?.scfhs_image == '') ? Icons.Prescription :
                              { uri: Configurations.img_url3 + profileData?.scfhs_image }}
                          ></Image>
                          <Text numberOfLines={1} style={{ color: Colors.Black }}>{profileData?.scfhs_number}</Text>
                        </View>}
                    </>
                  </ScrollView>
              }


            </View>
          </View>

          <DashBoardBox
            textTitle={'Schedule Availability'}
            infoIcon={''}
            rightText={"Edit"}
            isBorder={false}
            isMargin={true}
            onPress={() => {
              navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack);
            }}
          />
          <DashBoardBox
            textTitle={(profileData?.user_type == "lab") ? 'Tests & Packages' : 'Price List'}
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