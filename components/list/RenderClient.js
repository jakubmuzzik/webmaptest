import React, { memo, useMemo,  } from "react"
import { StyleSheet, Pressable, Text, View } from "react-native"
import HoverableView from "../HoverableView"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING, SMALL_SCREEN_THRESHOLD, LARGE_SCREEN_THRESHOLD } from "../../constants"
import { normalize } from "../../utils"
import { Image } from 'expo-image'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const RenderClient = ({ client }) => {
    return (
        <Pressable style={styles.container}>
            <Image
                style={{
                    flex: 1,
                    aspectRatio: 3/4,
                    borderRadius: 20
                }}
                source={client.profilePhoto}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                alt={client.name}
            />
            <Text numberOfLines={1} style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginTop: SPACING.x_small }}>
                {client.name}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                {client.text1}
            </Text>
            <Text numberOfLines={1} style={{ marginTop: SPACING.xxx_small, fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                {client.text2}
            </Text>
        </Pressable>
    )
}

export default memo(RenderClient)

const styles = StyleSheet.create({
    container: {
        padding: SPACING.xx_small, 
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: COLORS.grey,
        margin: SPACING.small,
        borderRadius: 20
    },
})