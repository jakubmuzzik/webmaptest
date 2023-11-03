import React, { useMemo, useEffect, useState, useCallback, useRef, memo } from 'react'
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, Dimensions, StyleSheet, TextInput, ScrollView } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { Ionicons, Entypo } from '@expo/vector-icons'
import HoverableView from '../HoverableView'
import { normalize } from '../../utils'
import {
    COLORS,
    FONTS,
    FONT_SIZES,
    SPACING,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
} from '../../constants'
import { Switch, Chip, Checkbox } from 'react-native-paper'
import Slider from '../Slider'

const window = Dimensions.get('window')

const SMOKER_VALUES = ['Non-Smoker', 'Occasionally', 'Regularly'] //yes, no, sometimes //nekurak, nepravidelne, pravidelne
const BODY_TYPES = ['Slim', 'Athletic', 'Muscular', 'Curvy']
const PUBIC_HAIR_VALUES = ['Shaved', 'Trimmed', 'Natural']
const SEXUAL_ORIENTATION = ['Heterosexual', 'Homosexual', 'Bisexual', 'Transsexual']
const SERVICES = ['service1', 'service2', 'service3', 'service4', 'service5', 'service6', 'service7']
const HAIR_COLORS = ['Black', 'Blonde', 'Blue', 'Brown', 'Gray', 'Green', 'Pink', 'Red', 'White']
const BREAST_SIZES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H+']
const BREAST_TYPES = ['Natural', 'Silicone']
const TATOO = ['Yes', 'No']
const EYE_COLORS = ['Blue', 'Brown', 'Gray', 'Green', 'Hazel']
const LANGUAGES = ['English', 'French', 'German', 'Japanese', 'Italian', 'Russian', 'Spanish', 'Chinese', 'Arabic', 'Hindi', 'Portuguese', 'Turkish', 'Indonesian', 'Dutch', 'Korean', 'Bengali', 'Thai', 'Punjabi', 'Greek', 'Polish', 'Malay', 'Tagalog', 'Danish', 'Swedish', 'Finnish', 'Czech', 'Hungarian', 'Ukrainian']
const NATIONALITIES = ['Australian','Brazilian','Canadian','Chinese','French','German','Indian','Italian','Japanese','Korean','Mexican','Russian','Spanish','American']

const MIN_AGE = 18
const MAX_AGE = 60
const MIN_HEIGHT = 150
const MAX_HEIGHT = 190
const MIN_WEIGHT = 50
const MAX_WEIGHT = 90

const DEFAULT_FILTERS = {
    age: [MIN_AGE, MAX_AGE],
    height: [MIN_HEIGHT, MAX_HEIGHT],
    weight: [MIN_WEIGHT, MAX_WEIGHT],
    onlyVerified: false,
    onlyIndependent: false,
    onlyPremium: false,
    services: [],
    outcall: false,
    incall: false,
    bodyType: [],
    hairColor: [],
    eyeColor: [],
    pubicHair: [],
    breastSize: [],
    breastType: [],
    language: [],
    nationality: [],
    sexualOrientation: []
}

const Filters = ({ visible, setVisible, route }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : DEFAULT_LANGUAGE
    }), [route.params])

    const [filters, setFilters] = useState(DEFAULT_FILTERS)
    const [filtersCopy, setFiltersCopy] = useState(DEFAULT_FILTERS)
    const [showMoreLanguages, setShowMoreLanguages] = useState(false)
    const [showMoreNationalities, setShowMoreNationalities] = useState(false)

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, {
                useNativeDriver: true
            })
        } else {
            translateY.value = withTiming(window.height, {
                useNativeDriver: true
            })
        }
    }, [visible])

    useEffect(() => {
        //apply filters
    }, [filters])

    const scrollY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const translateY = useSharedValue(window.height)

    const modalHeaderTextStyles = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollY.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

    const modalContainerStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: '#FFF',
            borderRadius: 24,
            width: normalize(750),
            maxWidth: '90%',
            height: normalize(800),
            maxHeight: '80%',
            overflow: 'hidden',
            transform: [{ translateY: translateY.value }]
        }
    })

    const closeModal = () => {
        //reset filters when not saved
        setFiltersCopy(filters)
        translateY.value = withTiming(window.height, {
            useNativeDriver: true
        })
        setVisible(false)
    }

    const onFiltersChange = useCallback((filterName, value) => {
        setFiltersCopy(filtersCopy => ({
            ...filtersCopy,
            [filterName]: value
        }))
    }, [])

    const onClearFiltersPress = useCallback(() => {
        setFiltersCopy(DEFAULT_FILTERS)
    }, [])

    const onApplyFiltersPress = useCallback(() => {
        setFilters(filtersCopy)

        translateY.value = withTiming(window.height, {
            useNativeDriver: true
        })
        setVisible(false)
    }, [filtersCopy])

    const onMultiPicklistPress = useCallback((value, filterName) => {
        setFiltersCopy(filtersCopy => ({
            ...filtersCopy,
            [filterName]: filtersCopy[filterName].includes(value) 
             ?  filtersCopy[filterName].filter(s => s !== value)
             : filtersCopy[filterName].concat(value)
        }))
    }, [])

    return (
        <Modal transparent={true}
            visible={visible}
            animationType="fade">
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', cursor: 'default' }}
                activeOpacity={1}
                onPressOut={closeModal}
            >
                <TouchableWithoutFeedback>
                    <Animated.View style={modalContainerStyles}>
                        <View style={styles.modal__header}>
                            <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0 }}></View>
                            <View style={{ flexShrink: 1, flexGrow: 0 }}>
                                <Animated.Text style={modalHeaderTextStyles}>Filters</Animated.Text>
                            </View>
                            <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0, alignItems: 'flex-end' }}>
                                <HoverableView style={{ marginRight: SPACING.medium, width: SPACING.x_large, height: SPACING.x_large, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 }} hoveredBackgroundColor={COLORS.hoveredHoveredWhite} backgroundColor={COLORS.hoveredWhite}>
                                    <Ionicons onPress={closeModal} name="close" size={normalize(25)} color="black" />
                                </HoverableView>
                            </View>
                        </View>
                        <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles]} />

                        <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler} style={{ flex: 1, zIndex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small }}>
                            <View style={[styles.filterSection, { marginTop: SPACING.xxxxx_large - SPACING.small }]}>
                                <Text style={styles.filterHeader}>Age range</Text>

                                <Slider range={filtersCopy.age} minValue={MIN_AGE} absoluteMinValue maxValue={MAX_AGE} absoluteMaxValue={false} filterName="age" setFilters={setFiltersCopy} />
                            </View>

                            <View style={styles.filterSection}>
                                <Text style={styles.filterHeader}>Available For</Text>

                                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: SPACING.small }}>
                                    <HoverableView style={{ flex: 1, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderColor: !filtersCopy.incall && !filtersCopy.outcall ? 'transparent' : COLORS.placeholder }} 
                                        backgroundColor={!filtersCopy.incall && !filtersCopy.outcall ? COLORS.red: 'transparent'} 
                                        hoveredBackgroundColor={!filtersCopy.incall && !filtersCopy.outcall ? COLORS.hoveredRed: COLORS.hoveredWhite} 
                                    >
                                        <TouchableOpacity onPress={() => setFiltersCopy(filtersCopy => ({...filtersCopy, outcall: false, incall: false}))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small }}>
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: !filtersCopy.incall && !filtersCopy.outcall ? '#FFF' : '#000'}}>
                                                Both
                                            </Text>
                                        </TouchableOpacity>
                                    </HoverableView>
                                    <HoverableView style={{ flex: 1, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0, borderColor: filtersCopy.outcall ? 'transparent' : COLORS.placeholder }} 
                                        backgroundColor={filtersCopy.outcall ? COLORS.red: 'transparent'} 
                                        hoveredBackgroundColor={filtersCopy.outcall ? COLORS.hoveredRed: COLORS.hoveredWhite} 
                                    >
                                        <TouchableOpacity onPress={() => setFiltersCopy(filtersCopy => ({...filtersCopy, outcall: true, incall: false}))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small }}>
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: filtersCopy.outcall ? '#FFF' : '#000'}}>
                                                Outcall
                                            </Text>
                                        </TouchableOpacity>
                                    </HoverableView>
                                    <HoverableView style={{ flex: 1, justifyContent: 'center', borderWidth: 1, borderColor: filtersCopy.incall ? 'transparent' : COLORS.placeholder,  borderTopRightRadius: 10, borderBottomRightRadius: 10 }} 
                                        backgroundColor={filtersCopy.incall ? COLORS.red: 'transparent'} 
                                        hoveredBackgroundColor={filtersCopy.incall ? COLORS.hoveredRed: COLORS.hoveredWhite} 
                                    >
                                        <TouchableOpacity onPress={() => setFiltersCopy(filtersCopy => ({...filtersCopy, outcall: false, incall: true}))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small }}>
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: filtersCopy.incall ? '#FFF' : '#000'}}>
                                                Incall
                                            </Text>
                                        </TouchableOpacity>
                                    </HoverableView>
                                </View>
                            </View>

                            <View style={styles.filterSection}>
                                <Text style={styles.filterHeader}>Services</Text>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {SERVICES.map((service) => {
                                        const selected = filtersCopy.services.includes(service)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={service}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    selectedColor={selected ? 'green' : '#000'}
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(service, 'services')}
                                                >
                                                    {service}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={[styles.filterSection, { marginHorizontal: 0, paddingBottom: 0, borderWidth: 0 }]}>
                                <Text style={[styles.filterHeader, { marginHorizontal: SPACING.small }]}>Physical attributes</Text>

                                <View style={{ marginHorizontal: SPACING.small, flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.x_small }}>
                                    <View style={{ flex: 1, flexDirection: 'column', minWidth: 300, marginBottom: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                            Height (cm)
                                        </Text>
                                        <Slider range={filtersCopy.height} minValue={MIN_HEIGHT} absoluteMinValue={false} maxValue={MAX_HEIGHT} absoluteMaxValue={false} filterName="height" setFilters={setFiltersCopy} />
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'column', minWidth: 300, marginBottom: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                            Weight (kg)
                                        </Text>
                                        <Slider range={filtersCopy.weight} minValue={MIN_WEIGHT} absoluteMinValue={false} maxValue={MAX_WEIGHT} absoluteMaxValue={false} filterName="weight" setFilters={setFiltersCopy} />
                                    </View>
                                </View>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Body Type
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.x_small }}>
                                    {BODY_TYPES.map((bodyType) => {
                                        const selected = filtersCopy.bodyType.includes(bodyType)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={bodyType}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(bodyType, 'bodyType')}
                                                >
                                                    {bodyType}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Hair Color
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.x_small }}>
                                    {HAIR_COLORS.map((hairColor) => {
                                        const selected = filtersCopy.hairColor.includes(hairColor)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={hairColor}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(hairColor, 'hairColor')}
                                                >
                                                    {hairColor}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Eye Color
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.x_small }}>
                                    {EYE_COLORS.map((eyeColor) => {
                                        const selected = filtersCopy.eyeColor.includes(eyeColor)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={eyeColor}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(eyeColor, 'eyeColor')}
                                                >
                                                    {eyeColor}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Pubic Hair
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.x_small }}>
                                    {PUBIC_HAIR_VALUES.map((pubicHair) => {
                                        const selected = filtersCopy.pubicHair.includes(pubicHair)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={pubicHair}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(pubicHair, 'pubicHair')}
                                                >
                                                    {pubicHair}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Breast Size
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.x_small }}>
                                    {BREAST_SIZES.map((breastSize) => {
                                        const selected = filtersCopy.breastSize.includes(breastSize)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={breastSize}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(breastSize, 'breastSize')}
                                                >
                                                    {breastSize}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>

                                <Text style={{ marginHorizontal: SPACING.small, fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                    Breast Type
                                </Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false}>
                                    {BREAST_TYPES.map((breastType) => {
                                        const selected = filtersCopy.breastType.includes(breastType)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={breastType}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(breastType, 'breastType')}
                                                >
                                                    {breastType}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>
                                <View style={{ borderBottomWidth: 1, borderColor: COLORS.placeholder, marginTop: SPACING.small, marginHorizontal: SPACING.small }}></View>
                            </View>

                            {/* <View style={[styles.filterSection, { marginHorizontal: 0, paddingBottom: 0, borderWidth: 0 }]}>
                                <Text style={[styles.filterHeader, { marginHorizontal: SPACING.small }]}>Sexual Orientation</Text>

                                <ScrollView horizontal contentContainerStyle={{ marginHorizontal: SPACING.small }} showsHorizontalScrollIndicator={false}>
                                    {SEXUAL_ORIENTATION.map((orientation) => {
                                        const selected = filtersCopy.sexualOrientation.includes(orientation)
                                        return (
                                            <HoverableView hoveredOpacity={0.9} style={{ marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}>
                                                <Chip key={orientation}
                                                    style={{ backgroundColor: selected ? COLORS.red : 'transparent' }}
                                                    mode="outlined"
                                                    textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                    onPress={() => onMultiPicklistPress(orientation, 'sexualOrientation')}
                                                >
                                                    {orientation}
                                                </Chip>
                                            </HoverableView>
                                        )
                                    })}
                                </ScrollView>
                                <View style={{ borderBottomWidth: 1, borderColor: COLORS.placeholder, marginTop: SPACING.small, marginHorizontal: SPACING.small }}></View>
                            </View> */}

                            <View style={styles.filterSection}>
                                <Text style={styles.filterHeader}>Profile</Text> 
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xx_small }}>
                                    <View style={{ flex: 1, flexDirection: 'column', marginRight: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }}>
                                            Verified
                                        </Text>
                                        <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2 }}>
                                            Profiles that underwent identity verification process
                                        </Text>
                                    </View>
                                    <Switch value={filtersCopy.onlyVerified}
                                        onValueChange={(value) => onFiltersChange('onlyVerified', value)} color={COLORS.red}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', marginRight: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }}>
                                            Independent
                                        </Text>
                                        <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2 }}>
                                            Not affiliated with agencies
                                        </Text>
                                    </View>
                                    <Switch value={filtersCopy.onlyIndependent}
                                        onValueChange={(value) => onFiltersChange('onlyIndependent', value)} color={COLORS.red}
                                    />
                                </View>
                                {//indepent, verified, premium, with reviews ?
                                }
                            </View>

                            <View style={[styles.filterSection, { marginHorizontal: 0 }]}>
                                <Text style={[styles.filterHeader, { marginHorizontal: SPACING.small }]}>Nationality</Text> 
                                
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {NATIONALITIES.slice(0, showMoreNationalities ? NATIONALITIES.length: 4).map(nationality => (
                                        <View style={{ width: '50%' }}>
                                            <Checkbox.Item key={nationality}
                                                onPress={() => onMultiPicklistPress(nationality, 'nationality')}
                                                color={COLORS.red}
                                                style={{ paddingHorizontal: SPACING.small, paddingVertical: SPACING.xxx_small }}
                                                label={nationality} 
                                                labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }} 
                                                status={filtersCopy.nationality.includes(nationality) ? 'checked': 'unchecked'}
                                                mode="android"
                                            />
                                        </View>
                                    ))}
                                </View>
                                <Text
                                    onPress={() => setShowMoreNationalities(v => !v)}
                                    style={{ width: 'fit-content', textDecorationLine: 'underline', fontFamily: FONTS.medium, marginTop: SPACING.xx_small, marginHorizontal: SPACING.small, fontSize: FONT_SIZES.large }}>
                                    {showMoreNationalities ? 'Show less' : 'Show more'}
                                </Text>
                            </View>

                            <View style={[styles.filterSection, { borderWidth: 0, paddingBottom: 0, marginHorizontal: 0 }]}>
                                <Text style={[styles.filterHeader, { marginHorizontal: SPACING.small }]}>Language</Text> 
                                
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {LANGUAGES.slice(0, showMoreLanguages ? LANGUAGES.length: 4).map(language => (
                                        <View style={{ width: '50%' }}>
                                            <Checkbox.Item key={language}
                                                onPress={() => onMultiPicklistPress(language, 'language')}
                                                color={COLORS.red}
                                                style={{ paddingHorizontal: SPACING.small, paddingVertical: SPACING.xxx_small }}
                                                label={language} 
                                                labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }} 
                                                status={filtersCopy.language.includes(language) ? 'checked': 'unchecked'}
                                                mode="android"
                                            />
                                        </View>
                                    ))}
                                </View>
                                <Text
                                    onPress={() => setShowMoreLanguages(v => !v)}
                                    style={{ width: 'fit-content', textDecorationLine: 'underline', fontFamily: FONTS.medium, marginTop: SPACING.xx_small, marginHorizontal: SPACING.small, fontSize: FONT_SIZES.large }}>
                                    {showMoreLanguages ? 'Show less' : 'Show more'}
                                </Text>
                            </View>
                        </Animated.ScrollView>

                        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.placeholder, paddingHorizontal: SPACING.small, paddingVertical: SPACING.x_small, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <HoverableView style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} hoveredBackgroundColor={COLORS.hoveredWhite} backgroundColor='transparent'>
                                <TouchableOpacity onPress={onClearFiltersPress} style={{ flex: 1, paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small, justifyContent: 'center' }}>
                                    <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, textDecorationLine: 'underline' }}>
                                        Clear all
                                    </Text>
                                </TouchableOpacity>
                            </HoverableView>

                            <HoverableView style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} hoveredBackgroundColor='#000' backgroundColor={COLORS.lightBlack}>
                                <TouchableOpacity onPress={onApplyFiltersPress} style={{ flex: 1, paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small, justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: FONTS.bold, fontSize: FONTS.large, color: '#FFF' }}>Apply filters</Text>
                                </TouchableOpacity>
                            </HoverableView>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default memo(Filters)

const styles = StyleSheet.create({
    modal__header: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: normalize(55),
        //backgroundColor: '#FFF',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modal__shadowHeader: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: normalize(55),
        backgroundColor: '#FFF',
        zIndex: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5
    },
    filterHeader: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.x_large,
        marginBottom: SPACING.x_small
    },
    filterSection: {
        marginHorizontal: SPACING.small,
        paddingVertical: SPACING.small,
        borderBottomWidth: 0.5,
        borderColor: COLORS.placeholder
    }
})