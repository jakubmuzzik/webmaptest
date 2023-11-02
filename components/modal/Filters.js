import React, { useMemo, useEffect, useState, useCallback, useRef, memo } from 'react'
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, Dimensions, StyleSheet, TextInput } from 'react-native'
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
import { Switch, Chip} from 'react-native-paper'
import Slider from '../Slider'

const window = Dimensions.get('window')

const SMOKER_VALUES = ['Non-Smoker', 'Occasionally', 'Regularly'] //nekurak, nepravidelne, pravidelne
const BODY_TYPES = ['Slim', 'Athletic', 'Muscular', 'Curvy']
const PUBIC_HAIR_VALUES = ['Shaved', 'Trimmed', 'Hairy']
const SEXUAL_ORIENTATION = ['Heterosexual', 'Homosexual', 'Bisexual', 'Transsexual']
const SERVICES = ['service1', 'service2', 'service3', 'service4', 'service5', 'service6', 'service7']

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
    services: []
}

const Filters = ({ visible, setVisible, route }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : DEFAULT_LANGUAGE
    }), [route.params])

    const [filters, setFilters] = useState(DEFAULT_FILTERS)

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
        translateY.value = withTiming(window.height, {
            useNativeDriver: true
        })
        setVisible(false)
    }

    const onFiltersChange = useCallback((filterName, value) => {
        setFilters(filters => ({
            ...filters,
            [filterName]: value
        }))
    }, [])

    const onClearFiltersPress = useCallback(() => {
        setFilters(DEFAULT_FILTERS)
    }, [])

    const onApplyFiltersPress = useCallback(() => {
       closeModal()
    }, [])

    const onServicePress = useCallback((service) => {
        setFilters(filters => ({
            ...filters,
            services: filters.services.includes(service) 
             ?  filters.services.filter(s => s !== service)
             : filters.services.concat(service)
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

                                <Slider range={filters.age} minValue={MIN_AGE} absoluteMinValue maxValue={MAX_AGE} absoluteMaxValue={false} filterName="age" setFilters={setFilters} />
                            </View>

                            <View style={styles.filterSection}>
                                <Text style={styles.filterHeader}>Services</Text> 
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {SERVICES.map((service) => {
                                        const selected = filters.services.includes(service)
                                        return (
                                            <Chip key={service}
                                                style={{ backgroundColor: selected ? COLORS.red : 'transparent', marginRight: SPACING.xx_small, marginBottom: SPACING.xx_small }}
                                                selected={selected}
                                                icon={() => selected && <Entypo name="check" size={18} color="green" />}
                                                mode="outlined"
                                                selectedColor={selected ? 'green' : '#000'}
                                                textStyle={{ fontFamily: selected ? FONTS.bold : FONTS.medium, fontSize: FONT_SIZES.medium, color: selected ? '#FFF' : '#000' }}
                                                elevated
                                                onPress={() => onServicePress(service)}
                                            >
                                                {service}
                                            </Chip>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.filterSection}>
                                <Text style={styles.filterHeader}>Physical attributes</Text>  
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', minWidth: 300, marginBottom: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                            Height (cm)
                                        </Text>
                                        <Slider range={filters.height} minValue={MIN_HEIGHT} absoluteMinValue={false} maxValue={MAX_HEIGHT} absoluteMaxValue={false} filterName="height" setFilters={setFilters} />
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'column', minWidth: 300, marginBottom: SPACING.small }}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginBottom: SPACING.x_small }}>
                                            Weight (kg)
                                        </Text>
                                        <Slider range={filters.weight} minValue={MIN_WEIGHT} absoluteMinValue={false} maxValue={MAX_WEIGHT} absoluteMaxValue={false} filterName="weight" setFilters={setFilters} />
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.filterSection, { borderWidth: 0, paddingBottom: 0 }]}>
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
                                    <Switch value={filters.onlyVerified}
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
                                    <Switch value={filters.onlyIndependent}
                                        onValueChange={(value) => onFiltersChange('onlyIndependent', value)} color={COLORS.red}
                                    />
                                </View>
                                {//indepent, verified, premium, with reviews ?
                                }
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