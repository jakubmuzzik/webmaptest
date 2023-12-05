import React, { useState, useCallback, useRef, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { SPACING, FONTS, FONT_SIZES, COLORS } from '../../constants'
import { Button } from 'react-native-paper'

import HoverableView from '../../components/HoverableView'
import MapView from "@teovilla/react-native-web-maps"

import AboutEditor from '../../components/modal/AboutEditor'

const PersonalDetails = ({ navigation, route }) => {

    const [showTextTriggeringButton, setShowTextTriggeringButton] = useState(false)
    const [moreTextShown, setMoreTextShown] = useState(false)
    const [region, setRegion] = useState(null)

    const [aboutEditorVisible, setAboutEditorVisible] = useState(false)
    const [personalDetailsEditorVisible, setPersonalDetailsEditorVisible] = useState(false)

    const mapRef = useRef()

    const onTextLayout = useCallback((e) => {
        const element = e.nativeEvent.target
        const count = Math.floor(e.nativeEvent.layout.height / getComputedStyle(element).lineHeight.replace('px', ''))

        if (count >= 5 || isNaN(count)) {
            setShowTextTriggeringButton(true)
        }
    }, [])

    const onAboutEditPress = useCallback(() => {
        setAboutEditorVisible(true)
    }, [])

    const onPersonalDetailsEditPress = useCallback(() => {

    }, [])

    const onPricesEditPress = useCallback(() => {

    }, [])

    const onServicesEditPress = useCallback(() => {

    }, [])

    const onWorkingHoursEditPress = useCallback(() => {

    }, [])

    const onAddressEditPress = useCallback(() => {

    }, [])

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
                            <Text style={styles.attributeName}>Sexual Orientation</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Bisexual</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Languages</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Czech, English</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Nationality</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Czech</Text>
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
                            <Text style={styles.attributeName}>Body Type</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Slim</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Pubic Hair</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Shaved</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Breast Size</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>B</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Breast Type</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Natural</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Eyes</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Green</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.attributeName}>Hair</Text>
                            <View style={styles.attributeDivider}></View>
                            <Text style={styles.attributeValue}>Blonde</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        Prices
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

            <View style={styles.section}>
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
                        provider="google"
                        style={{ flex: 1 }}
                        onRegionChange={setRegion}
                        loadingFallback={loadingMapFallback}
                    >

                    </MapView>
                </View>
            </View>

            <AboutEditor visible={aboutEditorVisible} setVisible={setAboutEditorVisible} route={route} about="mock about" />
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