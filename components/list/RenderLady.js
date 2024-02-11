import React, { memo, useState, useRef, useMemo, useCallback } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES } from "../../constants"
import { normalize, stripEmptyParams, getParam, calculateAgeFromDate } from "../../utils"
import { Image } from 'expo-image'
import { isBrowser } from 'react-device-detect'

import { useSearchParams, Link } from 'react-router-dom'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const RenderLady = ({ lady, width }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const [isHovered, setIsHovered] = useState(false)

    return (
        <View style={styles.container}>
            <Link to={{ pathname: '/profile/' + lady.id, search: new URLSearchParams(stripEmptyParams(params)).toString() }} state={{ lady }}>
                <View style={{ flex: 1 }}
                    onMouseEnter={isBrowser ? () => setIsHovered(true) : undefined}
                    onMouseLeave={isBrowser ? () => setIsHovered(false) : undefined}
                >
                    <Image
                        style={{
                            borderRadius: 10,
                            overflow: 'hidden',
                            aspectRatio: 3 / 4,
                            width
                        }}
                        source={lady.images[0].downloadUrl}
                        placeholder={lady.images[0].blurhash}
                        resizeMode="cover"
                        transition={200}
                        alt={lady.name}
                    />
                </View>
            </Link>

            <Text numberOfLines={1} style={{ textAlign: 'center', fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.white, marginTop: SPACING.x_small }}>
                {lady.name}
            </Text>
            <Text numberOfLines={1} style={{ textAlign: 'center', fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, color: COLORS.greyText }}>
                {calculateAgeFromDate(lady.dateOfBirth) + ' years'} <Text style={{ color: COLORS.red }}>•</Text> {lady.address.city}
            </Text>
        </View>
    )
}

export default memo(RenderLady)

const styles = StyleSheet.create({
    container: {
        //padding: SPACING.xx_small, 
        flexDirection: 'column',
        flexGrow: 1,
        //backgroundColor: COLORS.grey,
        borderRadius: 10,
        //marginRight: SPACING.large
    },
})