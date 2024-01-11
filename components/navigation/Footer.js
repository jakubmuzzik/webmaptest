import React from 'react'
import { View, Text } from 'react-native'
import { COLORS, SPACING, FONTS, FONT_SIZES } from '../../constants'
import { normalize } from '../../utils'
import HoverableText from '../HoverableText'

const Footer = () => {

    const onPress = () => {

    }

    return (
        <View style={{ padding: SPACING.large, backgroundColor: COLORS.darkGrey, borderTopWidth: 1, borderColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'row' }}>
            <HoverableText onPress={onPress} textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, marginHorizontal: SPACING.medium }} hoveredColor='#FFF' text="About Us" />
            <HoverableText onPress={onPress} textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, marginHorizontal: SPACING.medium }} hoveredColor='#FFF' text="FAQ" />
            <HoverableText onPress={onPress} textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, marginHorizontal: SPACING.medium }} hoveredColor='#FFF' text="Privacy Policy" />
            <HoverableText onPress={onPress} textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, marginHorizontal: SPACING.medium }} hoveredColor='#FFF' text="Terms of Service" />
        </View>
    )
}

export default Footer