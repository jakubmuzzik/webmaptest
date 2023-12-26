import React, { useState, useCallback, useRef, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Svg, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { SPACING, FONTS, FONT_SIZES, COLORS } from '../../constants'
import { Button } from 'react-native-paper'
import { normalize } from '../../utils'

import HoverableView from '../../components/HoverableView'
//import MapView, { Marker, ClusterProps, MarkerClusterer } from "@teovilla/react-native-web-maps"
import MapView, { Marker, Callout } from 'react-native-maps'
//import { Image } from 'expo-image'

import AboutEditor from '../../components/modal/account/AboutEditor'
import PersonalDetailsEditor from '../../components/modal/account/PersonalDetailsEditor'
import PricingEditor from '../../components/modal/account/PricingEditor'
import ServicesEditor from '../../components/modal/account/ServicesEditor'
import WorkingHoursEditor from '../../components/modal/account/WorkingHoursEditor'
import AddressEditor from '../../components/modal/account/AddressEditor'

const LOCATION_LATITUDE_DELTA = 0.9735111002971948 // default value just for map init -> later is used minLatitudeDelta.current
const LOCATION_LONGITUDE_DELTA = 0.6 // == 50 Km 
const INITIAL_LATITUDE = 50.0646126
const INITIAL_LONGITUDE = 14.3729754

const PersonalDetails = ({ route }) => {
    const [data, setData] = useState({
        gender: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secureTextEntry: true,
        confirmSecureTextEntry: true,
        nationality: '',
        languages: [],
        hairColor: '',
        eyeColor: '',
        breastSize: '',
        breastType: '',
        bodyType: '',
        pubicHair: '',
        weight: '',
        height: '',
        dateOfBirth: '',
        sexuality: '',
        services: [],
        currency: 'CZK',
        prices: [], //{length: 1, incall: '', outcall: ''}
        incall: true,
        outcall: true,
        address: {title: 'Thamova 681/32 Karlin'},
        hiddenAddress: false,
        description: 'mock description',
        workingHours: [{ day: 'monday', from: '', until: '', enabled: true }, { day: 'tuesday', from: '', until: '', enabled: true }, { day: 'wednesday', from: '', until: '', enabled: true }, { day: 'thursday', from: '', until: '', enabled: true }, { day: 'friday', from: '', until: '', enabled: true }, { day: 'saturday', from: '', until: '', enabled: true }, { day: 'sunday', from: '', until: '', enabled: true }],
        images: [null, null, null, null, null, null]
    })

    const personalDetails = useMemo(() => ({
        nationality: data.nationality,
        languages: data.languages,
        hairColor: data.hairColor,
        eyeColor: data.eyeColor,
        breastSize: data.breastSize,
        breastType: data.breastType,
        bodyType: data.bodyType,
        pubicHair: data.pubicHair,
        weight: data.weight,
        height: data.height,
        dateOfBirth: data.dateOfBirth,
        sexuality: data.sexuality
    }), [data])

    const pricing = useMemo(() => ({
        prices: data.prices,
        currency: data.currency,
        outcall: data.outcall,
        incall: data.incall
    }), [data])

    const address = useMemo(() => ({
        ...data.address,
        hiddenAddress: data.hiddenAddress
    }), [data])

    const [showTextTriggeringButton, setShowTextTriggeringButton] = useState(false)
    const [moreTextShown, setMoreTextShown] = useState(false)

    const [aboutEditorVisible, setAboutEditorVisible] = useState(false)
    const [personalDetailsEditorVisible, setPersonalDetailsEditorVisible] = useState(false)
    const [pricingEditorVisible, setPricingEditorVisible] = useState(false)
    const [servicesEditorVisible, setServicesEditorVisible] = useState(false)
    const [workingHoursEditorVisible, setWorkingHoursEditorVisible] = useState(false)
    const [addressEditorVisible, setAddressEditorVisible] = useState(false)

    const mapRef = useRef()

    const onTextLayout = (e) => {
        const element = e.nativeEvent.target
        const count = Math.floor(e.nativeEvent.layout.height / getComputedStyle(element).lineHeight.replace('px', ''))

        if (count >= 5 || isNaN(count)) {
            setShowTextTriggeringButton(true)
        }
    }

    const onAboutEditPress = () => {
        setAboutEditorVisible(true)
    }

    const onPersonalDetailsEditPress = () => {
        setPersonalDetailsEditorVisible(true)
    }

    const onPricesEditPress = () => {
        setPricingEditorVisible(true)
    }

    const onServicesEditPress = () => {
        setServicesEditorVisible(true)
    }

    const onWorkingHoursEditPress = () => {
        setWorkingHoursEditorVisible(true)
    }

    const onAddressEditPress = () => {
        setAddressEditorVisible(true)
    }

    const loadingMapFallback = useMemo(() => {
        return (
            <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading</Text>
            </View>
        )
    }, [])

    return (
        <>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        About
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onAboutEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
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
                <View style={[styles.sectionHeader, { marginHorizontal: SPACING.small }]}>
                    <Text style={styles.sectionHeaderText}>
                        Personal Details
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onPersonalDetailsEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        Pricing
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onPricesEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
                </View>
                <View style={styles.table}>
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
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        Services
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onServicesEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        Working Hours
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onWorkingHoursEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
                </View>
                <View style={styles.table}>
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

            <View style={[styles.section, { marginBottom: SPACING.medium }]}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        Address
                    </Text>
                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        mode="outlined"
                        icon="pencil-outline"
                        onPress={onAddressEditPress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Edit
                    </Button>
                </View>
                <View style={{ width: '100%', height: 400 }}>
                    <MapView
                        ref={mapRef}
                        googleMapsApiKey="AIzaSyCA1Gw6tQbTOm9ME6Ru0nulUNFAOotVY3s"
                        provider="google"
                        style={{ flex: 1 }}
                        animationEnabled
                        zoomTapEnabled
                        loadingFallback={loadingMapFallback}
                        initialCamera={{
                            center: {
                                latitude: 50.09148,
                                longitude: 14.45501,
                            },
                            zoom: 13,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: '50.09148',
                                longitude: '14.45501'
                            }}
                            title={data.name}
                        >
                            <Image
                                source={require('../../assets/sport_marker.png')}
                                style={{
                                    width: 30,
                                    height: 30,
                                    position: 'absolute',
                                    top: -30,
                                    left: -15
                                }}
                                resizeMode="contain"
                            />
                        </Marker>
                    </MapView>
                </View>
            </View>

            <AboutEditor visible={aboutEditorVisible} setVisible={setAboutEditorVisible} about={data.description} />
            <PersonalDetailsEditor visible={personalDetailsEditorVisible} setVisible={setPersonalDetailsEditorVisible} personalDetails={personalDetails} />
            <PricingEditor visible={pricingEditorVisible} setVisible={setPricingEditorVisible} pricing={pricing} />
            <ServicesEditor visible={servicesEditorVisible} setVisible={setServicesEditorVisible} services={data.services} />
            <WorkingHoursEditor visible={workingHoursEditorVisible} setVisible={setWorkingHoursEditorVisible} workingHours={data.workingHours} />
            <AddressEditor visible={addressEditorVisible} setVisible={setAddressEditorVisible} address={address} />
        </>
    )
}

export default PersonalDetails

const styles = StyleSheet.create({
    containerLarge: { 
        flex: 1, 
        paddingHorizontal: SPACING.large, 
        flexDirection: 'row', 
        backgroundColor: COLORS.lightBlack, 
        justifyContent: 'center',
        overflowY: 'scroll'
    },
    containerSmall: { 
        flex: 1, 
        paddingHorizontal: SPACING.large, 
        flexDirection: 'column'
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
        marginBottom: SPACING.small
    },
    sectionHeaderText: { 
        color: '#FFF', 
        fontFamily: FONTS.bold, 
        fontSize: FONT_SIZES.h3
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