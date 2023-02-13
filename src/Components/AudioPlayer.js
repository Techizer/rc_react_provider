import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, LayoutAnimation, UIManager, Image } from "react-native";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import { s } from "react-native-size-matters";
import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth } from "../Helpers/Utils";
import { Icons } from "../Assets/Icons/IReferences";

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

const volumeControlTime = 3000;

export const AudioPlayer = ({ url, style, repeatOnComponent, repeatOffComponent }) => {
    const [paused, setPaused] = useState(true);

    const videoRef = useRef(null);
    const controlTimer = useRef(0);

    const [totalLength, setTotalLength] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [volumeControl, setVolumeControl] = useState(false);
    const [repeat, setRepeat] = useState(false);

    const toHHMMSS = (secs) => {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;

        return [hours, minutes, seconds]
            .map((v) => (v < 10 ? "0" + v : v))
            .filter((v, i) => v !== "00" || i > 0)
            .join(":");
    }


    const onSeek = (time) => {
        time = Math.round(time);
        if (time != Math.round(currentPosition)) {
            videoRef && videoRef.current.seek(time);
            setCurrentPosition(time);
        } else {
            console.log('logging');
        }
        console.log({ Seektime: time });
        console.log({ Position: currentPosition });

    };

    const fixDuration = (data) => {
        console.log('fixDuration');
        setLoading(false);
        setTotalLength(Math.floor(data.duration));
    };

    const setTime = (data) => {
        // console.log('setTime', data.currentTime);
        setCurrentPosition(Math.floor(data.currentTime) + 0.1);
    };

    const togglePlay = () => {
        setPaused(p => !p);
    };

    const toggleRepeat = () => {
        setRepeat(p => !p);
    };

    const toggleVolumeControl = () => {
        setVolumeTimer(p => !p);
        LayoutAnimation.easeInEaseOut();
        setVolumeControl(p => !p);
    };

    const setVolumeTimer = (setTimer = true) => {
        clearTimeout(controlTimer.current);
        controlTimer.current = 0;
        if (setTimer) {
            controlTimer.current = setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                setVolumeControl(false);
            }, volumeControlTime);
        }
    };

    const onVolumeChange = (vol) => {
        setVolumeTimer();
        setVolume(vol);
    };

    const resetAudio = () => {
        console.log('on end');
        setTimeout(() => {
            setPaused(true);
            setCurrentPosition(0);
            videoRef.current.seek(0);
        }, 350);
    };

    const ta = ('' + url).split('.')
    const format = ta[ta.length-1]

    return (
        <View style={[style && style, {

            paddingBottom: 16
        }]}>
            <Video
                // source={{ uri: 'https://file-examples.com/storage/fe3f7d476663e91319de1d9/2017/11/file_example_MP3_700KB.mp3' }}
                
                source={{ uri: url, 
                    type: format ,
                    headers: {
                        'Content-Range': 'bytes 0-1053886/1053887'
                    }
                }}
                ref={videoRef}
                playInBackground={true}
                // audioOnly={true}
                playWhenInactive={false}
                paused={paused}
                onEnd={resetAudio}
                onLoad={fixDuration}
                
                onLoadStart={() => setLoading(true)}
                onError={(error) => {
                    console.log({error: error});
                }}
                allowsExternalPlayback={true}
                onProgress={setTime}
                volume={volume}
                repeat={false}
                style={{ height: 0, width: 0 }}
                bufferConfig={{
                    minBufferMs: 1000
                }}
                
                
                
            />

            <View style={{}}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

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
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '10%',
                        paddingHorizontal: s(5)
                    }}>
                        <TouchableOpacity onPress={togglePlay}>
                            <Image
                                source={paused ? Icons.Play : Icons.Pause}
                                style={styles.playIcon}
                            />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={Math.max(totalLength)}
                            minimumTrackTintColor={Colors.Theme}
                            maximumTrackTintColor={'grey'}
                            onSlidingComplete={(time) => {
                                onSeek(time)
                            }}
                            allowsExternalPlayback={true}
                            value={currentPosition}
                        />

                    </View>
                </View>
                <View style={styles.durationContainer}>
                    <Text style={[styles.timeText, { color: Colors.Theme }]}>
                        {toHHMMSS(currentPosition)}
                    </Text>
                    <Text style={[styles.timeText, { color: Colors.DarkGrey }]}>
                        {toHHMMSS(totalLength)}
                    </Text>
                </View>

            </View>
        </View>
    );
};



export const styles = StyleSheet.create({
    playBtn: {
        justifyContent: "center",
        alignItems: "center",
    },
    sliderContainer: {
        width: "60%",
    },
    slider: {
        width: "98%",
        height: (windowWidth * 10) / 100,
        paddingRight: s(10)
    },
    durationContainer:
    {
        width: '60%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: 'flex-end'
    },

    timeText: {
        fontSize: Font.small,
    },
    playIcon: { height: 35, width: 35, resizeMode: 'contain' },
});
