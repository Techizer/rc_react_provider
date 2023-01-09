import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
// import Spinner from "react-native-spinkit";
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { color } from "react-native-reanimated";
// import { Color, Fonts } from "../utils";
// import { RF } from "../utils/responsive";
import moment from "moment-timezone";
import { Colors, Font, mobileH, config, mobileW, Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider, localStorage } from '../Provider/utilslib/Utils';
import { Icons } from "../icons/IReferences";
const AppointmentBox = ({
  item, onPressViewDetails, onPressAccept, onPressReject, onPressVideoCall,
  customStyles,
  onPress,
  rightIcon,
  infoIcon, imgStyle,
  onLoading,
  isMargin,
  isBorder,
}) => {
  const aDate = new Date(item.appointment_date)
  /* check video call button enable or not */
  var VideoCallBtn = false
  var appointmentDate = moment(item.app_date).format(
    "YYYY-MM-DD"
  );
  var CurrentDate = moment().unix(); //Wed, 19 Oct 2022
  var MyDate = moment(appointmentDate + " " + item.app_time, 'YYYY-MM-DD hh:mm A').unix();
  var MyEndDate = moment(appointmentDate + " 11:59 PM", 'YYYY-MM-DD hh:mm A').unix();
  // console.log('CurrentDate:: ', CurrentDate,
  //   'MyDate:: ', MyDate,
  //   '-- ', CurrentDate - MyDate
  // );

  if (CurrentDate < MyDate) {
    let diff = (MyDate - CurrentDate) / 60 //mins
    //console.log('CurrentDate < MyDate:: ', diff);
    if (diff <= 10) {
      VideoCallBtn = true
    }
  }
  else if (CurrentDate > MyDate) {
    // let diff = (CurrentDate - MyDate) / 60 //mins
    // console.log('CurrentDate > MyDate:: ', diff);
    // if (diff < 16) {
    //   VideoCallBtn = true
    // }
    VideoCallBtn = true
  }
  // if (MyEndDate > MyDate) {
  //   VideoCallBtn = true
  // }
  if (CurrentDate > MyEndDate) {
    VideoCallBtn = false
  }
  /* check video call button enable or not */
  return (
    <>
      <View

        style={{
          marginTop: mobileW * 3 / 100,
          backgroundColor: '#fff',
          // shadowOpacity: 0.3,
          // shadowColor: '#000',
          // shadowOffset: { width: 1, height: 1 },
          // elevation: 5,
          // shadowRadius: 2,

          // shadowColor: '#171717',
          // shadowOffset: { width: -2, height: 4 },
          // shadowOpacity: 0.3,
          // shadowRadius: 3,

        }}>
        <View style={{ width: '98%', alignSelf: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%', alignSelf: 'center',
              padding: (mobileW * 2) / 100,
              // justifyContent: 'space-between',
            }}>
            {/* image and store name */}

            <View style={{ width: '42%' }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  color: Colors.theme_color,
                  textAlign: config.textRotate,
                  textTransform: 'uppercase',
                }}>{item.service_type}

              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 2) / 100,
                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate
                }}>
                {item.provider_name}
              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 1) / 100,
                  fontFamily: Font.Regular,
                  fontSize: Font.sregulartext_size,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate
                }}>
                {item.speciality}
              </Text>
              <View
                style={{
                  marginTop: (mobileW * 2) / 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.sregulartext_size,
                    color: Colors.theme_color,
                    textAlign: config.textRotate
                  }}>{Lang_chg.Patient[config.language]}

                </Text>
                <Image
                  source={Icons.OptionMenuFilled}
                  style={{
                    width: 25,
                    height: 13,
                    resizeMode: 'contain',
                    marginLeft: mobileW * 1.5 / 100,
                  }}></Image>
              </View>
              <Text
                style={{

                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  marginTop: (mobileW * 1) / 100,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate,
                  width: '80%'
                }} numberOfLines={1} >
                {item.patient_name}
              </Text>
              <View
                style={{
                  marginTop: (mobileW * 2.8) / 100,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.sregulartext_size,
                    color: Colors.darkgraytextheading,
                    textAlign: config.textRotate
                  }}>{Lang_chg.Booked[config.language]}

                </Text>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.sregulartext_size,
                    color: Colors.darkgraytextheading,
                    textAlign: config.textRotate,
                    textTransform: 'uppercase',
                    marginLeft: mobileW * 1.5 / 100
                  }}>
                  {item.booking_date}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '36%',

              }}>
              <Text
                style={{
                  fontFamily: Font.Medium,
                  fontSize: (mobileW * 3.4) / 100,
                  color: Colors.theme_color,
                  textAlign: config.textRotate
                }}>
                {item.order_id}
              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 1) / 100,
                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate
                }}>
                {Lang_chg.Appointment_footer[config.language]}
              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 1) / 100,
                  fontFamily: Font.Medium,
                  color: Colors.theme_color,
                  fontSize: Font.sregulartext_size,
                  textAlign: config.textRotate
                }}>
                {Lang_chg.Date[config.language]}
              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 1) / 100,
                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate,
                  textTransform: 'uppercase',
                }}>
                {item.app_date}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileW * 2) / 100,
                  paddingVertical: (mobileW * 0.5) / 100,
                  paddingHorizontal: (mobileW * 1) / 100,
                  borderWidth: 1,
                  borderRadius: mobileW * 1 / 100,
                  borderColor: Colors.theme_color,
                  alignSelf: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: Font.Medium,
                    fontSize: Font.sregulartext_size,
                    color: Colors.theme_color,
                  }}>
                  {item.task_type}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: '22%',


              }}>
              <View style={{
                borderRadius: mobileW * 0.5 / 100, width: '100%', alignItems: 'center', paddingVertical: mobileW * 1 / 100, backgroundColor:
                  item.acceptance_status == 'Rejected'
                    ? '#FF4500'
                    : item.acceptance_status == 'Pending'
                      ? Colors.gold
                      : Colors.buttoncolorhgreen
              }}>


                <Text style={{
                  color: '#FCFFFE', fontFamily: Font.Medium,
                  fontSize: mobileW * 2.7 / 100, textAlign: 'center', textTransform: 'uppercase'

                }}>
                  {item.acceptance_status}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: (mobileW * 6.5) / 100,
                  fontFamily: Font.Medium,
                  color: Colors.theme_color,
                  fontSize: Font.sregulartext_size,
                  textAlign: config.textRotate
                }}>{Lang_chg.Time[config.language]}

              </Text>
              <Text
                style={{
                  paddingTop: (mobileW * 1) / 100,
                  fontFamily: Font.Medium,
                  fontSize: Font.sregulartext_size,
                  color: Colors.darkgraytextheading,
                  textAlign: config.textRotate
                }}>
                {item.app_time}
              </Text>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  paddingVertical: (mobileW * 2) / 100,
                  borderRadius: (mobileW * 1) / 100,
                  alignItems: 'center',
                }}>
                {config.language == 0 ?
                  <Image
                    source={Icons.Clock}
                    style={{
                      tintColor: Colors.theme_color,
                      resizeMode: 'contain',
                      width: (mobileW * 3.5) / 100,
                      height: (mobileW * 3.5) / 100,
                    }}></Image> :
                  <Image
                    source={Icons.ClockRTLFilled}
                    style={{
                      tintColor: Colors.theme_color,
                      resizeMode: 'contain',
                      width: (mobileW * 3.5) / 100,
                      height: (mobileW * 3.5) / 100,
                    }}></Image>
                }

                <Text
                  style={{
                    color: Colors.theme_color,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 3) / 100,
                    marginLeft: mobileW * 1 / 100,
                    textAlign: config.textRotate
                  }}>

                  {item.task_time}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              paddingVertical: (mobileW * 1.5) / 100,
              borderTopWidth: (mobileW * 0.3) / 100,
              borderColor: Colors.bordercolor,
              width: '95%', alignItems: 'center',
              alignSelf: 'center',
            }}>

            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: '35%',
                paddingVertical: (mobileW * 1.5) / 100,
              }}>
              {config.language == 0 ?
                <Image
                  source={Icons.Wallet}
                  style={{
                    resizeMode: 'contain',
                    width: 15,
                    height: 15,

                  }}></Image> :
                <Image
                  source={Icons.Wallet_arbic}
                  style={{
                    resizeMode: 'contain',
                    width: 15,
                    height: 15,
                  }}></Image>
              }
              <Text
                style={{
                  color: Colors.theme_color,
                  fontSize: (mobileW * 3.7) / 100,
                  fontFamily: Font.Medium,
                  alignSelf: 'center',
                  marginLeft: mobileW * 1 / 100,
                  marginTop: 0.5
                }}>

                {item.price}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                flexDirection: 'row',

                width: '65%',
                justifyContent: 'flex-end',
                paddingVertical: (mobileW * 1.5) / 100,

              }}>

              {(item.acceptance_status == 'Accepted' &&
                item.service_type == "Doctor" &&
                item.appointment_type === "Online" && VideoCallBtn == true) &&
                item.booking_type === 'online_task' &&
                <TouchableOpacity onPress={onPressVideoCall}
                  style={{
                    backgroundColor: Colors.buttoncolorhgreen,
                    width: '35%',
                    borderRadius: (mobileW * 1) / 100,
                    justifyContent: 'center',
                    paddingVertical: mobileW * 2 / 100,
                    marginRight: 10
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.white_color,
                      textTransform: 'uppercase',
                      fontFamily: Font.Medium,
                      fontSize: mobileW * 3 / 100,
                    }}>VIDEO CALL</Text>
                </TouchableOpacity>

              }

              {item.acceptance_status == 'Pending' ?
                <TouchableOpacity
                  // onPress={() => { this.rescdule_click(), this.get_day(), this.setState({ order_id: item.id, service_status: item.provider_type, send_id: item.provider_id, time_take_data: '', }) }}
                  onPress={onPressAccept}
                  style={{
                    backgroundColor: Colors.buttoncolorhgreen,
                    width: '35%',
                    borderRadius: (mobileW * 1) / 100,
                    justifyContent: 'center',
                    paddingVertical: mobileW * 2 / 100,
                    marginRight: 10
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.white_color,
                      textTransform: 'uppercase',
                      fontFamily: Font.Medium,
                      fontSize: mobileW * 3 / 100,
                    }}>Accept</Text>
                </TouchableOpacity> :
                (item.acceptance_status == 'Accepted' &&
                  item.service_type == "Doctor" && item.appointment_type == "Online") ? null :
                  <View style={{ width: '28%' }}>
                  </View>
              }

              <TouchableOpacity
                onPress={onPressViewDetails}
                // onPress={() => {
                //   this.props.navigation.navigate('Appointmentdetails',
                //     { status: item.provider_type, appoinment_id: item.id, send_id: item.provider_id })
                // }}
                style={{
                  backgroundColor: Colors.lbluebtn,
                  width: '45%',
                  borderRadius: (mobileW * 1) / 100,
                  justifyContent: 'center',
                  paddingVertical: mobileW * 2 / 100,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    color: Colors.white_color,
                    //  paddingHorizontal: (mobileW * 2) / 100,
                    fontFamily: Font.Medium,
                    fontSize: mobileW * 3 / 100,
                  }}>{Lang_chg.VIEWDETAILS[config.language]}

                </Text>
              </TouchableOpacity>

              {item.acceptance_status == 'Pending' ?
                <TouchableOpacity
                  onPress={onPressReject}
                  style={{
                    width: '10%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginLeft: 10
                  }}>
                  <Image
                    source={Icons.Cross}
                    style={{
                      width: mobileW * 6 / 100,
                      height: mobileW * 6 / 100,
                    }}
                  />
                </TouchableOpacity> : null}
            </View>

          </View>
        </View>
      </View>
    </>
  );
};
AppointmentBox.defaultProps = { customStyles: {} };

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: 190,
    // alignSelf: 'center',
    // borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.white_color,
    // paddingVertical: (mobileW * 4) / 100,
    marginTop: 10, //(mobileW * 1) / 100,

  },
  mainContainer1: {
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.bordercolorblue,
    borderWidth: 2,
    borderRadius: (mobileW * 2) / 100,
    backgroundColor: Colors.buttoncolorlight,
    paddingVertical: (mobileW * 3) / 100,
    marginTop: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  buttonText: {
    color: Colors.textwhite,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  buttonText1: {
    color: Colors.textblue,
    fontFamily: Font.Medium,
    fontSize: Font.buttontextsize,
    textAlign: config.textalign,
    alignSelf: 'center',
  },
  img: {
    // width: 130,
    // height: 106,
    width: (mobileW * 33) / 100,
    height: (mobileW * 33) / 100,
    // marginRight: 10,
  },
  imgR: {
    width: (mobileW * 6.3) / 100,
    height: (mobileW * 6.3) / 100,
    // marginRight: 10,
  },
});

export default AppointmentBox;
