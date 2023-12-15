import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FONTS, FONT_SIZES } from '../constants'

const NotFound = () => {
    return (
        <View style={{...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.h1, color: '#FFF' }}>Page does not exist</Text>
        </View>
    )
}

export default NotFound