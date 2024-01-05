import React, { memo, useState, useRef, useMemo, useCallback } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES } from "../../constants"
import { normalize, stripEmptyParams, getParam } from "../../utils"
import { Image } from 'expo-image'
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel'
import { isBrowser } from 'react-device-detect'
import { IconButton } from "react-native-paper"
import { useSearchParams, Link } from 'react-router-dom'
import DropdownSelect from "../DropdownSelect"

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const RenderAccountLady = ({ lady, width, showPrice = true, actions=[], offsetX = 0}) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const actionsDropdownRef = useRef()

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}
                onMouseEnter={isBrowser ? () => setIsHovered(true) : undefined}
                onMouseLeave={isBrowser ? () => setIsHovered(false) : undefined}
            >
                <View style={{ borderRadius: 10, overflow: 'hidden', height: (width / 3) * 4, width: Math.ceil(width) }}>
                    <Image
                        style={{
                            flex: 1,
                            // aspectRatio: 3 / 4,
                            //borderRadius: 20
                        }}
                        source={lady.images[0]}
                        placeholder={blurhash}
                        resizeMode="cover"
                        transition={200}
                        alt={lady.name}
                    />
                </View>


                <View style={{
                    position: 'absolute',
                    right: 2,
                    top: 2,
                }}>
                    <DropdownSelect
                        ref={actionsDropdownRef}
                        offsetX={offsetX}
                        values={actions.map(action => action.label)}
                        setText={(text) => actions.find(action => action.label === text).onPress()}
                    >
                        <IconButton
                            icon="dots-horizontal"
                            iconColor="#FFF"
                            containerColor={COLORS.grey + 'B3'}
                            size={18}
                            onPress={() => actionsDropdownRef.current?.onDropdownPress()}
                        />
                    </DropdownSelect>

                </View>
            </View>

            <Text numberOfLines={1} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF', marginTop: SPACING.x_small }}>
                {lady.name}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText }}>
                Created: 21.05.2023
            </Text>
        </View>
    )
}

export default memo(RenderAccountLady)

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