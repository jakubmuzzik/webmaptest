import React, { memo, useState, useRef, useMemo, useCallback } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES } from "../../constants"
import { normalize, stripEmptyParams, getParam } from "../../utils"
import { Image } from 'expo-image'
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel'
import { isBrowser } from 'react-device-detect'

import { useSearchParams, Link } from 'react-router-dom'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const RenderLady = ({ client, width, showPrice = true }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const carouselRef = useRef()
    const carouselX = useRef(0)

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
        const newIndex = Math.round(carouselX.current / width)
        if (newIndex < 0 || newIndex > client.images.length - 1) {
            return
        }

        if (newIndex != index) {
            setIndex(newIndex)
        }
    }

    const renderImage = useCallback(({ item }) => (
        <View style={{ height: (width / 3) * 4, width: Math.ceil(width) }}>
            <Image
                style={{
                    flex: 1,
                    // aspectRatio: 3 / 4,
                    //borderRadius: 20
                }}
                source={item}
                placeholder={blurhash}
                resizeMode="cover"
                transition={200}
                alt={client.name}
            />
        </View>
    ), [width])

    return (
        <View style={styles.container}>
            <Link to={{ pathname: '/profile/' + client.id, search: new URLSearchParams(stripEmptyParams(params)).toString() }} >
                <View style={{ flex: 1 }}
                    onMouseEnter={isBrowser ? () => setIsHovered(true) : undefined}
                    onMouseLeave={isBrowser ? () => setIsHovered(false) : undefined}
                >
                    <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                        <FlatList
                            ref={carouselRef}
                            style={{ flex: 1 }}
                            data={client.images}
                            renderItem={renderImage}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            pagingEnabled
                            disableIntervalMomentum
                            initialScrollIndex={0}
                            onScroll={handleScroll}
                        />
                    </View>

                    {isBrowser && <>
                        <View style={{
                            position: 'absolute',
                            opacity: isHovered && index !== 0 ? 0.7 : 0,
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
                            opacity: isHovered && index !== client.images.length - 1 ? 0.7 : 0,
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
                    </>}

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
            </Link>

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