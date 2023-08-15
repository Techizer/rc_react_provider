import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, Svg } from 'react-native-svg';
import { Colors, Font, windowWidth } from '../Helpers/Utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RegistrationSteps = ({
    progress = 0,
    radius = windowWidth / 7,
    strokeWidth = 6,
    onNext = () => { }
}) => {


    const circumference = progress == 0 ? (2 * Math.PI * radius) : (2 * Math.PI * radius) - (windowWidth / 18);
    const animatedProgress = useSharedValue(0);
    const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            zIndex:9999
        },
    });


    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 500,
            easing: Easing.linear,
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const normalizedProgress = Math.min(100, Math.max(0, animatedProgress.value));
        const strokeDashoffset = ((circumference * (100 - normalizedProgress)) / 100);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    onNext(progress + 25)
                }}
                style={{
                    height: windowWidth / 4.2,
                    width: windowWidth / 4.2,
                    borderRadius: windowWidth / 7,
                    backgroundColor: Colors.buttoncolorblue,
                    position: 'absolute',
                    zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Text
                    style={{
                        fontSize: Font.xxxlarge,
                        fontFamily: Font.Regular,
                        color: Colors.white_color,
                    }}>
                    {progress == 100 ? 'FINISH' : 'NEXT'}
                </Text>
            </TouchableOpacity>
            <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                <Circle
                    stroke="lightgrey"
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    strokeWidth={strokeWidth}

                />
                <AnimatedCircle
                    animatedProps={animatedProps}
                    stroke={Colors.buttoncolorblue}
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start from the top center
                />
            </Svg>
        </View>
    );


};


export default RegistrationSteps;
