
import React, { Component, useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {
  Configurations, localStorage, API,
} from '../Helpers/Utils';

import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { min } from 'moment-timezone';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);


var countTimeInterval
var timerId

const VideoCall = (props) => {
  var ctc = 0
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState("");
  const [callDetails, setCallDetails] = useState({});
  const twilioVideo = useRef(null);
  const [mins, setMins] = useState(-1)
  const [secs, setSecs] = useState(0)
  const [started, setStarted] = useState(false);
  const [localtrackVideo, setlocaltrackVideo] = useState(true);

  useEffect(() => {
    if (props.route.params.item.ispage == "accept") {
      get_incoming_call_token('patient_to_doctor_video_call')
    } else {
      get_call_token('doctor_to_patient_video_call')
    }

    return () => {
      console.log('countTimeInterval', countTimeInterval, 'timerId', timerId);
      clearInterval(countTimeInterval)
      clearInterval(timerId)
    }
  }, []);

  useEffect(() => {
    if (token != "") {
      _onConnectButtonPress()
    }

  }, [token]);

  useEffect(() => {
    if (started) {
      timerId = setInterval(() => {

        if (secs > 58) {
          setStarted(false);
          setSecs(0);
        } else {
          setSecs(s => s + 1)
          console.log('secs:: ', secs);
        }

      }, 1000);
    } else {
      clearInterval(timerId);
      setMins(m => m + 1)
      setStarted(true)
    }
    return () => clearInterval(timerId);
  }, [started, secs, mins]);

  const callTimeCall = () => {
    setStarted(true)
  }

  const callTimeCallClear = () => {
    setMins(0)
    setSecs(0)
    clearInterval(timerId)
    props.navigation.goBack()
  }

  const countTimeCall = () => {
    countTimeInterval = setInterval(() => {
      ctc = parseInt(ctc) + parseInt(1)
      console.log("ctc:: ", ctc);
      if (ctc > 30) {
        _onEndButtonPress()
        clearInterval(countTimeInterval)
      }
    }, 1000);
  }

  const timerClear = () => {
    props.navigation.goBack()
  }

  const get_call_token = async (callType) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    let apiname = "api-get-video-access-token-with-push-notification"

    let apishow = apiname

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('fromUserId', user_id)
    data.append('fromUserName', props.route.params.item.provider_name)
    data.append('order_id', props.route.params.item.order_id)
    data.append('room_name', "rootvideo_room_" + props.route.params.item.patient_id + "_" + user_id)
    data.append('toUserId', props.route.params.item.patient_id)
    data.append('toUserName', props.route.params.item.patient_name)
    data.append('type', callType)


    API.post(url, data).then((obj) => {
      if (obj.status == true) {
        console.log('obj.result', obj.result)
        setToken(obj.result.token)
        setCallDetails(obj.result)
      } else {
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  const get_incoming_call_token = async (callType) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    // console.log('this.props.pageName:: ', this.props.pageName);

    let apiname = "api-get-video-access-token"

    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('identity', user_id)
    data.append('fromUserId', props.route.params.item.fromUserId)
    data.append('fromUserName', props.route.params.item.fromUserName)
    data.append('order_id', props.route.params.item.order_id)
    data.append('room_name', props.route.params.item.room_name)
    data.append('toUserId', props.route.params.item.toUserId)
    data.append('toUserName', props.route.params.item.toUserName)
    data.append('type', props.route.params.item.type)



    API.post(url, data).then((obj) => {
      // API.postRaw(url, myData).then((obj) => {

      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        console.log('obj.result', obj.result)
        setToken(obj.result)
        setCallDetails(obj.result)
      } else {
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  const _onConnectButtonPress = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
    twilioVideo.current.connect({
      accessToken: token,
      enableNetworkQualityReporting: true,
      dominantSpeakerEnabled: true
    });
    setStatus("connecting");
    countTimeCall()
  };

  const _onEndButtonPress = () => {
    twilioVideo.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };

  const _onRoomDidConnect = () => {
    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({ error }) => {
    console.log("ERROR _onRoomDidDisconnect: ", error);
    timerClear()
    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("ERROR: ", error);
    // timerClear()
    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
    setlocaltrackVideo(false)

    clearInterval(countTimeInterval)
    callTimeCall()
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const newVideoTracks = new Map(videoTracks);
    newVideoTracks.delete(track.trackSid);

    setVideoTracks(newVideoTracks);
    callTimeCallClear()
  };

  const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
    console.log("Participant", participant, "isLocalUser", isLocalUser, "quality", quality);
    if (isLocalUser == false && localtrackVideo == false) {
      setlocaltrackVideo(true)
    }
  };

  const _onDominantSpeakerDidChange = ({ roomName, roomSid, participant }) => {
    console.log("onDominantSpeakerDidChange", `roomName: ${roomName}`, `roomSid: ${roomSid}`, "participant:", participant);
  };

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Need permission to access microphone",
        message:
          "To run this demo we need permission to access your microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Need permission to access camera",
      message: "To run this demo we need permission to access your camera",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };

  return (
    <View style={style1.container}>

      {(status === "connected" || status === "connecting") && (
        <View style={style1.callContainer}>

          {status === "connected" && (
            <View style={style1.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={style1.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={style1.optionsContainer}>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
              marginBottom: 25
            }}>
              <Text style={{
                color: "#515C6F"
              }}>Video Consultation {props.route.params.item.order_id}</Text>
              <View style={{
                flexDirection: 'row',
                marginLeft: 15
              }}>
                <Entypo style={{ alignSelf: 'center' }}
                  name={"back-in-time"}
                  size={15}
                  color={'#515C6F'} />
                <Text style={{
                  color: "#E2E7EE",
                  marginLeft: 5
                }}>{mins < 10 && 0}{mins}:{secs < 10 && 0}{secs}</Text>
              </View>

            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={style1.optionButton}
                onPress={_onFlipButtonPress}
              >
                {/* <Text style={{ fontSize: 12 }}>Flip</Text> */}
                <MaterialCommunityIcons style={{ alignSelf: 'center' }}
                  name={"camera-flip"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={style1.optionButton}
                onPress={_onMuteButtonPress}
              >
                {/* <Text style={{ fontSize: 12 }}>
                  {isAudioEnabled ? "Mute" : "Unmute"}
                </Text> */}
                <Ionicons style={{ alignSelf: 'center' }}
                  name={isAudioEnabled ? "mic" : "mic-off"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={style1.optionButtonEnd}
                onPress={_onEndButtonPress}
              >
                <MaterialIcons style={{ alignSelf: 'center' }}
                  name={"call-end"}
                  size={28}
                  color={'#FFF'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={style1.localVideo}>
            {
              (localtrackVideo) &&
              <TwilioVideoLocalView enabled={true} style={{
                width: 150,
                height: 150,
                backgroundColor: 'black'
              }} />
            }

          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
        onDominantSpeakerDidChange={_onDominantSpeakerDidChange}
      />
    </View>
  );
};

export default VideoCall;

const style1 = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 150,
    height: 150,
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: 'black'
  },
  remoteGrid: {
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 170,
    backgroundColor: "#041A27",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "#515C6F",
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtonEnd: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "#FF4E00",
    justifyContent: "center",
    alignItems: "center",
  },

})