import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    useAnimatedProps,
    interpolate,
} from 'react-native-reanimated';

import { Circle, Svg } from 'react-native-svg';
import { Colors, Font, windowWidth } from '../Helpers/Utils';
import { Icons } from '../Icons/IReferences';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RegistrationSteps = ({
    progressValue = 50,
    radius = windowWidth / 7,
    strokeWidth = 6,
    onNext = () => { },
    loading,
    completed
}) => {


    const circumference = progress == 0 ? (2 * Math.PI * radius) : (2 * Math.PI * radius) - (windowWidth / 19);
    const animatedProgress = useSharedValue(0);
    let progress = useSharedValue(0);
    const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: 9999,
            marginVertical: windowWidth / 18
        },
        progressBar: {
            width: 300,
            height: 20,
            borderWidth: 1,
            borderColor: 'gray',
        },
    });


    // useEffect(() => {
    //     animatedProgress.value = withTiming(progress, {
    //         duration: 500,
    //         easing: Easing.linear,
    //     });
    // }, [progress]);

    useEffect(() => {
        console.log({progressValue});
        progress = withTiming(progressValue);
    }, [progressValue]);

    const interpolatedWidth = interpolate(
        progress.value,
        [0, 1],
        [0, 300]
      );

    const animatedProps = useAnimatedProps(() => {
        const normalizedProgress = Math.min(100, Math.max(0, animatedProgress.value));
        const strokeDashoffset = ((circumference * (100 - normalizedProgress)) / 100);
        return {
            strokeDashoffset,
        };
    });


    const getProgressBarStyle = () => {
        const interpolatedWidth = interpolate(
          progressValue,
          [0, 1],
          [0, 300] // Change this value to match the desired width
        );
    
        return useAnimatedStyle(() => {
          return {
            width: interpolatedWidth,
            height: '100%',
            backgroundColor: 'blue',
          };
        });
      };
    return (
        // <View style={styles.container}>
        //     <TouchableOpacity
        //         disabled={completed}
        //         activeOpacity={0.7}
        //         onPress={() => {
        //             onNext(progress + 25)
        //         }}
        //         style={{
        //             height: windowWidth / 4.2,
        //             width: windowWidth / 4.2,
        //             borderRadius: windowWidth / 7,
        //             backgroundColor: completed ? Colors.Green : Colors.buttoncolorblue,
        //             position: 'absolute',
        //             zIndex: 9999,
        //             justifyContent: 'center',
        //             alignItems: 'center'
        //         }}>
        //         {
        //             loading ?
        //                 <BarIndicator color='white' size={(windowWidth / 15)} count={5} />
        //                 :
        //                 completed ?
        //                     <Image source={Icons.Tick}
        //                         style={{
        //                             height: windowWidth / 9,
        //                             width: windowWidth / 9,
        //                             tintColor: Colors.white_color
        //                         }}
        //                     />
        //                     :
        //                     <Text
        //                         style={{
        //                             fontSize: Font.xxxlarge,
        //                             fontFamily: Font.Regular,
        //                             color: Colors.white_color,
        //                         }}>
        //                         {progress == 100 ? 'FINISH' : 'NEXT'}
        //                     </Text>
        //         }

        //     </TouchableOpacity>
        //     <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        //         <Circle
        //             stroke="lightgrey"
        //             fill="none"
        //             cx={radius}
        //             cy={radius}
        //             r={radius - strokeWidth / 2}
        //             strokeWidth={strokeWidth}

        //         />
        //         <AnimatedCircle
        //             animatedProps={animatedProps}
        //             stroke={Colors.buttoncolorblue}
        //             fill="none"
        //             cx={radius}
        //             cy={radius}
        //             r={radius - strokeWidth / 2}
        //             strokeWidth={strokeWidth}
        //             strokeLinecap="round"
        //             strokeDasharray={`${circumference}, ${circumference}`}
        //             transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start from the top center
        //         />
        //     </Svg>
        // </View>

        <View style={styles.progressBar}>
            <Animated.View style={getProgressBarStyle()} />
        </View>


    );


};


export default RegistrationSteps;
