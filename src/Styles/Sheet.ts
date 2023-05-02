import * as React from 'react'
import { StyleSheet } from 'react-native'
import { vs } from 'react-native-size-matters'
import { Colors, Font, windowHeight } from '../Helpers/Utils'
import { RBSheetProps } from 'react-native-raw-bottom-sheet'

export const BottomSheetProps = {
    animationType: 'slide',
    height: windowHeight,
    closeOnPressBack: true
}

export const BottomSheetStyles: RBSheetProps["customStyles"] = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: vs(12),
        borderTopRightRadius: vs(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: windowHeight - (windowHeight / 1.75)
    }
})

export const BottomSheetStylesForLarge: RBSheetProps["customStyles"] = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: vs(12),
        borderTopRightRadius: vs(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: windowHeight - (windowHeight / 1.55)
    }
})

export const BottomSheetStylesForSmall: RBSheetProps["customStyles"] = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: vs(12),
        borderTopRightRadius: vs(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: windowHeight - (windowHeight / 3)
    }
})

export const BottomSheetViewStyles = StyleSheet.create({
    MainView: {
        flex: 1
    },
    ButtonContainer: {
        height: windowHeight / 14,
        width: '100%',
        alignItems: 'center'
    },
    ButtonContainerSmall: {
        height: windowHeight / 14,
        width: '100%',
        alignItems: 'center'
    },
    Button: {
        padding: vs(8),
        margin: vs(8),
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: windowHeight / 20,
        width: windowHeight / 20,
        borderRadius: windowHeight / 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Body: {
        backgroundColor: Colors.White,
        flex: 1,
        borderTopLeftRadius: vs(12),
        borderTopRightRadius: vs(12),
    },
    TitleBar: {

        borderTopLeftRadius: vs(12),
        borderTopRightRadius: vs(12),
        paddingVertical: vs(14),
        width: '100%',
        backgroundColor: Colors.White

    },
    Title: {
        paddingLeft: 15,
        color: Colors.Black,
        fontSize: Font.large,
        fontFamily: Font.Bold,
        marginTop: vs(8)
    },
    ScrollContainer: {
        backgroundColor: Colors.White,
        paddingBottom: '15%'
    },
    FlatListChild: {
        backgroundColor: Colors.White,
        paddingBottom: vs(10)
    }
})