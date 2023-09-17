import React, { memo } from "react"
import { StyleSheet, TouchableOpacity, Text } from "react-native"
import HoverableView from "../HoverableView"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING } from "../../constants"
import { normalize } from "../../utils"

const RenderCity = ({ city, onSelectCity, iconName, iconColor }) => {
    return (
        <HoverableView key={city} style={styles.cityContainer} hoveredBackgroundColor={COLORS.lightPlaceholder} backgroundColor='#FFF' transitionDuration='0ms'>
            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', paddingVertical: SPACING.xx_small, paddingLeft: SPACING.xx_small, alignItems: 'center' }} onPress={() => onSelectCity(city)}>
                <MaterialIcons style={{ paddingRight: SPACING.xx_small }} name={iconName} size={normalize(24)} color={iconColor} />
                <Text style={styles.city}>{city}</Text>
            </TouchableOpacity>
        </HoverableView>
    )
}

export default memo(RenderCity)

const styles = StyleSheet.create({
    city: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium
    },
    cityContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.small
    },
})