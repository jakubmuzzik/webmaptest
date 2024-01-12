import React, { useState, useRef, useMemo, useCallback, useEffect, useLayoutEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions, Modal, ScrollView, ImageBackground, Dimensions } from "react-native"
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES, LARGE_SCREEN_THRESHOLD, SMALL_SCREEN_THRESHOLD } from "../constants"
import { normalize, stripEmptyParams } from "../utils"
import { Image } from 'expo-image'
import { AntDesign, Ionicons, Feather, FontAwesome, Octicons, FontAwesome5, MaterialCommunityIcons, EvilIcons, Entypo } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import HoverableView from "../components/HoverableView"
import MapView from "@teovilla/react-native-web-maps"
import AssetsTabView from "../components/modal/profile/AssetsTabView"
import { isBrowser } from 'react-device-detect'

import { useParams, useLocation, useNavigate } from 'react-router-dom'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const images = [require('../assets/dummy_photo.png'), 'https://picsum.photos/seed/696/3000/2000', require('../assets/CATEGORY4.png'), require('../assets/CATEGORY1.png'), require('../assets/CATEGORY2.png'), require('../assets/CATEGORY3.png')]
const videos = [require('../assets/dummy_photo.png'), 'https://picsum.photos/seed/696/3000/2000']

const Profile = ({ }) => {
    // const params = useMemo(() => ({
    //     language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
    //     id: route.params.id
    // }), [route.params])

    const location = useLocation()
    const navigate = useNavigate()

    const { width } = useWindowDimensions()
    const isSmallScreen = width <= SMALL_SCREEN_THRESHOLD

    const mapRef = useRef()
    const pressedImageIndexRef = useRef()

    const [showTextTriggeringButton, setShowTextTriggeringButton] = useState(false)
    const [moreTextShown, setMoreTextShown] = useState(false)
    const [region, setRegion] = useState(null)
    const [photosModalVisible, setPhotosModalVisible] = useState(false)

    useEffect(() => {
        if (!photosModalVisible && !isNaN(pressedImageIndexRef.current)) {
            pressedImageIndexRef.current = undefined
        }
    }, [photosModalVisible])

    const closeModal = () => {
        setPhotosModalVisible(false)
    }

    const onTextLayout = useCallback((e) => {
        const element = e.nativeEvent.target
        const count = Math.floor(e.nativeEvent.layout.height / getComputedStyle(element).lineHeight.replace('px', ''))

        if (count >= 5 || isNaN(count)) {
            setShowTextTriggeringButton(true)
        }
    }, [])

    const loadingMapFallback = useMemo(() => {
        return (
            <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading</Text>
            </View>
        );
    }, [])

    const onImagePress = (index) => {
        pressedImageIndexRef.current = index
        setPhotosModalVisible(true)
    }

    const renderPhotos = () => {
        return (
            <View style={{ flexDirection: 'row', }}>
                <View style={{ width: '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                    <HoverableView hoveredOpacity={0.8}>
                        <TouchableOpacity onPress={() => onImagePress(0)}>
                            <Image
                                style={{
                                    aspectRatio: 3 / 4,
                                    width: 'auto',
                                    borderRadius: 10
                                }}
                                source={require('../assets/dummy_photo.png')}
                                placeholder={blurhash}
                                resizeMode="cover"
                                transition={200}
                            />
                        </TouchableOpacity>
                    </HoverableView>
                </View>
                <View style={{ flexDirection: 'column', width: '50%', flexShrink: 1 }}>
                    <View style={{ flexDirection: 'row', marginBottom: SPACING.xxx_small, flexGrow: 1 }}>
                        <HoverableView hoveredOpacity={0.8} style={{ flex: 1, marginRight: SPACING.xxx_small, }}>
                            <TouchableOpacity onPress={() => onImagePress(1)}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderRadius: 10
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                            </TouchableOpacity>
                        </HoverableView>
                        <HoverableView hoveredOpacity={0.8} style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => onImagePress(2)}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderRadius: 10
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    contentFit="cover"
                                    transition={200}
                                />
                            </TouchableOpacity>
                        </HoverableView>
                    </View>
                    <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                        <HoverableView hoveredOpacity={0.8} style={{ flex: 1, marginRight: SPACING.xxx_small, }}>
                            <TouchableOpacity onPress={() => onImagePress(3)}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderRadius: 10
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                            </TouchableOpacity>
                        </HoverableView>
                        <HoverableView hoveredOpacity={0.8} style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => onImagePress(4)}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderRadius: 10
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                            </TouchableOpacity>
                        </HoverableView>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <>
            {/* <View style={{ height: '100%', position: 'absolute', width: '100%', overflow: 'hidden' }}>
                <ImageBackground
                    resizeMode="cover"
                    source={require('../assets/red_windows.jpeg')}
                    style={{ position: 'absolute', top: -50, left: 0, right: 0, width: '100#', height: 600, opacity: 0.5 }}
                />
                <BlurView 
                    intensity={90}
                    tint="dark"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, width: '100#', height: 680, }}
                />
                <LinearGradient colors={[
                    '#191919',
                    COLORS.lightBlack,
                ]}
                    style={{ position: 'absolute', top: 680, width: '100%', height: '100%' }} 
                    locations={[0.1, 0.2]}
                />
            </View> */}

            {/* <LinearGradient colors={[
                COLORS.grey,
                COLORS.lightBlack,
            ]}
                style={{ position: 'absolute', width: '100%', height: 600 }}
                locations={[0.5, 0.7]}
            /> */}

            <LinearGradient colors={[
                COLORS.grey,
                COLORS.lightBlack,
            ]}
                style={{ position: 'absolute', width: '100%', height: Dimensions.get('window').height - normalize(70) }}
                //locations={[0.5, 0.7]}
            />

            {/* {location.key !== 'default' && !isBrowser && <TouchableOpacity
                onPress={() => navigate(-1)}
                style={{ position: 'absolute', marginLeft: SPACING.page_horizontal, top: normalize(70) + 5, flexDirection: 'row', alignItems: 'center' }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="chevron-back" size={FONT_SIZES.medium} color={COLORS.greyText} />
                <Text style={{ color: COLORS.greyText, fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>Back</Text>
            </TouchableOpacity>} */}

            
            <View style={{ alignSelf: 'center', maxWidth: '100%', width: 800 + SPACING.xxx_small, /*backgroundColor: COLORS.lightBlack,*/ padding: SPACING.large }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#FFF', marginBottom: SPACING.x_small, marginHorizontal: SPACING.xx_small, fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, }}>
                        Jakub Muzik
                    </Text>
                    <View style={{ flexDirection: 'row', marginBottom: SPACING.xx_small, alignItems: 'center' }}>
                        <MaterialCommunityIcons name="phone" size={20} color={COLORS.greyText} style={{ marginRight: 3 }} />
                        <Text onPress={() => console.log('')} style={{ marginRight: SPACING.xx_small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                            +420 732 710 244
                        </Text>
                        <TouchableOpacity style={{ padding: 5, width: 28, height: 28, backgroundColor: '#108a0c', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="whatsapp" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, width: 28, height: 28, backgroundColor: '#7d3daf', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="viber" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, width: 28, height: 28, backgroundColor: '#38a5e4', borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <EvilIcons name="sc-telegram" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: SPACING.xx_small, alignItems: 'center' }}>
                        <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.greyText} style={{ marginRight: 3 }} />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                            Prague, Czech Republic
                        </Text>
                    </View>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText, marginBottom: SPACING.medium }}>
                        27 years <Text style={{ color: COLORS.red }}>•</Text> 182cm <Text style={{ color: COLORS.red }}>•</Text> 82kg
                    </Text>
                </View>

                {renderPhotos()}

                <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: SPACING.small }}>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                        9 photos
                    </Text>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText, marginHorizontal: SPACING.xx_small }}>
                        |
                    </Text>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                        3 videos
                    </Text>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText, marginHorizontal: SPACING.xx_small }}>
                        |
                    </Text>
                    <TouchableOpacity onPress={() => setPhotosModalVisible(true)} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: '#FFF', marginRight: 4 }}>View all</Text>
                        <MaterialCommunityIcons name="dots-grid" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { marginTop: SPACING.xxx_large }]}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            About
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            • Independent lady
                        </Text>
                    </View>

                    <Text style={{ color: '#FFF', fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, lineHeight: 22 }}
                        onLayout={onTextLayout}
                        numberOfLines={moreTextShown ? undefined : 5}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque erat volutpat, auctor ex at, scelerisque est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus molestie leo velit, eget ullamcorper ipsum laoreet vel. Donec tempus sollicitudin magna, vitae suscipit tellus rutrum a. Sed finibus, nunc quis pellentesque gravida, ligula metus accumsan dui, eu pellentesque lectus enim at metus. Morbi luctus nulla vitae elit dapibus lacinia. In id nibh vitae augue semper maximus sit amet vel ante. Etiam sed tincidunt nisi. Vivamus iaculis tortor non metus interdum sollicitudin. Pellentesque ut bibendum purus. Sed eget erat euismod, condimentum quam id, efficitur mi. Ut velit enim, accumsan vitae ultricies non, volutpat quis turpis.
                        Donec nec ornare nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus orci, cursus nec magna eget, vehicula porttitor odio. Vestibulum semper, ipsum eu sagittis facilisis, justo mi blandit erat, in rhoncus massa arcu vel risus. Quisque fermentum et risus tristique pretium. Aliquam facilisis tortor non justo ornare aliquet. Morbi arcu ante, porta in mauris in, laoreet molestie nunc. Duis commodo lorem ac elit venenatis, vitae varius purus placerat.
                        Pellentesque venenatis mattis sem, vitae pharetra est luctus nec. Nulla iaculis eget lacus eu auctor. Duis egestas libero consequat, rutrum magna non, semper diam. Pellentesque malesuada ultricies nisi, in tempus felis sollicitudin eget. Nunc ac maximus odio. Pellentesque at cursus sem, in dictum nunc. Duis gravida dictum massa sit amet ultrices. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus fermentum congue massa sed consectetur. Nunc finibus lorem eget mattis placerat. Integer non turpis non tortor faucibus ultricies nec non est. Etiam cursus dui eleifend dolor gravida pulvinar.
                    </Text>
                    {
                        showTextTriggeringButton && (
                            <Text
                                onPress={() => setMoreTextShown(v => !v)}
                                style={{ color: '#FFF', fontFamily: FONTS.medium, marginTop: SPACING.small, fontSize: FONT_SIZES.medium }}>
                                {moreTextShown ? 'Read less...' : 'Read more...'}
                            </Text>
                        )
                    }
                </View>

                <View style={[styles.section, { paddingHorizontal: 0 }]}>
                    <Text style={[styles.sectionHeaderText, { marginLeft: SPACING.small }]}>
                        Personal Details
                    </Text>
                    <View style={{ flex: 1, flexDirection: isSmallScreen ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: SPACING.small }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Age</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>26</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Sexual orientation</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Bisexual</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Nationality</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Czech</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text style={styles.attributeName}>Languages</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Czech, English</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Height</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>160 cm</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Weight</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>56 kg</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: SPACING.small }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Body type</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Slim</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Pubic hair</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Shaved</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Breast size</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>B</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Breast type</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Natural</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Hair color</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Blonde</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.attributeName} numberOfLines={1}>Eye color</Text>
                                <View style={styles.attributeDivider}></View>
                                <Text style={styles.attributeValue}>Green</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            Pricing
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            • CZK 
                        </Text>
                    </View>

                    <View style={styles.table}>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
                                <Text style={styles.tableHeaderText}>Length</Text>
                            </View>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>0.5 hour</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>1 hour</Text>
                            </HoverableView>
                        </View>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
                                <Text style={styles.tableHeaderText}>Incall</Text>
                            </View>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>1000</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>2500</Text>
                            </HoverableView>
                        </View>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
                                <Text style={styles.tableHeaderText}>Outcall</Text>
                            </View>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>1500</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>3000</Text>
                            </HoverableView>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            Services
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            • Only massage 
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={styles.chip}>
                            {/* <LinearGradient
                                colors={[
                                    COLORS.darkRed2,
                                    COLORS.darkRed,
                                ]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 0, y: 0.5 }}
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                            /> */}
                            <Text style={styles.chipText}>Service 1</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 2</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 3</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 4</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 5</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 6</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 7</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Service 8</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            Working hours
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            <Text style={{ color: 'green' }}>•</Text> Currently Availabile 
                        </Text>
                    </View>

                    {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, }]}>
                            Working hours&nbsp;&nbsp;
                        </Text>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            <Text style={{ color: 'green' }}>•</Text> Currently available
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                            • 
                        </Text>
                            
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>&nbsp;&nbsp;Currently available</Text>
                            <Octicons name="dot-fill" size={20} color="green" />
                        </View>
                    </View> */}

                    <View style={styles.table}>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
                                <Text style={styles.tableHeaderText}>Day</Text>
                            </View>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Monday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Tuesday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Wednesday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Thursday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Friday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Saturday</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>Sunday</Text>
                            </HoverableView>
                        </View>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
                                <Text style={styles.tableHeaderText}>Availability</Text>
                            </View>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                            <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                <Text style={styles.tableHeaderValue}>20:00 - 04:00</Text>
                            </HoverableView>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: SPACING.small }}>
                        <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            Address
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                            <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.greyText} style={{ marginRight: 3 }} />
                            <Text numberOfLines={1} style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                                Prague, Czech Republic
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 300, borderRadius: 5, overflow: 'hidden' }}>
                        <MapView
                            ref={mapRef}
                            provider="google"
                            style={{ flex: 1, }}
                            googleMapsApiKey="AIzaSyCA1Gw6tQbTOm9ME6Ru0nulUNFAOotVY3s"
                        //onRegionChange={setRegion}
                        //loadingFallback={loadingMapFallback}
                        >

                        </MapView>
                    </View>
                </View>

                <AssetsTabView visible={photosModalVisible} pressedAssetIndex={pressedImageIndexRef.current} images={images} videos={videos} closeModal={closeModal} />
            </View>
        </>
    )
}

export default Profile

const styles = StyleSheet.create({
    section: {
        marginTop: SPACING.large,
        padding: SPACING.small,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.08)',
        backgroundColor: COLORS.grey,

        /*shadowColor: COLORS.red,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,*/
    },
    sectionHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.small,
    },
    sectionHeaderText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.h3,
        marginBottom: SPACING.small,
    },
    attributeName: {
        color: COLORS.greyText,
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium
    },
    attributeValue: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.medium
    },
    attributeDivider: {
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey,
        marginBottom: 4
    },
    serviceText: {
        color: '#FFF',
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.regular
    },
    chip: {
        marginRight: SPACING.xx_small,
        backgroundColor: COLORS.darkRed2,
        paddingHorizontal: SPACING.xx_small,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: COLORS.lightGrey,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xx_small,
        overflow: 'hidden'
    },
    chipText: {
        color: '#FFF',
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium
    },
    table: {
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden'
    },
    tableHeaderText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.medium
    },
    tableHeaderValue: {
        color: '#FFF',
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium
    },
    column: {
        padding: SPACING.xx_small
    }
})