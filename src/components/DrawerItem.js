import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions, } from "react-native";
import { s, vs } from "react-native-size-matters";
import { SvgXml } from 'react-native-svg';

import { Colors } from "../Provider/Colorsfont";
import { Font } from "../Provider/Colorsfont";
import { Configurations } from "../Provider/configProvider";

const deviceWidth = Dimensions.get('window').width
let isGuest = false;


const DrawerItemContainer = ({
    leftIcon,
    rightIcon,
    title,
    subtitle,
    onPress,
    disable = false,
    titleStyle = {}
}) => {

    const styles = StyleSheet.create({
        mainContainer: {
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: vs(22),
            paddingLeft: vs(19),

        },
        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '87%',
        },
        leftContainer: {
            width: '13%',

        },
        title: {
            color: Colors.Black,
            fontFamily: Font.Regular,
            fontSize: 14,
            textAlign: Configurations.textRotate,
            opacity: (isGuest === 'true' && disable == true) ? 0.3 : 1
        },
        desc: {
            color: Colors.DarkGrey,
            fontFamily: Font.Regular,
            fontSize: 12,
            textAlign: Configurations.textRotate,
            marginTop: vs(4),
            opacity: (isGuest === 'true' && disable == true) ? 0.3 : 1
        }


    });

    return (
        <TouchableOpacity
            disabled={(isGuest === 'true' && disable == true) ? true : false}
            activeOpacity={0.6}
            onPress={onPress ? onPress : () => { }}
            style={styles.mainContainer}>

            <View style={styles.leftContainer}>
                {
                    leftIcon &&
                    <Image source={leftIcon} resizeMethod='resize' resizeMode="contain" style={{
                        height: vs(18),
                        width: vs(18),
                        tintColor: Colors.DarkGrey
                    }} />
                }
            </View>


            <View style={styles.rightContainer}>
                <View style={{ width: '75%', justifyContent: 'center' }}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {
                        subtitle &&
                        <Text style={styles.desc}>{subtitle}</Text>

                    }
                </View>
                {
                    rightIcon &&
                    <View style={{ width: '19%', justifyContent: 'center', alignItems: 'center' }}>
                        <SvgXml xml={rightIcon} height={vs(11.98)} width={s(6.42)} />
                    </View>
                }
            </View>
        </TouchableOpacity>

    )
}


export default DrawerItemContainer;


