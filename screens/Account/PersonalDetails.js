import React, { useState, useCallback, useRef, useMemo, memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { SPACING, FONTS, FONT_SIZES, COLORS, SMALL_SCREEN_THRESHOLD } from '../../constants'
import { Button } from 'react-native-paper'
import { MaterialCommunityIcons, FontAwesome5, EvilIcons } from '@expo/vector-icons'
import { normalize } from '../../utils'

import { connect } from 'react-redux'

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
import ContactInformationEditor from '../../components/modal/account/ContactInformationEditor'

import { showToast } from '../../redux/actions'

const LOCATION_LATITUDE_DELTA = 0.9735111002971948 // default value just for map init -> later is used minLatitudeDelta.current
const LOCATION_LONGITUDE_DELTA = 0.6 // == 50 Km 
const INITIAL_LATITUDE = 50.0646126
const INITIAL_LONGITUDE = 14.3729754

const PersonalDetails = ({ setTabHeight, showToast }) => {
    const { width } = useWindowDimensions()
    const isSmallScreen = width <= SMALL_SCREEN_THRESHOLD

    const [data, setData] = useState({
        gender: '',
        name: 'Jakub Muzik',
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
        phone: '+420 732 710 244',
        viber: false,
        whatsapp: false,
        telegram: false,
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
    }), [data.prices, data.currency, data.outcall, data.incall])

    const address = useMemo(() => ({
        ...data.address,
        hiddenAddress: data.hiddenAddress
    }), [data.address, data.hiddenAddress])

    const contactInformation = useMemo(() => ({
        phone: data.phone,
        name: data.name,
        viber: data.viber,
        whatsapp: data.whatsapp,
        telegram: data.telegram
    }), [data.phone, data.name, data.viber, data.whatsapp, data.telegram])

    const [showTextTriggeringButton, setShowTextTriggeringButton] = useState(false)
    const [moreTextShown, setMoreTextShown] = useState(false)

    const [aboutEditorVisible, setAboutEditorVisible] = useState(false)
    const [personalDetailsEditorVisible, setPersonalDetailsEditorVisible] = useState(false)
    const [pricingEditorVisible, setPricingEditorVisible] = useState(false)
    const [servicesEditorVisible, setServicesEditorVisible] = useState(false)
    const [workingHoursEditorVisible, setWorkingHoursEditorVisible] = useState(false)
    const [addressEditorVisible, setAddressEditorVisible] = useState(false)
    const [contactInformationEditorVisible, setContactInformationEditorVisible] = useState(false)

    const mapRef = useRef()

    const onTextLayout = (e) => {
        const element = e.nativeEvent.target
        const count = Math.floor(e.nativeEvent.layout.height / getComputedStyle(element).lineHeight.replace('px', ''))

        if (count >= 5 || isNaN(count)) {
            setShowTextTriggeringButton(true)
        }
    }

    const onContactInformationEditPress = () => {
        setContactInformationEditorVisible(true)
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

    const renderContactInformation = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
                    Contact information
                </Text>
                <Button
                    labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                    mode="outlined"
                    icon="pencil-outline"
                    onPress={onContactInformationEditPress}
                    rippleColor="rgba(220, 46, 46, .16)"
                >
                    Edit
                </Button>
            </View>

            <View style={[styles.row, { borderTopWidth: 1, borderColor: COLORS.lightGrey }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="badge-account-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                        Name
                    </Text>
                </View>
                <Text numberOfLines={1} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                    {data.name}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="phone-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                        Phone
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                    <Text numberOfLines={1} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.xx_small }}>
                        {data.phone}
                    </Text>
                    <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#108a0c', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name="whatsapp" size={18} color="white" />
                    </View>
                    <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#7d3daf', borderRadius: '50%', marginRight: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name="viber" size={18} color="white" />
                    </View>
                    <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#38a5e4', borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <EvilIcons name="sc-telegram" size={22} color="white" />
                    </View>
                </View>
            </View>
        </View>
    )

    const renderAbout = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
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
    )

    const renderPersonalDetails = () => (
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <View style={[styles.sectionHeader, { marginHorizontal: SPACING.small }]}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
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
                        <Text style={styles.attributeName} numberOfLines={1}>Languages</Text>
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
    )

    const renderPricing = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Text style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        Pricing
                    </Text>
                    <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium }}>
                        • CZK
                    </Text>
                </View>

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
                    <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]}>
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
                    <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]}>
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
    )

    const renderServices = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
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
    )

    const renderWorkingHours = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
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
                    <View style={[styles.column, { backgroundColor: COLORS.darkRed2 }]}>
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
    )

    const renderAddress = () => (
        <View style={[styles.section, { marginBottom: SPACING.medium }]}>
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderText}>
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

            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginBottom: SPACING.x_small }}>
                <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.greyText} style={{ marginRight: 3 }} />
                <Text numberOfLines={1} style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: COLORS.greyText }}>
                    Prague, Czech Republic
                </Text>
            </View>

            <View style={{ width: '100%', height: 300, borderRadius: 5, overflow: 'hidden' }}>
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
    )

    return (
        <View onLayout={(event) => setTabHeight(event.nativeEvent.layout.height)}>
            {renderContactInformation()}

            {renderAbout()}

            {renderPersonalDetails()}

            {renderPricing()}

            {renderServices()}

            {renderWorkingHours()}

            {renderAddress()}

            <AboutEditor visible={aboutEditorVisible} setVisible={setAboutEditorVisible} about={data.description} showToast={showToast} />
            <PersonalDetailsEditor visible={personalDetailsEditorVisible} setVisible={setPersonalDetailsEditorVisible} personalDetails={personalDetails} showToast={showToast}/>
            <PricingEditor visible={pricingEditorVisible} setVisible={setPricingEditorVisible} pricing={pricing} showToast={showToast}/>
            <ServicesEditor visible={servicesEditorVisible} setVisible={setServicesEditorVisible} services={data.services} showToast={showToast}/>
            <WorkingHoursEditor visible={workingHoursEditorVisible} setVisible={setWorkingHoursEditorVisible} workingHours={data.workingHours} showToast={showToast}/>
            <AddressEditor visible={addressEditorVisible} setVisible={setAddressEditorVisible} address={address} showToast={showToast}/>
            <ContactInformationEditor visible={contactInformationEditorVisible} setVisible={setContactInformationEditorVisible} contactInformation={contactInformation} showToast={showToast}/>
        </View>
    )
}

export default connect(null, { showToast })(memo(PersonalDetails))

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
        backgroundColor: COLORS.grey,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.08)',
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
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.small,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey
    }
})