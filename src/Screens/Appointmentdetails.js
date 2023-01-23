import React, { Component } from 'react';
import { Alert, Text, TextInput, View, ScrollView, Linking, SafeAreaView, Image, TouchableOpacity,  Modal, FlatList, PermissionsAndroid, Platform, Dimensions, StatusBar } from 'react-native';
import { CameraGallery, Media, Colors, Font, mobileH, MessageFunctions, MessageTexts, Configurations, mobileW, localStorage, LanguageConfiguration, API } from '../Helpers/Utils';
import StarRating from 'react-native-star-rating';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import getDirections from 'react-native-google-maps-directions'
import Slider from '@react-native-community/slider';
import moment from 'moment-timezone';
import RNFetchBlob from "rn-fetch-blob";
import { Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';

var Sound = require('react-native-sound');

export default class AppointmentDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPDetails: false,
      send_id: this.props.route.params.send_id,
      status_pass: this.props.route.params.status,
      appoinment_id: this.props.route.params.appoinment_id,
      modalVisible: false,
      appoinment_detetails: '',
      slot_booking_id: '',
      task_details: '',
      time_take_data: '',
      rating: '',
      emailfocus: false,
      textLength: 0,
      email: 0,
      modalVisiblerating: false,
      new_task_type: '',
      ennterOTP: '',
      mediamodal: false,
      playState: 'paused', //playing, paused
      playSeconds: 0,
      duration: 0,
      reportModalVisible: false,
      reportsArr: [],
      modalPatientPrescription: false
    };
    this.sliderEditing = false;
    Sound.setCategory('Playback', true); // true = mixWithOthers
    this.sound = null
  }

  componentDidMount() {
    console.log("DeviceInfo.getTimezone():: ", global.deviceTimezone);
    FontAwesome.getImageSource('circle', 20, Colors.theme_color).then(source =>
      this.setState({ sliderIcon: source })
    );
    this.get_all_details(0)
    this.get_day()


  }

  onSliderEditStart = () => {
    this.sliderEditing = true;
  }

  onSliderEditEnd = () => {
    this.sliderEditing = false;
  }

  onSliderEditing = value => {
    if (Platform.OS == "android") {
      if (this.sound && this.state.playState == 'pause' && !this.sliderEditing) {
        this.sound.setCurrentTime(value);
        this.setState({ playSeconds: value });
      }
    } else {
      if (this.sound) {
        this.sound.setCurrentTime(value);
        this.setState({ playSeconds: value });
      }
    }


  }

  onStartPlay = async (isPlay = false) => {
    console.log("isPlay:: ", isPlay);
    console.log("this.sound:: ", this.sound);
    console.log("playState:: ", this.state.playState);
    if (this.sound != null) {
      if (isPlay) {
        this.playMusic()
        this.sound.play(this.playComplete);
        this.setState({ playState: 'playing' });
      }

    } else {

      let recordingUrl = Configurations.img_url3 + this.state.appoinment_detetails.symptom_recording;
      console.log('onStartPlay', recordingUrl);

      this.sound = new Sound(recordingUrl, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + this.sound.getDuration() + 'number of channels: ' + this.sound.getNumberOfChannels());
        this.setState({
          playState: (isPlay) ? 'playing' : 'paused',
          duration: this.sound.getDuration()
        }, () => {

        });

        if (isPlay) {
          // Play the sound with an onEnd callback
          this.playMusic()
          this.sound.play(this.playComplete);
        }

      });

    }
  };

  playComplete = (success) => {
    // if(this.sound){
    //     if (success) {
    //         console.log('successfully finished playing');
    //     } else {
    //         console.log('playback failed due to audio decoding errors');
    //         Alert.alert('Notice', 'audio file error. (Error code : 2)');
    //     }
    //     this.setState({playState:'paused', playSeconds:0});
    //     this.sound.setCurrentTime(0);
    // }
    if (success) {
      // console.log('successfully finished playing');
      // // if (this.sound != null) {
      // //   this.sound.release();
      // //   this.sound = null;
      // // }
      // this.setState({ playState: 'paused', playSeconds: 0 });
      // if (this.timeout) {

      //   clearInterval(this.timeout);
      // }

      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
        Alert.alert('Notice', 'audio file error. (Error code : 2)');
      }
      if (this.timeout) {
        clearInterval(this.timeout);
      }
      this.setState({ playState: 'paused', playSeconds: 0 });
      this.sound.setCurrentTime(0);

    } else {
      console.log('playback failed due to audio decoding errors');
    }
  }

  playMusic = () => {
    console.log(this.sound, this.sound.isLoaded());
    this.timeout = setInterval(() => {

      if (this.sound != null && this.sound.isLoaded() && !this.sliderEditing) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({
            playSeconds: seconds
          });
        })
      }
    }, 100);
  }

  pause = () => {
    if (this.sound != null) {
      this.sound.pause();
    }

    this.setState({ playState: 'paused' });
  }
  
  jumpSeconds = (secsDelta) => {
    if (sound) {
      sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
        sound.setCurrentTime(nextSecs);
        this.setState({ playSeconds: nextSecs });
      })
    }
  }

  get_all_details = async (page) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-provider-appointment-details" //"api-patient-appointment-details";  
    console.log("url", url)

    var data = new FormData();
    data.append('id', this.state.appoinment_id)

    data.append('service_type', user_type)



    API.post(url, data, page).then((obj) => {


      if (obj.status == true) {


        this.setState({
          appoinment_detetails: obj.result,
          message: obj.message
        }, () => {
          this.onStartPlay(false)
        })
        console.log('obj.result', obj.result)



      } else {

        this.setState({ nurse_data: obj.result, message: obj.message })
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  handleGetDirections = (lat, long, address) => {
    const data = {
      destination: {
        latitude: lat, //-33.8600024,
        longitude: long, //18.697459
        address: address
      },
    }

    getDirections(data)
  }

  rescdule_click = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let url = Configurations.baseURL + "api-patient-reschedule-appointment";
    console.log("url", url)

    var data = new FormData();
    data.append('order_id', this.state.order_id)

    data.append('service_type', this.state.status_pass)



    API.post(url, data).then((obj) => {


      if (obj.status == true) {

        let time_slot = obj.result.task_time
        if (obj.result.task_time != '') {
          var names = obj.result.task_time;
          var nameArr = names.split(',');

          const new_time_dlot = [];
          const Arr1 = [];
          const Arr2 = [];
          if (obj.result.task_time != '') {
            for (let l = 0; l < nameArr.length; l++) {
              new_time_dlot.push({ time: nameArr[l], time_status: false });
              if ((l + 2) % 2 == 0) {

                Arr1.push({ time: nameArr[l], time_status: false });
              }

              else {
                Arr2.push({ time: nameArr[l], time_status: false });
              }
            }
          }

          this.setState({ time_Arr: new_time_dlot, final_one: Arr1, final_arr_two: Arr2 })

        }

        this.setState({ set_date: obj.result.app_date, rescdule_data: obj.result, slot_booking_id: obj.result.slot_booking_id, message: obj.message, task_details: obj.result.task_details, new_task_type: obj.result.task_type })


        setTimeout(() => {
          this.setState({ modalVisible: true })
        }, 700);

        console.log('obj.result', obj.result)



      } else {

        this.setState({ rescdule_data: obj.result, message: obj.message })
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }
  get_time_date = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-patient-next-date-time";
    console.log("url", url)

    var data = new FormData();
    data.append('provider_id', this.state.send_id)
    data.append('date', this.state.set_date)
    data.append(' task_type', this.state.set_task)
    data.append('service_type', this.state.status_pass)
    console.log('data', data)
    API.post(url, data).then((obj) => {


      if (obj.status == true) {
        var cureent = new Date();
        var timcurrent = cureent.getHours() + ":" + cureent.getMinutes();
        this.setState({ timcurrent_for_check: timcurrent })
        console.log("obj.result", obj.result)
        if (this.state.slot_booking_id == 'TASK_BOOKING') {
          if (obj.result.task_time != '') {
            var names = obj.result.task_time;
            var nameArr = names.split(',');

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            if (obj.result.task_time != '') {
              for (let l = 0; l < nameArr.length; l++) {
                if (this.state.check_currentdate == this.state.set_date) {
                  const timeStr = nameArr[l];

                  const convertTime = timeStr => {
                    const [time, modifier] = timeStr.split(' ');
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') {
                      hours = '00';
                    }
                    if (modifier === 'PM') {
                      hours = parseInt(hours, 10) + 12;
                    }
                    return `${hours}:${minutes}`;
                  };
                  var finaltime = convertTime(timeStr);
                  if (finaltime >= this.state.timcurrent_for_check) {
                    new_time_dlot.push({ time: nameArr[l], time_status: false });
                    if ((l + 2) % 2 == 0) {

                      Arr1.push({ time: nameArr[l], time_status: false });
                    }

                    else {
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }
                  }
                }
                else {
                  if ((l + 2) % 2 == 0) {

                    Arr1.push({ time: nameArr[l], time_status: false });
                  }

                  else {
                    Arr2.push({ time: nameArr[l], time_status: false });
                  }
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
                }
              }
            }

            this.setState({ time_Arr: new_time_dlot, final_one: Arr1, final_arr_two: Arr2 })

          }
          else {
            this.setState({ time_Arr: obj.result.task_time })
          }
        }
        else {

          if (obj.result.hourly_time != '') {
            var names_time = obj.result.hourly_time;
            var nameArr_time = names_time.split(',');

          }


          const new_time_hourl = [];
          const Arr_hour = [];
          const Arr2_hour = [];
          if (obj.result.hourly_time != '') {
            for (let m = 0; m < nameArr_time.length; m++) {
              const timeStr_hour = nameArr_time[m];
              if (this.state.check_currentdate == this.state.set_date) {
                const convertTime_hour = timeStr_hour => {
                  const [time, modifier] = timeStr_hour.split(' ');
                  let [hours, minutes] = time.split(':');
                  if (hours === '12') {
                    hours = '00';
                  }
                  if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                  }
                  return `${hours}:${minutes}`;
                };
                var finaltime_hour = convertTime_hour(timeStr_hour);
                if (finaltime_hour >= timcurrent) {
                  new_time_hourl.push({ time: nameArr_time[m], time_status: false });
                  if ((m + 2) % 2 == 0) {

                    Arr_hour.push({ time: nameArr_time[m], time_status: false });
                  }

                  else {
                    Arr2_hour.push({ time: nameArr_time[m], time_status: false });
                  }
                }
              }
              else {
                new_time_hourl.push({ time: nameArr_time[m], time_status: false });
                if ((m + 2) % 2 == 0) {

                  Arr_hour.push({ time: nameArr_time[m], time_status: false });
                }

                else {
                  Arr2_hour.push({ time: nameArr_time[m], time_status: false });
                }
              }
            }
            this.setState({ time_Arr: new_time_hourl, final_one: Arr_hour, final_arr_two: Arr2_hour })
          }

          else {
            this.setState({ time_Arr: obj.result.hourly_time })
          }
        }


      } else {

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }
  check_date = (item, index) => {
    let data = this.state.date_array;
    console.log('new data', data)

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;

      }
      else {
        data[i].tick = 0;
      }
    }
    // }
    this.setState({ date_array: data })

  }
  get_day = () => {
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 28);
    let datenew_show = today.getDate()
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let month_show = today.getMonth() + 1
    let year_show = today.getFullYear()
    let show_month1 = ''
    let show_get_date = ''
    if (month_show <= 9) {
      show_month1 = "0" + month_show
    }
    else {
      show_month1 = month_show
    }
    if (datenew_show <= 9) {
      show_get_date = "0" + datenew_show
    }
    else {
      show_get_date = datenew_show
    }
    let date1_show = year_show + '-' + show_month1 + '-' + show_get_date
    this.setState({ set_date: date1_show, check_currentdate: date1_show })

    for (var arr = [], dt = new Date(today); dt <= new Date(nextweek); dt.setDate(dt.getDate() + 1)) {

      let date_final = new Date(dt)
      let month = date_final.getMonth() + 1
      let year = date_final.getFullYear()
      var dayName = days[date_final.getDay()];
      let final_date = date_final.getDate()
      let datenew = ''
      let show_month = ''
      if (final_date <= 9) {
        datenew = "0" + final_date
      }
      else {
        datenew = final_date
      }
      if (month <= 9) {
        show_month = "0" + month
      }
      else {
        show_month = month
      }
      let date1 = year + '-' + show_month + '-' + datenew
      let tick = 0
      if (date1 == date1_show) {
        tick = 1
      }

      arr.push({ date1: date1, datenew: datenew, day: dayName, tick: tick });
    }
    this.setState({ date_array: arr })
    console.log("check date muskan", arr)
  };
  time_tick = (item, index) => {
    let data = this.state.time_Arr;
    console.log('new data', data)
    // if(data[index].time_status==true)
    // {
    //     data[index].time_status=false
    // }
    // else
    // {
    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      }
      else {
        data[i].time_status = false;
      }
      // }
    }
    this.setState({ time_Arr: data })

  }
  submit_btn = async () => {

    if (this.state.time_take_data.length <= 0) {
      MessageFunctions.toast(MessageTexts.EmptyTime[Configurations.language], 'center')
      return false;
    }



    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-patient-update-reschedule-appointment";
    console.log('url', url)
    var data = new FormData();
    console.log('data', data)

    data.append('service_type', this.state.status_pass)
    data.append('order_id', this.state.order_id)
    data.append('from_date', this.state.set_date)
    data.append('from_time', this.state.time_take_data)

    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        this.setState({ modalVisible: false })
        setTimeout(() => {
          MessageFunctions.toast(obj.message, 'center')
          this.get_all_details(1)
        }, 700);
      } else {
        setTimeout(() => {
          MessageFunctions.alert('', obj.message, false);
        }, 700);
        // }
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false });
    });

  }

  rating_btn = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id

    let url = Configurations.baseURL + "api-patient-insert-review";
    console.log('url', url)
    var data = new FormData();
    console.log('data', data)
    data.append('lgoin_user_id', user_id)
    data.append('service_type', this.state.status_pass)
    data.append('order_id', this.state.set_order)
    data.append('rating', this.state.rating)
    data.append('review', this.state.email)
    data.append('provider_id', this.state.send_id)

    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        this.setState({ modalVisiblerating: false })
        setTimeout(() => {
          MessageFunctions.toast(obj.message, 'center')
          this.get_all_details(1)
        }, 700);
      } else {
        setTimeout(() => {
          MessageFunctions.alert('', obj.message, false);
        }, 700);
        // }
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false });
    });

  }

  showConfirmDialogReject = (acceptanceStatus, appointmentID) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to reject this appointment?",
      [
        {
          text: "Yes",
          onPress: () => {
            this.updateProviderAppointmentStatus(acceptanceStatus, appointmentID)
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  updateProviderAppointmentStatus = async (acceptanceStatus, appointmentID) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-update-provider-appointment-status";
    
    var data = new FormData();
    data.append('id', appointmentID)
    data.append('service_type', user_type)
    data.append('acceptance_status', acceptanceStatus)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('obj.result', obj.result)
        this.props.route.params.reloadList()
        this.get_all_details(0)
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  otpPressed = async (id) => {

    if (this.state.ennterOTP.length <= 0) {
      MessageFunctions.showError("Please enter OTP to continue!")
      return false;
    }

    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-complete-provider-appointment-status";
    console.log("url", url)
    // {id:126,service_type:nurse,'acceptance_status':Accept}
    var data = new FormData();
    data.append('id', id)
    data.append('service_type', user_type)
    data.append('otp', this.state.ennterOTP)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('obj.result', obj.result)
        // let appoinment_detetails = [...this.state.appoinment_detetails];
        // appoinment_detetails[this.state.index] = { ...appoinment_detetails[this.state.index], key: obj.result[0] };
        // this.setState({ appoinment_detetails });
        this.props.route.params.reloadList()
        this.get_all_details(0)
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  upload_report_click = async () => {
    // Keyboard.dismiss()

    let url = Configurations.baseURL + "api-upload-lab-report";
    console.log("url", url)
    var data = new FormData();

    data.append('appointment_id', this.state.appoinment_detetails.id)
    data.append('patient_id', this.state.appoinment_detetails.patient_id)
    data.append('hospital_id', (this.state.appoinment_detetails.hospital_id != "") ?
      this.state.appoinment_detetails.hospital_id : 0)

    if (this.state.reportsArr.length > 0) {

      // data.append('report', this.state.reportsArr)
      console.log('this.state.reportsArr::: ', this.state.reportsArr)
      for (var i = 0; i < this.state.reportsArr.length; i++) {

        let dataObj = {
          uri: this.state.reportsArr[i].path,
          type: this.state.reportsArr[i].mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? this.state.reportsArr[i].filename : this.state.reportsArr[i].path !== undefined ?
            this.state.reportsArr[i].path.substring(this.state.reportsArr[i].path.lastIndexOf("/") + 1, this.state.reportsArr[i].length) : 'image',
        }
        console.log('dadataObjta::: ', dataObj)
        data.append('report[]', dataObj)
      }



    }
    console.log('data::: ', data)

    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        this.setState({
          reportModalVisible: false,
          reportsArr: [],
          isFromReportModal: false,
        })
        setTimeout(() => {
          this.props.route.params.reloadList()
          this.get_all_details(0)
          MessageFunctions.showSuccess(obj.message)
        }, 800);

      } else {
        setTimeout(() => {
          this.setState({
            reportModalVisible: true,
          })
          MessageFunctions.showError(obj.message)
        }, 200)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false, reportModalVisible: true, });
    });

  }

  visibleReportModal = () => {
    this.setState({
      reportModalVisible: (this.state.isFromReportModal == true) ? true : false
    }, () => {

    })
  }

  Galleryopen = () => {
    console.log('Galleryopen');
    const { imageType } = this.state;
    Media.launchGellery(false).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      if (this.state.isFromReportModal == true) {
        var objF = undefined
        if (Platform.OS == "ios") {
          objF = {
            uri: obj.path,
            type: obj.mime, //'image/jpg',
            name: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
            filename: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
          }
        } else {
          objF = {
            uri: obj.path,
            type: obj.mime,
            path: obj.path,
            mime: obj.mime, //'image/jpg',
            name: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
            filename: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
          }
        }

        this.setState({
          reportsArr: [...this.state.reportsArr, objF],
          mediamodal: false,
        }, () => {
          console.log("reportsArrreportsArr:: ", this.state.reportsArr);
          (this.state.isFromReportModal == true) ? this.visibleReportModal() : null
        })
      } else {
        this.setState({
          [imageType]: obj,
          mediamodal: false
        }, () => {
          this.upload_prescription_click()
        })
      }


    }).catch((error) => {
      this.setState({
        mediamodal: false,
        reportModalVisible: (this.state.isFromReportModal == true) ? true : false
      })
    })
  }

  DocumentGalleryopen = async () => {
    // Pick a single file
    console.log('uploadVoiceFile');
    const { imageType } = this.state;
    Media.launchDocumentGellery(true).then((res) => {
      console.log('resresresres', res);
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );

      const source = {
        filename: res.name, //"speech_file.mp3", //(response.fileName != undefined) ? response.fileName : response.uri.substr(response.uri.length - 40),
        mime: res.type,
        path: res.uri,
        // serverFileName: "assignmentfile" //"upload_audio" //
        //imageData: response.data
      };

      console.log('source', source);


      if (this.state.isFromReportModal == true) {

        this.setState({
          reportsArr: [...this.state.reportsArr, source],
          mediamodal: false,
        }, () => {
          console.log("reportsArrreportsArr:: ", this.state.reportsArr);
          (this.state.isFromReportModal == true) ? this.visibleReportModal() : null
        })
      } else {

        this.setState({
          [imageType]: source,
          mediamodal: false
        }, () => {
          //this.handleUploadFile();
          console.log('this.state.id_image:: ', this.state.id_image);
          this.upload_prescription_click()
        });
      }

    }).catch((error) => {
      this.setState({
        mediamodal: false,
        reportModalVisible: (this.state.isFromReportModal == true) ? true : false
      })
    })

  }

  upload_prescription_click = async () => {
    // Keyboard.dismiss()

    let url = Configurations.baseURL + "api-doctor-upload-prescription";
    console.log("url", url)
    var data = new FormData();

    data.append('id', this.state.appoinment_detetails.id)

    if (this.state.provider_prescription.path != undefined) {

      data.append('provider_prescription', {
        uri: this.state.provider_prescription.path,
        type: this.state.provider_prescription.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? this.state.provider_prescription.filename : 'image',
      })
    }


    API.post(url, data).then((obj) => {

      console.log('obj mess', obj.message)
      if (obj.status == true) {
        // var user_details = obj.user_details;
        // const uservalue = { id_number: this.state.id, confirm_password: this.state.confirm, phone_number: phone_number_send, name: this.state.name, email: this.state.email, password: this.state.password, work_area: this.state.country_short_code };
        // localStorage.setItemObject('user_login', uservalue);

        setTimeout(() => {
          this.props.route.params.reloadList()
          this.get_all_details(0)
          MessageFunctions.showSuccess(obj.message)
        }, 500);

      } else {
        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 200)
        // }
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false });
    });

  }

  downloadPrescription = async (imgUrl, filename) => {
    if (Platform.OS == 'ios') {
      this.actualDownload(imgUrl, filename);
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.actualDownload(imgUrl, filename);
        } else {
          MessageFunctions.showError('You need to give storage permission to download the file');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  actualDownload = (imgUrl, filename) => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: filename,
      path: `${dirToSave}/${filename}`,
    }
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        //appendExt: 'pdf',
      },
      android: configfb,
    });

    console.log('The file saved to 23233', configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch('GET', imgUrl, {})
      .then((res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        // setisdownloaded(false)
        // global.props.hideLoader();
        if (Platform.OS == 'android') {
          MessageFunctions.showSuccess('File downloaded');
        }
        console.log('The file saved to ', res);
      })
      .catch((e) => {
        // setisdownloaded(true)
        // global.props.hideLoader();
        MessageFunctions.showError(e.message);
        console.log('The file saved to ERROR', e.message)
      });
  }

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt(seconds % (60 * 60) / 60);
    const s = parseInt(seconds % 60);

    return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
  }

  render() {

    const windowHeight = Math.round(Dimensions.get("window").height);
    const windowWidth = Math.round(Dimensions.get("window").width);
    const deviceHeight = Dimensions.get('screen').height;
    const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
    let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
    headerHeight += (Platform.OS === 'ios') ? 28 : -60
    var item = this.state.appoinment_detetails
    // const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    const durationString = this.getAudioTimeString(this.state.duration);

    if (this.state.appoinment_detetails != '' && this.state.appoinment_detetails != null) {

      var VideoCallBtn = false
      var UploadprecriptionBtn = false
      var UploadReportBtn = false

      var CurrentDate = moment().unix();
      var MyDate = moment(item.appointment_date + " " + item.from_time, 'YYYY-MM-DD hh:mm A').unix();
      var MyEndDate = moment(item.appointment_date + " 11:59 PM", 'YYYY-MM-DD hh:mm A').unix();


      if (CurrentDate > MyDate) {
        UploadprecriptionBtn = true
        UploadReportBtn = true
        if ((CurrentDate - MyDate) > (24 * 3600 * 7)) {
          UploadprecriptionBtn = false
          UploadReportBtn = false
        }
      }
      
      if (CurrentDate < MyDate) {
        let diff = (MyDate - CurrentDate) / 60
        if (diff <= 10) {
          VideoCallBtn = true
        }
      }
      else if (CurrentDate > MyDate) {
        VideoCallBtn = true
      }
      if (CurrentDate > MyEndDate) {
        VideoCallBtn = false
      }

      return (
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}></SafeAreaView>

          <ScreenHeader
            onBackPress={() => {
              this.props.navigation.goBack();
            }}
            leftIcon
            rightIcon={false}
            navigation={this.props.navigation}
            title={LanguageConfiguration.AppointmentDetails[Configurations.language]}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

          <Modal
            backdropOpacity={3}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            presentationStyle="overFullScreen"

            onRequestClose={() => { this.setState({ modalVisible: false }) }}>

            <View
              style={{
                flex: 1,
                backgroundColor: '#00000090',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 0,
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: Colors.white_color,
                  // marginTop: (mobileW * 50) / 100,
                  position: 'absolute',
                  bottom: 0,
                  borderTopLeftRadius: (mobileW * 10) / 100,
                  borderTopRightRadius: (mobileW * 10) / 100,
                  borderWidth: (mobileW * 0.3) / 100,
                  borderColor: Colors.gainsboro,
                  elevation: 5,
                  height: mobileH * 80 / 100
                }}>
                {/* task booking section */}
                <ScrollView style={{ marginTop: mobileW * 2 / 100, borderTopRightRadius: mobileW * 5 / 100, borderTopLeftRadius: mobileW * 5 / 100 }} showsVerticalScrollIndicator={false}>

                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: mobileW * 90 / 100,
                        // backgroundColor:'red',
                        alignSelf: 'center',
                        paddingTop: (mobileW * 4) / 100,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 4 / 100,
                        }}>{LanguageConfiguration.Reschedule[Configurations.language]}

                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            color: Colors.theme_color,
                            fontFamily: Font.Medium,
                            fontSize: Font.name,
                            paddingRight: (mobileW * 4) / 100,
                          }}>{item.order_id}

                        </Text>

                        <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                          <Image
                            source={Icons.Cross}
                            style={{
                              resizeMode: 'contain',
                              // backgroundColor: Colors.white_color,
                              width: 20,
                              height: 20,

                              alignSelf: 'center',
                            }}></Image>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* border */}
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: '90%',
                        alignSelf: 'center',
                        marginVertical: (mobileW * 1) / 100,
                      }}></View>
                    <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        paddingVertical: (mobileW * 4) / 100,

                      }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 3.9 / 100,
                            color: Colors.theme_color,
                            textAlign: Configurations.textRotate,
                            paddingBottom: mobileW * 1.5 / 100
                          }}>{this.state.new_task_type}

                        </Text>
                      </View>
                      <View
                        style={[{

                          paddingVertical: (mobileW * 3) / 100,
                          borderTopWidth: (mobileW * 0.3) / 100,
                          borderColor: Colors.bordercolor,


                        }, this.state.task_details.length >= 3 ? { height: mobileW * 40 / 100 } : { paddingVertical: mobileW * 1.5 / 100 }]}>
                        {this.state.slot_booking_id == 'TASK_BOOKING' ?

                          <FlatList
                            data={this.state.task_details}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (this.state.task_details != '' && this.state.task_details != null) {
                                return (
                                  <TouchableOpacity activeOpacity={0.9} onPress={() => { this.check_all(item, index) }}
                                    style={{
                                      alignItems: 'center', width: '100%',
                                      alignSelf: 'center',

                                      paddingVertical: (mobileW * 1.7) / 100,
                                      flexDirection: 'row',
                                      marginTop: mobileW * 0.3 / 100,

                                    }}>

                                    <Text
                                      style={{
                                        width: '70%',
                                        textAlign: Configurations.textRotate,
                                        alignSelf: 'center',
                                        fontSize: mobileW * 3.6 / 100,
                                        fontFamily: Font.Regular,

                                        color: '#000',


                                      }}>
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={{

                                        width: '30%',

                                        fontSize: mobileW * 3.6 / 100,
                                        fontFamily: Font.Regular,
                                        color: '#000',

                                        textAlign: 'right',

                                      }}>
                                      {item.price}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            }}></FlatList> :

                          <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={item.task_details}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={{
                                  borderRadius: (mobileW * 2) / 100,
                                  marginRight: mobileW * 2 / 100,
                                  marginTop: mobileW * 2 / 100,
                                  borderColor: '#0168B3',
                                  borderWidth: 2,

                                  width: mobileW * 30 / 100, backgroundColor: '#fff',
                                }}>
                                  <View
                                    style={{
                                      backgroundColor: '#0168B3',

                                      borderTopLeftRadius: (mobileW * 1.2) / 100,
                                      borderTopRightRadius: (mobileW * 1.2) / 100,
                                      width: '100%'

                                    }}>
                                    <Text
                                      style={{
                                        // backgroundColor:'red',
                                        // paddingHorizontal: (mobileW * 5) / 100,
                                        paddingVertical: (mobileW * 1.5) / 100,
                                        color: Colors.white_color,
                                        fontFamily: Font.Medium,
                                        fontSize: mobileW * 3 / 100,
                                        textAlign: 'center',
                                        textTransform: 'uppercase'
                                      }}>{item.name}

                                    </Text>
                                  </View>
                                  <Text
                                    style={{


                                      paddingVertical: (mobileW * 2) / 100,
                                      fontFamily: Font.Medium,
                                      textAlign: 'center',
                                      fontSize: Font.sregulartext_size,
                                    }}>
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            }}></FlatList>}
                      </View>

                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignSelf: 'center',
                          paddingTop: (mobileW * 4) / 100,

                          borderColor: Colors.gainsboro,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.name,

                            textAlign: Configurations.textRotate
                          }}>{LanguageConfiguration.Appoinmentschedule[Configurations.language]}

                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={Icons.DatePicker}
                            style={{
                              resizeMode: 'contain',
                              // backgroundColor: Colors.white_color,
                              width: 20,
                              height: 20,

                              alignSelf: 'center',
                            }}></Image>

                          <Text
                            style={{
                              color: Colors.theme_color,
                              fontFamily: Font.Medium,
                              fontSize: Font.name,
                              marginLeft: mobileW * 1 / 100,
                            }}>{this.state.set_date}

                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.gainsboro,
                          width: '100%',
                          marginTop: mobileW * 2 / 100,

                        }}></View>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          paddingTop: (mobileW * 3) / 100,
                          paddingBottom: (mobileW * 3) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.subtext, textAlign: Configurations.textRotate,
                            color: '#000'
                          }}>{LanguageConfiguration.SelectDate[Configurations.language]}

                        </Text>

                        <View style={{ width: '100%' }}>
                          <FlatList
                            horizontal={true}
                            data={this.state.date_array}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {

                              return (
                                <TouchableOpacity onPress={() => { this.setState({ set_date: item.date1, set_task: 'task_base', time_take_data: '' }), this.get_time_date(), this.check_date(item, index) }} style={{ width: mobileW * 15 / 100, }}>
                                  <Text
                                    style={{
                                      marginRight: (mobileW * 3) / 100,
                                      marginTop: (mobileW * 3) / 100,
                                      backgroundColor: item.tick == 1 ? '#0787D2' : Colors.gray6,
                                      color: item.tick == 1 ? 'white' : 'black',
                                      textAlign: 'center',
                                      paddingVertical: mobileW * 2 / 100,
                                      fontFamily: Font.ques_fontfamily,
                                      fontSize: Font.sregulartext_size,

                                      lineHeight: mobileW * 5 / 100,

                                    }}>
                                    {item.day}{"\n"}

                                    {item.datenew}
                                  </Text>
                                </TouchableOpacity>
                              );

                            }}></FlatList>
                        </View>
                      </View>

                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: Colors.gainsboro,
                          width: '100%',
                          marginTop: mobileW * 1.5 / 100,
                          marginBottom: mobileW * 1.5 / 100
                        }}></View>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          paddingVertical: (mobileW * 3) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.subtext,
                            textAlign: Configurations.textRotate,
                          }}>{LanguageConfiguration.Select_start_time[Configurations.language]}


                        </Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                          <View style={{ width: '100%' }}>
                            {this.state.time_Arr != '' ?
                              <View style={{ width: '100%' }}>
                                <View style={{ width: '100%' }}>
                                  <FlatList
                                    horizontal={true}

                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.final_one}
                                    renderItem={({ item, index }) => {

                                      return (
                                        <TouchableOpacity onPress={() => { this.setState({ time_take_data: item.time }) }}>
                                          <Text
                                            style={[{
                                              marginRight: (mobileW * 3) / 100,
                                              marginTop: (mobileW * 3) / 100,

                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (mobileW * 2) / 100,
                                              paddingHorizontal: (mobileW * 3.3) / 100,
                                            }, item.time == this.state.time_take_data ? { backgroundColor: Colors.theme_color, color: '#fff' } : { backgroundColor: Colors.gray6, color: '#000' }]}>
                                            {item.time}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    }
                                    }></FlatList>
                                </View>
                                <View style={{ width: '100%' }}>
                                  <FlatList
                                    horizontal={true}

                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.final_arr_two}
                                    renderItem={({ item, index }) => {

                                      return (
                                        <TouchableOpacity onPress={() => { this.setState({ time_take_data: item.time }) }}>
                                          <Text
                                            style={[{
                                              marginRight: (mobileW * 3) / 100,
                                              marginTop: (mobileW * 3) / 100,

                                              fontFamily: Font.ques_fontfamily,
                                              fontSize: Font.sregulartext_size,
                                              padding: (mobileW * 2) / 100,
                                              paddingHorizontal: (mobileW * 3.3) / 100,
                                            }, item.time == this.state.time_take_data ? { backgroundColor: Colors.theme_color, color: '#fff' } : { backgroundColor: Colors.gray6, color: '#000' }]}>
                                            {item.time}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    }
                                    }></FlatList>
                                </View>
                              </View>
                              :
                              <Text style={{ fontFamily: Font.MediumItalic, fontSize: mobileW * 4 / 100, alignSelf: 'center', marginTop: mobileW * 3 / 100, textAlign: 'center', marginLeft: mobileW * 32 / 100 }}>{LanguageConfiguration.no_data_Found[Configurations.language]}</Text>}
                          </View>
                        </ScrollView>
                      </View>

                      <TouchableOpacity
                        onPress={() => { this.submit_btn() }}
                        style={{
                          width: '98%',
                          alignSelf: 'center',
                          borderRadius: (mobileW * 2) / 100,
                          backgroundColor: Colors.theme_color,
                          paddingVertical: (mobileW * 2.8) / 100,
                          marginVertical: (mobileW * 6) / 100,
                        }}>
                        <Text
                          style={{
                            color: Colors.textwhite,
                            fontFamily: Font.Medium,
                            fontSize: Font.subtext,
                            alignSelf: 'flex-end',
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                          }}>{LanguageConfiguration.SAVECHANGERESCHEDULE[Configurations.language]}

                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* -------------------------------------rating review modal------------------------------ */}

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}

            showsVerticalScrollIndicator={false}  >
            <KeyboardAwareScrollView extraScrollHeight={50}
              enableOnAndroid={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                justifyContent: 'center',
                paddingBottom: vs(30),
              }}
              showsVerticalScrollIndicator={false}>
              <Modal
                backdropOpacity={3}
                //  style={{backgroundColor: Colors.dim_grey}}
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisiblerating}
                presentationStyle="overFullScreen"

                onRequestClose={() => { this.setState({ modalVisiblerating: false }) }}>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#00000090',

                    borderRadius: 0,
                  }}>

                  <View
                    style={{
                      width: '98%',
                      backgroundColor: Colors.white_color,
                      marginTop: (mobileW * 50) / 100,
                      alignSelf: 'center',
                      borderRadius: (mobileW * 10) / 100,

                      borderWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.gainsboro,
                      elevation: 5,
                      height: mobileH * 40 / 100
                    }}>
                    {/* task booking section */}

                    <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 4 / 100 }}>
                      <Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.Regular, color: '#000', textAlign: Configurations.textRotate, }}>{LanguageConfiguration.rate_appointment[Configurations.language]}</Text>
                      <View style={{ width: '65%', alignSelf: 'center', marginTop: mobileW * 5 / 100, justifyContent: 'center' }}>
                        <StarRating
                          disabled={false}
                          fullStar={Icons.YellowStar}
                          emptyStar={Icons.UnfilledStar}
                          maxStars={5}
                          starSize={45}
                          rating={this.state.rating}
                          selectedStar={(rating) => { this.setState({ rating: rating }) }}
                        />
                      </View>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          marginTop: (mobileW * 6) / 100,
                          borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          borderWidth: mobileW * 0.3 / 100,
                          borderRadius: (mobileW * 1) / 100
                        }}>


                        <View style={{ width: '100%', alignSelf: 'center' }}>
                          <TextInput
                            style={{
                              width: '100%',
                              color: Colors.textblack,
                              fontSize: Font.placeholdersize,
                              textAlign: Configurations.textalign,
                              height: (mobileW * 12) / 100,
                              paddingLeft: mobileW * 3 / 100,
                              fontFamily: Font.placeholderfontfamily,
                              borderRadius: (mobileW * 1) / 100,
                            }}
                            maxLength={200}
                            placeholder={
                              this.state.emailfocus != true
                                ? LanguageConfiguration.Write_review[Configurations.language]
                                : null
                            }
                            placeholderTextColor={Colors.placeholder_text}
                            onChangeText={txt => {
                              this.setState({ email: txt, textLength: txt }
                              );
                            }}

                            onFocus={() => {
                              this.setState({ emailfocus: true });
                            }}
                            onBlur={() => {
                              this.setState({
                                emailfocus: this.state.email.length > 0 ? true : false,
                              });
                            }}
                            ref={(input) => { this.textinput = input; }}
                            keyboardType="email-address"
                            returnKeyLabel="done"
                            returnKeyType="done"
                          />
                        </View>
                        {this.state.emailfocus == true && (
                          <View
                            style={{
                              position: 'absolute',
                              backgroundColor: 'white',
                              left: (mobileW * 4) / 100,
                              top: (-mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 1) / 100,
                            }}>
                            <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>
                              {LanguageConfiguration.Write_review[Configurations.language]}
                            </Text>
                          </View>
                        )}

                      </View>
                      {this.state.textLength.length > 0 &&
                        <Text style={{ fontSize: 10, color: '#515C6F', textAlign: 'right' }}> {this.state.textLength.length}/200  </Text>
                      }
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 7 / 100 }}>
                        <TouchableOpacity onPress={() => { this.setState({ modalVisiblerating: false, emailfocus: false }) }} style={{ width: '45%', paddingVertical: mobileW * 2 / 100, alignItems: 'center', borderWidth: 1, borderRadius: mobileW * 1.5 / 100, borderColor: '#515C6F' }}>
                          <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Medium, color: Colors.theme_color, textTransform: 'uppercase' }}>{LanguageConfiguration.cancelmedia[Configurations.language]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.rating_btn() }} style={{ width: '45%', paddingVertical: mobileW * 2 / 100, alignItems: 'center', borderRadius: mobileW * 1.5 / 100, backgroundColor: Colors.theme_color }}>
                          <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Medium, color: '#fff', textTransform: 'uppercase' }}>{LanguageConfiguration.submitbtntext[Configurations.language]}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>

                </View>

              </Modal>
              <View
                style={{
                  flex: 1,
                  marginBottom: (mobileW * 40) / 100,
                  shadowOpacity: 0.3,
                  shadowColor: '#000',
                  shadowOffset: { width: 2, height: 2 },
                  elevation: 2,
                  paddingVertical: vs(9),
                  backgroundColor: Colors.White,
                }}>
                <View style={{}}>

                  <View>

                    {/* Order ID & Status */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        paddingBottom: vs(5),
                        paddingHorizontal: s(13),

                      }}>

                      <Text
                        style={{
                          fontSize: Font.small,
                          fontFamily: Font.Medium,
                          color: Colors.Theme
                        }}
                      >
                        {item.order_id}
                      </Text>
                      <Text
                        style={{
                          fontSize: Font.small,
                          fontFamily: Font.Medium,
                          color: item?.acceptance_status === 'Pending' ? Colors.Yellow : (item?.acceptance_status === 'Completed' || item?.acceptance_status === 'Accepted') ? Colors.Green : Colors.Red,
                        }}
                      >
                        {item.acceptance_status}
                      </Text>

                    </View>

                    {/* Profile Image and Personal Details */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: vs(11),
                        paddingHorizontal: s(13),
                      }}>
                      <View style={{ width: "28%", alignSelf: "center" }}>
                        {
                          (item.provider_image == "NA" || item.provider_image == null || item.provider_image == "") ?
                            <SvgXml xml={dummyUser = ''} style={{
                              alignSelf: "center",
                              marginTop: vs(5)
                            }} />
                            :
                            <Image
                              source={{ uri: Configurations.img_url3 + item.provider_image }}
                              style={{ height: s(75), width: s(75), borderRadius: s(85), borderWidth: 0.5, bordercolor: Colors.Highlight }}
                            />
                        }
                      </View>

                      <View
                        style={{
                          width: "60%",
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              color: Colors.Theme,
                              fontSize: Font.small,
                              alignSelf: 'flex-start',
                            }}>
                            {item.service_type}
                          </Text>
                          {item.hospital_id != "" && (
                            <Text
                              style={{
                                color: "#FCFFFE",
                                backgroundColor: "#FFA800",
                                fontFamily: Font.Medium,
                                fontSize: Font.medium,
                                padding: (windowWidth * 2) / 100,
                                marginTop: -3,
                                marginLeft: 10,
                                paddingVertical: (windowWidth * 0.6) / 100,
                              }}
                            >
                              {LanguageConfiguration.Hospital[Configurations.language]}
                            </Text>
                          )}
                        </View>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.medium,
                            paddingVertical: (windowWidth * 1.1) / 100,
                            color: Colors.DarkGrey,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {item.provider_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {item.speciality}
                        </Text>
                      </View>
                    </View>

                    {/* Appointment Schedule Section */}
                    <View
                      style={{
                        backgroundColor: Colors.appointmentdetaillightblue,
                        paddingHorizontal: s(13),
                        paddingVertical: vs(10)
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.darkText,
                          alignSelf: 'flex-start',
                          paddingBottom: (windowWidth * 3) / 100,
                        }}
                      >
                        {LanguageConfiguration.appointment_schedule[Configurations.language]}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}>

                        <View
                          style={{
                            flex: 1,
                            marginTop: (windowWidth * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                            }}
                          >
                            {LanguageConfiguration.Date[Configurations.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                              marginTop: vs(5)
                            }} >
                            {item.app_date}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1.35,
                            marginTop: (windowWidth * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                            }}
                          >
                            {LanguageConfiguration.Time[Configurations.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                              marginTop: vs(5)
                            }} >
                            {item.app_time}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 0.65,
                            marginTop: (windowWidth * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                            }}
                          >
                            {'Type'}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                              textAlign: 'left',
                              marginTop: vs(5)
                            }} >
                            {item?.task_type}
                          </Text>
                        </View>

                      </View>

                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          borderTopWidth: 1.5,
                          borderTopColor: '#D8D8D8',
                          marginTop: vs(10),
                          paddingTop: vs(8)
                        }}>

                        <View
                          style={{
                            width: "42%",
                            justifyContent: "space-between",
                            flexDirection: "row",
                            alignItems: 'center'
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                            }}>
                            {LanguageConfiguration.BookingOn[Configurations.language]}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                              textTransform: "uppercase",
                            }}>
                            {item.booking_date}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* // patient symptom doctor */}
                    {
                      (item.service_type == "Doctor" &&
                        (item.symptom_recording != "" || item.symptom_text != "")) &&
                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          backgroundColor: "#FDF7EB",
                          paddingVertical: vs(9),
                          paddingHorizontal: s(13)
                        }}>
                        <Text style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.Theme,
                          alignSelf: 'flex-start',
                        }}>
                          Patient Symptom
                        </Text>
                        {
                          (item.symptom_recording != "") &&
                          <View
                            style={{
                              width: "100%",
                              alignSelf: "center",
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderBottomWidth: 1.5,
                              borderColor: Colors.gainsboro,
                              paddingVertical: vs(5)
                            }}>

                            <Text
                              style={{
                                width: '30%',
                                fontFamily: Font.Medium,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                                textAlign: 'left',
                              }}
                            >
                              {'Voice Recording'}
                            </Text>
                            <View style={{
                              width: '70%',
                              flexDirection: "row",
                              alignItems: 'center'
                            }}>
                              <TouchableOpacity onPress={() => {
                                (this.state.playState == 'paused') ?
                                  this.onStartPlay(true) : this.pause()
                              }}>
                                <Image
                                  source={(this.state.playState == 'paused') ?
                                    Icons.Play : Icons.Pause}

                                  style={{
                                    width: (mobileW * 8) / 100,
                                    height: (mobileW * 8) / 100,

                                  }}></Image>
                              </TouchableOpacity>
                              <Slider
                                onTouchStart={this.onSliderEditStart}
                                onTouchEnd={this.onSliderEditEnd}
                                onValueChange={this.onSliderEditing}
                                value={this.state.playSeconds}
                                maximumValue={this.state.duration}
                                maximumTrackTintColor='gray'
                                minimumTrackTintColor={Colors.theme_color}
                                thumbImage={this.state.sliderIcon}
                                style={{
                                  flex: 1,
                                  alignSelf: "center",
                                  marginHorizontal: Platform.select({ ios: 5 }),
                                  height: (windowWidth * 10) / 100,
                                }} />
                              <Text style={{ color: 'black', alignSelf: 'center' }}>{durationString}</Text>
                            </View>
                          </View>
                        }
                        {
                          (item.symptom_text != "") &&
                          <View
                            style={{
                              borderBottomWidth: 1.5,
                              borderColor: Colors.gainsboro,
                              paddingVertical: vs(9)
                            }}>
                            <Text style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                              marginBottom: (windowWidth * 3.5) / 100,
                            }}>
                              Symptom description
                            </Text>
                            <Text style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              alignSelf: 'flex-start',
                            }}>
                              {item.symptom_text}
                            </Text>
                          </View>
                        }
                        {item.patient_prescription != "" && (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: 'space-between',
                              flexDirection: "row",
                              alignItems: 'center',
                              alignSelf: "center",
                              paddingTop: vs(9)
                            }}
                          >
                            <View style={{
                              width: "90%",
                              flexDirection: "row",
                              alignItems: 'center',
                            }}>
                              <Image
                                resizeMode="contain"
                                source={Icons.FileAttachment}
                                style={{
                                  width: "5%",
                                  height: 15,
                                  marginRight: (windowWidth * 2) / 100,
                                  borderColor: Colors.Theme,
                                }}
                              />
                            </View>
                            <View style={{
                              width: '74%',
                            }}>
                              <Text
                                numberOfLines={1}
                                lineBreakMode='tail'
                                style={{
                                  fontFamily: Font.Regular,
                                  fontSize: Font.small,
                                  color: Colors.detailTitles,
                                  textAlign: "auto",
                                }}
                              >
                                {item.patient_prescription}
                              </Text>
                            </View>

                            <View style={{
                              width: "10%",
                              flexDirection: "row",
                              justifyContent: 'flex-end',
                            }}>
                              <Text
                                onPress={() => {
                                  this.setState({
                                    modalPatientPrescription: true,
                                  });
                                }}
                                style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.small,
                                  color: Colors.Theme,
                                }}
                              >
                                View
                              </Text>
                            </View>
                          </View>
                        )}
                        <Modal
                          backdropOpacity={3}
                          animationType="fade"
                          transparent={true}
                          visible={this.state.modalPatientPrescription}
                          presentationStyle="overFullScreen"
                          onRequestClose={() => {
                            this.setState({ modalPatientPrescription: false });
                          }}
                        >
                          <View
                            style={{
                              width: "95%",
                              height: mobileH - 100,
                              backgroundColor: Colors.white_color,
                              margin: (mobileW * 15) / 100,
                              borderRadius: (mobileW * 2) / 100,
                              borderWidth: 1,
                              borderColor: Colors.gray5,
                              shadowOpacity: 0.5,
                              shadowColor: "#000",
                              shadowOffset: { width: 2, height: 2 },
                              elevation: 5,
                              alignItems: "center",
                              justifyContent: "center",
                              alignSelf: "center",
                              flex: 1,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                top: -10,
                                right: -5,
                              }}
                              onPress={() =>
                                this.setState({
                                  modalPatientPrescription: false,
                                })
                              }
                            >
                              <Image
                                source={Icons.Cross}
                                style={{
                                  resizeMode: "contain",
                                  width: 30,
                                  height: 30,
                                  alignSelf: "center",
                                }}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{ uri: Configurations.img_url3 + item.patient_prescription }}
                              style={{
                                resizeMode: "cover",
                                width: "100%",
                                height: (mobileH * 40) / 100,
                              }}
                            />
                          </View>
                        </Modal>
                      </View>
                    }

                    {/* // prescription doctor */}
                    {
                      (item.acceptance_status == 'Completed' &&
                        item.service_type == "Doctor") &&
                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          paddingVertical: vs(10),
                          paddingHorizontal: s(13),
                        }}>
                        <Text style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.Theme,
                          alignSelf: 'flex-start',
                          paddingBottom: (windowWidth * 4) / 100,
                        }}>
                          Prescription
                        </Text>
                        <View style={{
                          flexDirection: "row",
                          width: "100%",
                          paddingVertical: vs(10),
                          borderBottomWidth: 1,
                          borderBottomColor: Colors.Border
                        }}>
                          <View style={{
                            width: '17%',
                          }}>
                            <Image
                              defaultSource={Icons.Prescription}
                              source={Icons.Prescription}
                              style={{
                                width: vs(40),
                                height: s(40)
                              }} />
                          </View>
                          <View style={{
                            width: "83%",
                          }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontFamily: Font.Regular,
                                  fontSize: Font.small,
                                  color: Colors.detailTitles,
                                  alignSelf: 'flex-start',
                                  width: '50%'
                                }}>{item.provider_prescription}</Text>



                              <TouchableOpacity style={{
                                width: '25%'
                              }} onPress={() => {
                                if (item.provider_prescription != "") {
                                  this.downloadPrescription(Configurations.img_url3 + item.provider_prescription, item.provider_prescription)
                                }

                              }}>
                                <Text style={{
                                  textAlign: "right",
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  color: Colors.Theme,
                                }}>Download</Text>
                              </TouchableOpacity>

                              <TouchableOpacity style={{
                                width: '25%'
                              }} onPress={() => {
                                this.setState({
                                  imageType: 'provider_prescription',
                                  mediamodal: true
                                }, () => {

                                })
                              }}>
                                <Text style={{
                                  textAlign: "right",
                                  fontFamily: Font.Regular,
                                  fontSize: Font.xsmall,
                                  color: Colors.orange,
                                }}>Re-Upload</Text>
                              </TouchableOpacity>
                            </View>

                            <Text style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.xsmall,
                              color: Colors.lightGrey,
                              alignSelf: 'flex-start',
                              marginTop: vs(3)
                            }}>{item.provider_upd}</Text>
                          </View>
                        </View>
                      </View>
                    }
                    {/* // report lab */}
                    {
                      ((item.acceptance_status == 'Accepted' || item.acceptance_status == 'Completed') &&
                        item.service_type == "Lab") &&
                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",
                          paddingHorizontal: s(13),
                          borderBottomWidth: (windowWidth * 0.3) / 100,
                          borderColor: Colors.gainsboro,
                          paddingVertical: (windowWidth * 2.5) / 100,
                        }}>
                        <Text style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.regulartext_size,
                          color: Colors.Theme,
                          alignSelf: 'flex-start',
                          paddingBottom: (windowWidth * 4) / 100,
                        }}>
                          Report Attachment
                        </Text>
                        {
                          (item.report != null && item.report.length > 0) &&
                          item.report.map((rItem, rIndex) => {
                            return (
                              <View style={{
                                flexDirection: 'row',
                                width: '100%',
                                borderBottomWidth: 1,
                                borderBottomColor: Colors.gainsboro,
                                marginBottom: 10
                              }}>
                                <View style={{
                                  width: '20%',
                                  marginBottom: 10
                                  // backgroundColor: 'red'
                                }}>
                                  <Image
                                    defaultSource={Icons.Report}
                                    source={Icons.Report}
                                    style={{
                                      width: (mobileW * 14) / 100,
                                      height: (mobileW * 16) / 100,
                                    }}></Image>
                                </View>
                                <View style={{
                                  width: '80%',
                                  // backgroundColor: 'blue'
                                }}>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: Font.Medium,
                                      fontSize: Font.smallheadingfont,
                                      color: Colors.darkgraytextheading,
                                      textAlign: Configurations.textRotate,
                                      marginTop: (mobileW * 1) / 100,
                                      marginBottom: (mobileW * 2) / 100,
                                    }}>{rItem.report}</Text>
                                  <Text style={{
                                    fontFamily: Font.Medium,
                                    fontSize: Font.ssubtext,
                                    color: Colors.gray4,
                                    textAlign: Configurations.textRotate,
                                    marginBottom: (mobileW * 1) / 100,
                                  }}>{rItem.upload_date}</Text>
                                  <TouchableOpacity onPress={() => {
                                    if (item.provider_prescription != "") {
                                      this.downloadPrescription(Configurations.img_url3 + rItem.report, rItem.report)
                                    }

                                  }}>
                                    <Text style={{
                                      textAlign: 'right',
                                      fontFamily: Font.Medium,
                                      fontSize: Font.tabtextsize,
                                      color: Colors.theme_color,
                                      marginBottom: (mobileW * 3) / 100,
                                    }}>Download</Text>
                                  </TouchableOpacity>

                                </View>
                              </View>
                            )
                          })
                        }
                        {
                          (UploadReportBtn == true) &&
                          <>
                            <View style={{
                              width: '30%',
                              alignSelf: 'flex-end'
                            }}>
                              <TouchableOpacity style={{
                                borderWidth: 1,
                                borderColor: Colors.theme_color,
                                borderRadius: 5,
                                padding: 6,
                              }}
                                onPress={() => {
                                  this.setState({
                                    reportModalVisible: !this.state.reportModalVisible
                                  })
                                }}
                              >
                                <Text style={{
                                  textAlign: 'center',
                                  color: Colors.theme_color,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.buttontextsize,
                                }}>UPLOAD</Text>
                              </TouchableOpacity>
                            </View>
                            <Modal
                              backdropOpacity={3}
                              animationType="fade"
                              transparent={true}
                              visible={this.state.reportModalVisible}
                              onRequestClose={() => {
                                // this.closeButtonFunction()
                              }}

                            >
                              <View
                                style={{
                                  // height: '100%',
                                  flex: 1,
                                  // marginTop: 'auto',
                                  // backgroundColor: 'red'
                                  backgroundColor: '#00000090',
                                }}>
                                <View
                                  style={{
                                    marginTop: 'auto',
                                    minHeight: '25%',
                                    maxHeight: '90%',
                                    // alignSelf: 'flex-end',
                                    backgroundColor: 'white',
                                    borderTopStartRadius: 20,
                                    borderTopEndRadius: 20
                                  }}
                                >
                                  <View style={{
                                    padding: 20,
                                  }}>
                                    <View style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}>
                                      <Text style={{
                                        fontFamily: Font.Medium,
                                        fontSize: Font.headingfont_booking,
                                        color: Colors.theme_color,
                                        textTransform: 'uppercase',
                                      }}>Report Attachment</Text>
                                      <TouchableOpacity
                                        style={{
                                          justifyContent: 'center',
                                          alignContent: 'center',
                                          textAlign: 'center',
                                        }}
                                        onPress={() => {
                                          this.setState({
                                            reportModalVisible: !this.state.reportModalVisible
                                          })
                                        }}>
                                        <Image
                                          // source={require('../assets/images/close.png')}
                                          source={Icons.Cross}
                                          style={{ width: 25, height: 25 }}
                                        />

                                      </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                      this.setState({
                                        reportModalVisible: false,
                                        isFromReportModal: true,
                                        mediamodal: true
                                      }, () => {

                                      })
                                    }}>
                                      <View style={{
                                        padding: 10,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        marginTop: 20,
                                        marginBottom: 20,
                                        borderRadius: 10,
                                        borderWidth: 1,
                                        borderStyle: 'dashed',
                                        bordercolor: Colors.gainsboro,
                                        flexDirection: 'row'
                                      }}>
                                        <View style={{
                                          // backgroundColor: 'red',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          padding: 10,
                                          paddingRight: 0,
                                          marginRight: 10
                                        }}>
                                          {/* <Image
                                      // source={require('../assets/images/close.png')}
                                      source={Icons.Cross}
                                      style={{ width: 25, height: 25 }}
                                    /> */}
                                          <FontAwesome5 style={{ alignSelf: 'center' }}
                                            name={"file-upload"}
                                            size={50}
                                            color={Colors.gainsboro}></FontAwesome5>
                                        </View>
                                        <View style={{
                                          // backgroundColor: 'yellow',
                                          justifyContent: 'center'
                                        }}>
                                          <Text style={{
                                            fontFamily: Font.Medium,
                                            fontSize: Font.headingfont_booking,
                                            color: Colors.darkgraytextheading,
                                          }}>Tap or click to upload</Text>
                                          <Text style={{
                                            fontFamily: Font.Regular,
                                            fontSize: Font.headinggray,
                                            color: Colors.darkgraytextheading,
                                          }}>Maximum file size allowed 10 MB</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>

                                    {
                                      (this.state.reportsArr.length > 0) &&
                                      <>
                                        <ScrollView
                                          scrollEnabled={(this.state.reportsArr.length >= 4) ? true : false}
                                          style={{
                                            maxHeight: '68%',
                                            marginBottom: (this.state.reportsArr.length <= 4) ? 60 : 0
                                          }}
                                          showsVerticalScrollIndicator={false}
                                        >
                                          {
                                            this.state.reportsArr.map((file, index) => {
                                              return (

                                                <View style={{
                                                  flexDirection: 'row',
                                                  width: '100%',
                                                  borderBottomWidth: 1,
                                                  borderBottomColor: Colors.gainsboro,
                                                  marginBottom: 10
                                                }}>
                                                  <View style={{
                                                    width: '18%',
                                                    marginBottom: 10
                                                    // backgroundColor: 'red'
                                                  }}>
                                                    <Image
                                                      defaultSource={Icons.Report}
                                                      source={Icons.Report}
                                                      style={{
                                                        width: (mobileW * 12) / 100,
                                                        height: (mobileW * 16) / 100,
                                                      }}></Image>
                                                  </View>
                                                  <View style={{
                                                    width: '82%',
                                                    // backgroundColor: 'blue'
                                                  }}>
                                                    <View style={{
                                                      flexDirection: 'row',
                                                      justifyContent: 'space-between',
                                                      alignItems: 'center',
                                                      width: '100%',
                                                      // backgroundColor: 'red'
                                                    }}>
                                                      <Text
                                                        numberOfLines={2}
                                                        lineBreakMode={'tail'}
                                                        style={{
                                                          width: '80%',
                                                          fontFamily: Font.Medium,
                                                          fontSize: Font.headinggray,
                                                          color: Colors.darkgraytextheading,
                                                          textAlign: Configurations.textRotate,
                                                          marginTop: (mobileW * 2) / 100,
                                                          marginBottom: (mobileW * 2) / 100,
                                                        }}>{file.filename}</Text>
                                                      <TouchableOpacity
                                                        style={{
                                                          justifyContent: 'flex-end',
                                                          alignContent: 'flex-end',
                                                          alignItems: 'flex-end',
                                                          width: '20%',
                                                          // backgroundColor: 'blue'
                                                        }}
                                                        onPress={() => {
                                                          var array = [...this.state.reportsArr]; // make a separate copy of the array
                                                          var index = index
                                                          if (index !== -1) {
                                                            array.splice(index, 1);
                                                            this.setState({ reportsArr: array });
                                                          }
                                                        }}>
                                                        {/* <Entypo style={{
                                                          // alignSelf: 'flex-end'
                                                        }}
                                                          name={"cross"}
                                                          size={30}
                                                          color={Colors.gray4}></Entypo> */}
                                                        <Image
                                                          // source={require('../assets/images/close.png')}
                                                          source={Icons.Cross}
                                                          style={{ width: 20, height: 20 }}
                                                        />
                                                      </TouchableOpacity>
                                                    </View>

                                                    <View style={{
                                                      marginTop: 15,
                                                      flexDirection: 'row',
                                                      justifyContent: 'space-between',
                                                      alignItems: 'center'
                                                    }}>
                                                      <View style={{
                                                        height: 2,
                                                        width: '80%',
                                                        backgroundColor: Colors.theme_color
                                                      }}>

                                                      </View>
                                                      <Text style={{
                                                        fontFamily: Font.Regular,
                                                        fontSize: Font.smallheadingfont,
                                                        color: Colors.darkgraytextheading,
                                                        textAlign: 'right',
                                                        width: '20%'
                                                      }}>100%</Text>
                                                    </View>

                                                  </View>
                                                </View>

                                              )
                                            })
                                          }
                                        </ScrollView>

                                      </>
                                    }


                                  </View>

                                  {
                                    (this.state.reportsArr.length > 0) &&
                                    <View style={{
                                      position: 'absolute',
                                      bottom: 25,
                                      left: 0,
                                      width: '100%'
                                      // marginTop: 20
                                    }}>
                                      <Button
                                        text={'Submit'}
                                        // onLoading={this.state.loading}
                                        customStyles={
                                          {
                                            // mainContainer: styles.butonContainer
                                            mainContainer: {
                                              // width: '100%',

                                            }
                                          }
                                        }
                                        onPress={() => {
                                          this.setState({
                                            reportModalVisible: false,
                                          }, () => {
                                            this.upload_report_click()
                                          })

                                        }}
                                      // isBlank={false}
                                      />
                                    </View>
                                  }


                                </View>

                              </View>
                            </Modal>
                          </>
                        }

                      </View>
                    }

                    {/* patient details */}
                    <View style={{
                      width: "100%",
                      alignSelf: "center",
                      paddingVertical: (windowWidth * 3) / 100,
                    }}>
                      <View style={{
                        width: "100%",
                        paddingHorizontal: s(13),
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: "space-between",
                      }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.darkText,
                            alignSelf: 'center',

                          }}>{LanguageConfiguration.patient_details[Configurations.language]}</Text>
                        <TouchableOpacity onPress={() => {
                          this.setState({
                            showPDetails: !this.state.showPDetails
                          })
                        }}>
                          <View style={{
                            padding: 15,
                            backgroundColor: Colors.backgroundcolor,
                            justifyContent: "center",
                          }}>
                            <Image
                              style={{
                                height: (mobileW * 4.5) / 100,
                                width: (mobileW * 4.5) / 100,
                              }}
                              source={(this.state.showPDetails) ? Icons.UpArrow : Icons.DownArrow} />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {
                        (this.state.showPDetails) &&
                        <View style={{
                          width: "100%",
                          paddingHorizontal: s(13),
                        }}>
                          <Text
                            style={{
                              color: Colors.DarkGrey,
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              textAlign: Configurations.textalign,
                              alignSelf: 'flex-start',
                              marginTop: (windowWidth * 1) / 100,

                            }}>
                            {item.patient_name}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: (windowWidth * 1.5) / 100,
                              width: "100%",
                            }}>
                            <Image
                              source={Icons.Location}
                              style={{
                                marginTop: (windowWidth * 1) / 100,
                                width: (windowWidth * 3.5) / 100,
                                height: (windowWidth * 3.5) / 100,
                                resizeMode: "contain",
                                tintColor: Colors.Theme,
                              }}></Image>

                            <Text
                              style={{
                                color: Colors.DarkGrey,
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                alignSelf: 'flex-start',
                                marginLeft: (windowWidth * 3) / 100,
                                width: "96%",

                              }}>
                              {item.patient_address}
                            </Text>


                          </View>

                          <View>
                            <TouchableOpacity onPress={() => {
                              console.log({ item });
                              this.handleGetDirections(item?.patient_lat, item?.patient_long, item?.patient_address)
                            }}>
                              <Text
                                style={{
                                  color: Colors.textblue,
                                  fontFamily: Font.Medium,
                                  fontSize: Font.sregulartext_size,
                                  textAlign: Configurations.textRotate,
                                  marginLeft: mobileW * 6.5 / 100,
                                  marginTop: mobileW * 2 / 100,
                                  width: '96%'

                                }}>
                                Open Google Map
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: mobileW * 2 / 100
                            }}>
                            {Configurations.language == 0 ?
                              <Image
                                source={Icons.PhoneSettings}
                                style={{
                                  width: (mobileW * 3.5) / 100,
                                  height: (mobileW * 3.5) / 100,
                                  resizeMode: 'contain',
                                  tintColor: Colors.theme_color,
                                }}></Image> :
                              <Image
                                source={Icons.CallRTL}
                                style={{
                                  width: (mobileW * 3.5) / 100,
                                  height: (mobileW * 3.5) / 100,
                                  resizeMode: 'contain',
                                  tintColor: Colors.theme_color,
                                }}></Image>}
                            <Text
                              style={{
                                color: Colors.lightgraytext,
                                fontFamily: Font.Medium,
                                fontSize: Font.sregulartext_size,
                                textAlign: Configurations.textalign,
                                marginHorizontal: (mobileW * 3) / 100,
                              }}>
                              {item.patient_contact}
                            </Text>
                            <TouchableOpacity onPress={() => {
                              Linking.openURL(`tel:${item.patient_contact}`)
                            }}>
                              <Text
                                style={{
                                  color: Colors.textblue,
                                  fontFamily: Font.Medium,
                                  fontSize: Font.sregulartext_size,
                                  textAlign: Configurations.textRotate,
                                  marginLeft: mobileW * 2 / 100,
                                  width: '96%'

                                }}>
                                Call
                              </Text>
                            </TouchableOpacity>

                          </View>
                        </View>
                      }
                    </View>
                    {(item.acceptance_status == 'Accepted' && (item.service_type != "Doctor" && item.service_type != "Lab")) ?
                      (item?.OTP == "") ?
                        <>
                          <View style={{
                            width: '90%',
                            alignSelf: 'center', paddingVertical: mobileW * 2 / 100,
                            flexDirection: 'row', borderTopWidth: 1,
                            borderTopColor: Colors.bordercolor,
                            alignItems: 'center'
                          }}>
                            <View style={{
                              // backgroundColor: '#F7F8FA'
                              width: '60%'
                            }}>
                              <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '75%', textAlign: Configurations.textRotate, fontFamily: Font.Medium }}>Enter OTP to complete</Text>
                            </View>
                            <View style={{
                              backgroundColor: '#F7F8FA',
                              width: '40%',
                              flexDirection: 'row',
                              borderRadius: 5
                              // justifyContent: 'space-between'
                            }}>
                              <TextInput
                                style={{
                                  height: 30,
                                  width: '75%',
                                  // backgroundColor: 'red',
                                  alignItems: 'center',
                                  textAlign: 'center',
                                  padding: 0,
                                  color: 'black'
                                }}
                                onChangeText={(text) => {
                                  this.setState({
                                    ennterOTP: text
                                  })
                                }}
                                value={this.state.ennterOTP}
                                placeholder='Enter OTP'
                                placeholderTextColor={'#354052'}
                                keyboardType="number-pad"
                                returnKeyLabel='done'
                                returnKeyType='done'
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  this.otpPressed(item?.id)
                                }}
                                style={{
                                  width: '25%',
                                  // paddingLeft: 5,
                                  // paddingRight: 3,
                                  borderLeftWidth: 1,
                                  borderLeftColor: '#E2E7EE',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                <Icon style={{ alignSelf: 'center' }}
                                  name={"send-sharp"}
                                  size={20}
                                  color={'#0888D1'}></Icon>
                              </TouchableOpacity>
                            </View>

                          </View>
                        </> :
                        <>
                          <View style={{ width: '90%', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.bordercolor }}>
                            <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '75%', textAlign: Configurations.textRotate, fontFamily: Font.Medium }}>{LanguageConfiguration.appointment_closed_otp_text[Configurations.language]}</Text>
                            <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '25%', textAlign: 'right', fontFamily: Font.Medium }}>{item.OTP}</Text>
                          </View>
                        </> : null


                    }
                    {(item.acceptance_status == 'Completed' && (item.service_type != "Doctor" && item.service_type != "Lab")) &&
                      <View style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingVertical: (windowWidth * 2) / 100,
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderTopColor: Colors.backgroundcolor,
                        paddingHorizontal: s(13)
                      }}>
                        <Text style={{
                          fontSize: Font.small,
                          color: Colors.Green,
                          width: "75%",
                          alignSelf: 'flex-start',
                          fontFamily: Font.Regular,
                        }}>{LanguageConfiguration.appointment_closed_otp_text[Configurations.language]}</Text>
                        <Text style={{ fontSize: Font.small, color: Colors.buttoncolorhgreen, width: '25%', textAlign: 'right', fontFamily: Font.Regular }}>{item.OTP}</Text>
                      </View>
                    }
                    {/* payment details */}
                    <View style={{
                      backgroundColor: Colors.appointmentdetaillightgray,
                      width: "100%",
                      paddingHorizontal: s(13),
                      paddingVertical: vs(9)
                    }}>

                      <View
                        style={{
                          width: "100%",
                          alignSelf: "center",


                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            alignSelf: 'flex-start',
                            color: Colors.darkText,
                          }}>{LanguageConfiguration.Payment[Configurations.language]}

                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                            borderBottomWidth: 1.5,
                            borderColor: '#CCCCCC',
                          }}>
                          <FlatList
                            data={item.task_details}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            renderItem={({ item, index }) => {
                              if (item.task_details != '') {
                                return (
                                  <TouchableOpacity activeOpacity={0.9}
                                    // onPress={() => { this.check_all(item, index) }}
                                    style={{
                                      alignItems: "center",
                                      width: "100%",
                                      paddingVertical: (windowWidth * 1.7) / 100,
                                      flexDirection: "row",
                                      justifyContent: 'space-between'
                                    }}>

                                    <Text
                                      style={{
                                        alignSelf: "center",
                                        fontSize: Font.small,
                                        fontFamily: Font.Regular,
                                        color: Colors.DarkGrey,
                                      }}>
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: Font.small,
                                        fontFamily: Font.Regular,
                                        color: Colors.DarkGrey,
                                      }}>
                                      {item.price}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }
                            }}></FlatList>

                        </View>
                        {
                          (item.appointment_type != "Online") &&
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingVertical: (windowWidth * 2) / 100,
                              // borderBottomWidth: (windowWidth * 0.3) / 100,
                              borderColor: Colors.bordercolor,
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.DarkGrey,
                              }}>{LanguageConfiguration.distanceFare[Configurations.language]}

                            </Text>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.DarkGrey,
                              }}>{item.distance_fee}

                            </Text>
                          </View>
                        }

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 1) / 100,
                            borderColor: Colors.bordercolor,
                            marginTop: (windowWidth * 1) / 100,
                            marginBottom: (windowWidth * 3) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                            }}>{item.vat_percent}

                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                            }}>{item.vat}

                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.darkText,
                            }}>
                            {'Subtotal'}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.darkText,
                            }}>
                            {item.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* last button */}
                    <View
                      style={[{
                        width: '91%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        backgroundColor: Colors.white_color,
                        paddingTop: (mobileW * 3) / 100,
                        paddingBottom: mobileW * 3 / 100,
                        alignItems: 'center',

                        // borderTopWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.bordercolor,

                      }, item.acceptance_status != 'Rejected' ? { justifyContent: 'space-between' } : null]}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          width: '40%'
                        }}>
                        {Configurations.language == 0 ?
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
                            }}></Image>}
                        <Text
                          style={{
                            color: Colors.theme_color,
                            fontSize: (mobileW * 3.7) / 100,
                            fontFamily: Font.Medium,
                            marginTop: 0.5,
                            marginLeft: mobileW * 2 / 100
                          }}>{item.price}

                        </Text>
                      </View>
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        width: '60%',
                        // backgroundColor: 'red'
                      }}>
                        {item.acceptance_status == 'Pending' &&
                          <>
                            <TouchableOpacity onPress={() => {
                              this.updateProviderAppointmentStatus("Accept", item.id)
                            }}

                              style={{
                                backgroundColor: Colors.buttoncolorhgreen,
                                width: '40%',
                                borderRadius: (mobileW * 1) / 100,
                                paddingVertical: (mobileW * 2) / 100,
                                justifyContent: 'center',
                                marginHorizontal: '4%'
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: Colors.white_color,
                                  textTransform: 'uppercase',
                                  fontFamily: Font.SemiBold,
                                  fontSize: mobileW * 3 / 100,
                                }}>Accept</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                this.showConfirmDialogReject("Reject", item.id)
                              }}

                              style={{
                                backgroundColor: '#FF4500',
                                width: '40%',
                                borderRadius: (mobileW * 1) / 100,
                                paddingVertical: (mobileW * 2) / 100,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: Colors.white_color,
                                  textTransform: 'uppercase',
                                  fontFamily: Font.SemiBold,
                                  fontSize: mobileW * 3 / 100,
                                }}>Reject</Text>
                            </TouchableOpacity>
                          </>
                        }
                        <CameraGallery mediamodal={this.state.mediamodal}
                          isCamera={false}
                          isGallery={true}
                          isDocument={true}
                          Camerapopen={() => { this.Camerapopen() }}
                          Galleryopen={() => { this.Galleryopen() }}
                          DocumentGalleryopen={() => { this.DocumentGalleryopen() }}
                          Canclemedia={() => {
                            this.setState({
                              mediamodal: false,
                              reportModalVisible: (this.state.isFromReportModal == true) ? true : false
                            })
                          }}
                        />
                        {(item.acceptance_status == 'Accepted' &&
                          item.service_type == "Doctor" &&
                          item.appointment_type == "Online" && VideoCallBtn == true) &&
                          item.booking_type === 'online_task' &&
                          <>
                            <TouchableOpacity onPress={() => {
                              this.props.navigation.navigate(ScreenReferences.VideoCall, {
                                item: item
                              });
                            }}

                              style={{
                                backgroundColor: Colors.buttoncolorhgreen,
                                // width: mobileW * 22 / 100,
                                borderRadius: (mobileW * 1) / 100,
                                // paddingVertical: (mobileW * 1.5) / 100,
                                padding: (mobileW * 2) / 100,
                                justifyContent: 'center',

                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: Colors.white_color,
                                  textTransform: 'uppercase',
                                  fontFamily: Font.SemiBold,
                                  fontSize: mobileW * 3 / 100,
                                }}>VIDEO CALL</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  id: item.id,
                                }, () => {
                                  this.showConfirmDialogReject("Reject")
                                })
                              }}
                              style={{
                                // width: '10%',
                                // alignSelf: 'center',
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
                            </TouchableOpacity> */}
                          </>
                        }

                        {
                          (item.acceptance_status == 'Accepted' && UploadprecriptionBtn == true &&
                            item.service_type == "Doctor" && item.provider_prescription == null) &&
                          <>
                            <TouchableOpacity onPress={() => {
                              this.setState({
                                imageType: 'provider_prescription',
                                mediamodal: true
                              }, () => {

                              })
                            }}

                              style={{
                                backgroundColor: Colors.orange,
                                // width: mobileW * 39 / 100,
                                borderRadius: (mobileW * 1) / 100,
                                // paddingVertical: (mobileW * 1.5) / 100,
                                padding: (mobileW * 2) / 100,
                                justifyContent: 'center',
                                marginLeft: 7
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: Colors.white_color,
                                  textTransform: 'uppercase',
                                  fontFamily: Font.SemiBold,
                                  fontSize: mobileW * 3 / 100,
                                }}>UPLOAD Prescription</Text>
                            </TouchableOpacity>
                          </>
                        }

                        {item.acceptance_status == 'Completed' &&
                          <View style={{ alignItems: 'flex-end' }}>
                            {item.avg_rating != '' && item.avg_rating != 0 ?
                              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '2%' }}>
                                <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 3.5 / 100, marginRight: mobileW * 2 / 100 }}>{LanguageConfiguration.rated[Configurations.language]}</Text>
                                <StarRating
                                  disabled={false}
                                  fullStar={Icons.YellowStar}
                                  emptyStar={Icons.UnfilledStar}
                                  maxStars={5}
                                  starSize={15}
                                  rating={item.avg_rating}

                                />

                              </View> :
                              <>
                                <Text style={{
                                  fontFamily: Font.Regular, color: '#000',
                                  fontSize: mobileW * 3.5 / 100,
                                  //  marginRight: mobileW * 2 / 100,
                                  textAlign: 'right',
                                }}>{'Not Rated Yet'}</Text>
                              </>
                            }
                          </View>
                        }
                        {item.acceptance_status == 'Rejected' && item.rf_text != '' &&
                          <View

                            style={{
                              width: mobileW * 24 / 100,
                              borderRadius: 1,
                              paddingVertical: (mobileW * 1) / 100,
                              justifyContent: 'center',
                              marginLeft: mobileW * 2 / 100
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: '#FF4500',
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: Font.medium,
                              }}>{LanguageConfiguration.Refunde[Configurations.language]}

                            </Text>
                          </View>}
                      </View>
                    </View>
                  </View>

                </View>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      );
    }
    else {
      return (
        <View>

        </View>
      )
    }
  }
}