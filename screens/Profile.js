import React, { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions, Modal, ScrollView } from "react-native"
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES, LARGE_SCREEN_THRESHOLD } from "../constants"
import { normalize, stripEmptyParams } from "../utils"
import { Image } from 'expo-image'
import { AntDesign, Ionicons, Feather, FontAwesome, Octicons, FontAwesome5, MaterialCommunityIcons, EvilIcons, Entypo } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import HoverableView from "../components/HoverableView"
import MapView from "@teovilla/react-native-web-maps"
import AssetsTabView from "../components/modal/profile/AssetsTabView"

import { useParams, useLocation } from 'react-router-dom'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const photos = [require('../assets/dummy_photo.png'), 'https://picsum.photos/seed/696/3000/2000', require('../assets/CATEGORY4.png')]
const videos = [require('../assets/dummy_photo.png'), 'https://picsum.photos/seed/696/3000/2000']

const Profile = ({  }) => {
    // const params = useMemo(() => ({
    //     language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
    //     id: route.params.id
    // }), [route.params])

    const { width } = useWindowDimensions()
    const isLargeScreen = width > LARGE_SCREEN_THRESHOLD

    const mapRef = useRef()

    const [showTextTriggeringButton, setShowTextTriggeringButton] = useState(false)
    const [moreTextShown, setMoreTextShown] = useState(false)
    const [region, setRegion] = useState(null)
    const [photosModalVisible, setPhotosModalVisible] = useState(false)

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

    const renderContent = () => {
        return (
            <View style={isLargeScreen ? styles.contentLarge : styles.contentSmall}>
                <View style={{ width: '100%', overflow: 'hidden', alignItems: isLargeScreen ? 'flex-end' : 'center', }}>
                    <View style={{ flexDirection: 'row', maxWidth: isLargeScreen ? 800 + SPACING.xxx_small : '100%', width: 'inherit' }}>
                        <View style={{ width: isLargeScreen ? 400 : '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                            <Image
                                style={{
                                    aspectRatio: 3 / 4,
                                    width: 'auto',
                                    borderTopLeftRadius: 20,
                                    borderBottomLeftRadius: 20
                                }}
                                source={require('../assets/dummy_photo.png')}
                                placeholder={blurhash}
                                resizeMode="cover"
                                transition={200}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', width: isLargeScreen ? 400 : '50%', flexShrink: 1 }}>
                            <View style={{ flexDirection: 'row', marginBottom: SPACING.xxx_small, flexGrow: 1 }}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        marginRight: SPACING.xxx_small,
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderTopRightRadius: 20,
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    contentFit="cover"
                                    transition={200}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', flexGrow: 1  }}>
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        marginRight: SPACING.xxx_small
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <Image
                                    style={{
                                        aspectRatio: 3 / 4,
                                        flex: 1,
                                        borderBottomRightRadius: 20,
                                    }}
                                    source={require('../assets/dummy_photo.png')}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setPhotosModalVisible(true)} style={{ position: 'absolute', bottom: normalize(20), right: normalize(20), borderRadius: 10, backgroundColor: COLORS.grey, borderWidth: 1, paddingHorizontal: SPACING.xx_small, paddingVertical: SPACING.xxx_small, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            {/* <View style={{  }}> */}
                                <MaterialCommunityIcons name="dots-grid" size={20} color="white" />
                                <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, color: '#FFF' }}> Show all assets</Text>
                            {/* </View> */}
                        </TouchableOpacity>
                    </View>

                    <View style={{ maxWidth: isLargeScreen ? 800 + SPACING.xxx_small : '100%', width: 'inherit' }}>
                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>
                                About
                            </Text>
                            <Text style={{ marginTop: SPACING.small, color: '#FFF', fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, lineHeight: 22 }}
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
                            <View style={{ marginTop: SPACING.small, flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column', flexGrow: 1, marginHorizontal: SPACING.small }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Age</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>26</Text>
                                    </View>
                                     <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Sexual orientation</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Bisexual</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Nationality</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Czech</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Languages</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Czech, English</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Height</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>160 cm</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Weight</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>56 kg</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', flexGrow: 1, marginHorizontal: SPACING.small }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Body type</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Slim</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Pubic hair</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Shaved</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Breast size</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>B</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Breast type</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Natural</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Hair color</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Blonde</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.attributeName}>Eye color</Text>
                                        <View style={styles.attributeDivider}></View>
                                        <Text style={styles.attributeValue}>Green</Text>
                                    </View>
                                </View>
                                {/* <View style={{ width: 160 }}>
                                        <Text style={styles.attributeName}>Age:</Text>
                                        <Text style={styles.attributeName}>Sexual Orientation:</Text>
                                        <Text style={styles.attributeName}>Weight: </Text>
                                        <Text style={styles.attributeName}>Height: </Text>
                                        <Text style={styles.attributeName}>Tits: </Text>
                                        <Text style={styles.attributeName}>Body Type: </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.attributeValue}>26</Text>
                                        <Text style={styles.attributeValue}>Bisexual</Text>
                                        <Text style={styles.attributeValue}>56 kg</Text>
                                        <Text style={styles.attributeValue}>160 cm</Text>
                                        <Text style={styles.attributeValue}>B</Text>
                                        <Text style={styles.attributeValue}>Slim</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 160 }}>
                                        <Text style={styles.attributeName}>Pubic Hair: </Text>
                                        <Text style={styles.attributeName}>Eyes: </Text>
                                        <Text style={styles.attributeName}>Hair: </Text>
                                        <Text style={styles.attributeName}>Languages: </Text>
                                        <Text style={styles.attributeName}>Nationality: </Text>
                                        <Text style={styles.attributeName}>Smoker: </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.attributeValue}>Shaved</Text>
                                        <Text style={styles.attributeValue}>Green</Text>
                                        <Text style={styles.attributeValue}>Blonde</Text>
                                        <Text style={styles.attributeValue}>Czech, English</Text>
                                        <Text style={styles.attributeValue}>Czech</Text>
                                        <Text style={styles.attributeValue}>Sometimes</Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>
                                Pricing
                            </Text>
                            <View style={[styles.table, { marginTop: SPACING.small, }]}>
                                <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                                    <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
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
                                    <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                        <Text style={styles.tableHeaderText}>Incall</Text>
                                    </View>
                                    <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                        <Text style={styles.tableHeaderValue}>1000 CZK</Text>
                                    </HoverableView>
                                    <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                        <Text style={styles.tableHeaderValue}>2500 CZK</Text>
                                    </HoverableView>
                                </View>
                                <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                                    <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                        <Text style={styles.tableHeaderText}>Outcall</Text>
                                    </View>
                                    <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                        <Text style={styles.tableHeaderValue}>1500 CZK</Text>
                                    </HoverableView>
                                    <HoverableView style={styles.column} backgroundColor={COLORS.grey} hoveredBackgroundColor={COLORS.lightGrey}>
                                        <Text style={styles.tableHeaderValue}>3000 CZK</Text>
                                    </HoverableView>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>
                                Services
                            </Text>
                            <View style={{ marginTop: SPACING.small, flexDirection: 'row', flexWrap: 'wrap' }}>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 1</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 2</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 3</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 4</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 5</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 6</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 7</Text>
                                </View>
                                <View style={styles.chip}>
                                    <Entypo name="check" size={18} color="green" style={{ marginRight: SPACING.xxx_small }} />
                                    <Text style={styles.chipText}>Service 8</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeaderText}>
                                Working Hours
                            </Text>
                            <View style={[styles.table, { marginTop: SPACING.small, }]}>
                                <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                                    <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]} backgroundColor={COLORS.lightGrey} hoveredBackgroundColor={COLORS.grey}>
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
                                    <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
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
                            <Text style={styles.sectionHeaderText}>
                                Location
                            </Text>
                            <View style={{ marginTop: SPACING.small, width: '100%', height: 400 }}>
                                <MapView
                                    ref={mapRef}
                                    provider="google"
                                    style={{ flex: 1 }}
                                    googleMapsApiKey="AIzaSyCA1Gw6tQbTOm9ME6Ru0nulUNFAOotVY3s"
                                    //onRegionChange={setRegion}
                                    //loadingFallback={loadingMapFallback}
                                >

                                </MapView>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionHeaderText}>
                                    Reviews
                                </Text>
                                <HoverableView style={{ borderRadius: 10, borderWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} hoveredBackgroundColor={COLORS.red} backgroundColor={COLORS.red} hoveredOpacity={0.8}>
                                    <LinearGradient
                                        colors={[COLORS.red, COLORS.darkRed]}
                                        style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}
                                        //start={{ x: 0, y: 0.5 }}
                                        //end={{ x: 1, y: 0.5 }}
                                    />
                                    <TouchableOpacity style={{ flex: 1, paddingHorizontal: SPACING.small, justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONTS.bold, color: '#FFF' }}>Add Review</Text>
                                    </TouchableOpacity>
                                </HoverableView>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderCard = () => {
        return (
            <View style={isLargeScreen ? styles.cardContainerLarge : styles.cardContainerSmall}>
                <View style={isLargeScreen ? styles.cardLarge : styles.cardSmall}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: SPACING.small }}>
                            <Text style={{ color: '#FFF', fontFamily: FONTS.medium, fontSize: FONT_SIZES.h1, wordBreak: 'break-word' }}>
                                John Doee
                            </Text>
                            {true ? 
                                <Octicons name="verified" size={24} color="green" style={{ marginLeft: SPACING.xx_small }}/> 
                                : <Octicons name="unverified" size={24} color="grey" />
                            }
                        </View>
                        <HoverableView hoveredOpacity={0.8}>
                            <TouchableOpacity>
                                <AntDesign name="hearto" size={24} color="white" />
                            </TouchableOpacity>
                        </HoverableView>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Octicons name="dot-fill" size={24} color="green" style={{ marginRight: SPACING.xx_small }} />
                        <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}>Working Now</Text>
                    </View>

                    <View style={{ paddingTop: SPACING.small, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={20} color="white" style={{ marginRight: SPACING.xx_small }} />
                        <Text onPress={() => console.log('')} style={{ color: '#FFF', fontFamily: FONTS.regular, fontSize: FONT_SIZES.large, textDecorationLine: 'underline', wordBreak: 'break-word' }}>Prague, Czech republic</Text>
                    </View>

                    <View style={{ paddingTop: SPACING.small, flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="phone-call" size={20} color="white" style={{ marginRight: SPACING.xx_small }} />
                        <Text onPress={() => console.log('')} style={{ color: '#FFF', fontFamily: FONTS.regular, fontSize: FONT_SIZES.large, marginRight: SPACING.x_small, wordBreak: 'break-word' }}>+420 732 710 244</Text>
                        <TouchableOpacity style={{ padding: 5,width: 32, height: 32, backgroundColor: '#108a0c', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="whatsapp" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, width: 32, height: 32, backgroundColor: '#7d3daf', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="viber" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, width: 32, height: 32, backgroundColor: '#38a5e4', borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <EvilIcons name="sc-telegram" size={26} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: SPACING.small, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="money" size={20} color="white" style={{ marginRight: SPACING.xx_small }} />
                        <Text style={{ color: '#FFF', fontFamily: FONTS.regular, fontSize: FONT_SIZES.large, wordBreak: 'break-word' }}>200 EUR / Hour</Text>
                    </View>

                    <HoverableView style={{ marginTop: SPACING.large, borderRadius: 15, overflow: 'hidden' }} hoveredBackgroundColor={COLORS.red} backgroundColor={COLORS.red} hoveredOpacity={0.8}>
                        <TouchableOpacity style={{ padding: SPACING.xx_small, alignItems: 'center' }} activeOpacity={0.8}>
                            <LinearGradient
                                colors={[COLORS.red, COLORS.darkRed]}
                                style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}
                                //start={{ x: 0, y: 0.5 }}
                                //end={{ x: 1, y: 0.5 }}
                            />
                            <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Send Message</Text>
                        </TouchableOpacity>
                    </HoverableView>
                </View>
            </View>
        )
    }

    return (
        <>
            <View style={[isLargeScreen ? styles.containerLarge : styles.containerSmall, { marginTop: normalize(70) }]}>
                {renderContent()}
                {renderCard()}
            </View>

            <AssetsTabView visible={photosModalVisible} photos={photos} videos={videos} closeModal={closeModal} />
        </>
    )
}

export default Profile

const styles = StyleSheet.create({
    containerLarge: { 
        flex: 1, 
        paddingHorizontal: SPACING.large, 
        flexDirection: 'row', 
        backgroundColor: COLORS.lightBlack, 
        justifyContent: 'center',
        //overflowY: 'scroll',
        //marginTop: normalize(70)
    },
    containerSmall: { 
        flex: 1, 
        paddingHorizontal: SPACING.large, 
        flexDirection: 'column-reverse',
        //marginTop: normalize(70)
    },
    contentLarge: { 
        flexShrink: 1, 
        flexGrow: 1, 
        alignItems: 'flex-end', 
        marginRight: SPACING.x_large, 
        paddingVertical: SPACING.large
    },
    contentSmall: {
        paddingVertical: SPACING.large ,
    },
    cardContainerLarge : { 
        flexGrow: 1, 
        flexBasis: 400,
        marginTop: SPACING.large 
    },
    cardContainerSmall : {
        marginTop: SPACING.large
    },
    cardLarge: {
        width: 400, 
        backgroundColor: COLORS.grey, 
        borderRadius: 20, 
        padding: SPACING.small, 
        shadowColor: COLORS.red,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 40,
        elevation: 40,
        position: 'fixed'
    },
    cardSmall: {
        backgroundColor: COLORS.grey, 
        borderRadius: 20, 
        padding: SPACING.small, 
        shadowColor: COLORS.red,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 40,
        elevation: 40,
    },
    section : {
        marginTop: SPACING.large, 
        padding: SPACING.small, 
        borderRadius: 20, 
        backgroundColor: COLORS.grey
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.small,
    },
    sectionHeaderText: { 
        color: '#FFF', 
        fontFamily: FONTS.bold, 
        fontSize: FONT_SIZES.h3,
    },
    attributeName: {
        color: '#FFF',
        fontFamily: FONTS.light,
        fontSize: FONT_SIZES.medium
    },
    attributeValue: {
        color: '#FFF',
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium
    },
    attributeDivider: {
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.hoveredLightGrey
    },
    serviceText: {
        color: '#FFF',
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.regular
    },
    chip: { 
        flexDirection: 'row', 
        width: 'fit-content', 
        marginRight: SPACING.xx_small, 
        backgroundColor: COLORS.lightGrey, 
        paddingHorizontal: SPACING.xx_small, 
        paddingVertical: 5, 
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xx_small
    },
    chipText: { 
        color: '#FFF', 
        fontFamily: FONTS.medium, 
        fontSize: FONT_SIZES.medium 
    },
    table: {
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        flexDirection: 'row'
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