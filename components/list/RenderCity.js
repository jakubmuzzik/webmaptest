import React, { memo, useMemo } from "react"
import { StyleSheet, TouchableOpacity, Text, View } from "react-native"
import HoverableView from "../HoverableView"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING } from "../../constants"
import { normalize } from "../../utils"
import { useLinkProps } from "@react-navigation/native"

const RenderCity = ({ city, iconName, iconColor, route }) => {
    const cityNav = useMemo(() => ({
        screen: route.name,
        params: { ...route.params, city }
    }), [route])

    const { onPress: onNavPress, ...props } = useLinkProps({ to: cityNav })

    return (
        <HoverableView key={city} style={styles.cityContainer} hoveredBackgroundColor={COLORS.lightPlaceholder} backgroundColor='#FFF' transitionDuration='0ms'>
            <View onClick={onNavPress} {...props} style={{ flexDirection: 'row', width: '100%', paddingVertical: SPACING.xx_small, paddingLeft: SPACING.xx_small, alignItems: 'center' }}>
                <MaterialIcons style={{ paddingRight: SPACING.xx_small }} name={iconName} size={normalize(24)} color={iconColor} />
                <Text style={styles.city}>{city}</Text>
            </View>
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