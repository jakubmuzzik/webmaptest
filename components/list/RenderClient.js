import React, { memo, useState, useRef, useMemo, useCallback } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING, isSmallScreen, SUPPORTED_LANGUAGES } from "../../constants"
import { normalize, stripEmptyParams } from "../../utils"
import { Image } from 'expo-image'
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel'
import { useRoute } from '@react-navigation/native'
import { useLinkProps } from '@react-navigation/native'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const RenderClient = ({ client, width, showPrice = true }) => {
    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const carouselRef = useRef()
    const carouselX = useRef(0)

    const route = useRoute()

    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(route.params.language) ? route.params.language : ''
    }), [route.params])

    const { onPress, ...props } = useLinkProps({ to: { screen: 'Profile', params: { ...stripEmptyParams(params), id: client.id } } })

    const onNextPress = (event) => {
        event.preventDefault()
        carouselRef.current.scrollToOffset({ offset: (Math.floor(carouselX.current / width) + 1) * width, animated: true })
    }

    const onPrevPress = (event) => {
        event.preventDefault()
        carouselRef.current.scrollToOffset({ offset: (Math.floor(carouselX.current / width) - 1) * width, animated: true })
    }

    const handleScroll = ({ nativeEvent }) => {
        carouselX.current = nativeEvent.contentOffset.x
        const newIndex = Math.floor(carouselX.current / width)
        if (newIndex != index) {
            setIndex(newIndex)
        }
    }

    const renderImage = useCallback(({ item }) => (
        <View style={{ height: (width / 3) * 4, width: width, borderRadius: 20, overflow: 'hidden' }}>
            <Image
                style={{
                    flex: 1,
                    // aspectRatio: 3 / 4,
                    borderRadius: 20
                }}
                source={item}
                placeholder={blurhash}
                contentFit="cover"
                transition={200}
                alt={client.name}
            />
        </View>
    ), [width])

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}
                onClick={onPress}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...props}
            >
                <FlatList
                    ref={carouselRef}
                    data={client.images}
                    renderItem={renderImage}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    pagingEnabled
                    initialScrollIndex={0}
                    onScroll={handleScroll}
                />

                <View style={{
                    position: 'absolute',
                    opacity: isHovered && !isSmallScreen && index !== 0 ? 0.7 : 0,
                    transitionDuration: '150ms',
                    left: 10,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <MaterialIcons onPress={onPrevPress}
                        style={{
                            borderRadius: 25,
                            backgroundColor: '#FFF',
                            padding: 3,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: 0.32,
                            shadowRadius: 5.46,
                            elevation: 9,
                        }}
                        name="keyboard-arrow-left"
                        size={25}
                        color={COLORS.lightBlack}
                    />
                </View>
                <View style={{
                    position: 'absolute',
                    opacity: isHovered && !isSmallScreen && index !== client.images.length - 1 ? 0.7 : 0,
                    transitionDuration: '150ms',
                    right: 10,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <MaterialIcons onPress={onNextPress}
                        style={{
                            borderRadius: 25,
                            backgroundColor: '#FFF',
                            padding: 3,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: 0.32,
                            shadowRadius: 5.46,
                            elevation: 9,
                        }}
                        name="keyboard-arrow-right"
                        size={25}
                        color={COLORS.lightBlack}
                    />
                </View>

                <View style={{ position: 'absolute', bottom: normalize(20), left: 0, right: 0 }}>
                    <View style={{ alignSelf: 'center' }}>
                        <AnimatedDotsCarousel
                            length={client.images.length}
                            currentIndex={index}
                            maxIndicators={4}
                            interpolateOpacityAndColor={true}
                            activeIndicatorConfig={{
                                color: COLORS.red,
                                margin: 3,
                                opacity: 1,
                                size: 7,
                            }}
                            inactiveIndicatorConfig={{
                                color: 'white',
                                margin: 3,
                                opacity: 0.5,
                                size: 7,
                            }}
                            decreasingDots={[
                                {
                                    config: { color: 'white', margin: 3, opacity: 0.5, size: 5 },
                                    quantity: 1,
                                },
                                {
                                    config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
                                    quantity: 1,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>

            <Text numberOfLines={1} style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginTop: SPACING.x_small }}>
                {client.name}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                {client.text1}
            </Text>
            {showPrice && <Text numberOfLines={1} style={{ marginTop: SPACING.xxx_small, fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                {client.text2}
            </Text>}
        </View>
    )
}

export default memo(RenderClient)

const styles = StyleSheet.create({
    container: {
        //padding: SPACING.xx_small, 
        flexDirection: 'column',
        flexGrow: 1,
        //backgroundColor: COLORS.grey,
        borderRadius: normalize(20),
        //marginRight: SPACING.large
    },
})