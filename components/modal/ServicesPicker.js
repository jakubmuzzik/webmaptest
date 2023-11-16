import React, { useMemo, useState, useCallback, useRef, useEffect, memo } from 'react'
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, TextInput, Image, StyleSheet, Dimensions } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import HoverableView from '../HoverableView'
import { normalize } from '../../utils'
import {
    SERVICES
} from '../../labels'
import {
    COLORS,
    FONTS,
    FONT_SIZES,
    SPACING,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
} from '../../constants'
import { TouchableRipple } from 'react-native-paper'

const window = Dimensions.get('window')

const ServicesPicker = ({ visible, setVisible, route, services, onSelect }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : DEFAULT_LANGUAGE
    }), [route.params])

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

    const [searchBorderColor, setSearchBorderColor] = useState(COLORS.placeholder)
    const [search, setSearch] = useState('')

    const filteredServicesRef = useRef([...SERVICES])

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

    const onSearch = useCallback((search) => {
        filteredServicesRef.current = search ? [...SERVICES].filter(service => service.toLowerCase().includes(search.toLowerCase())) : [...SERVICES]
        setSearch(search)
    }, [filteredServicesRef.current])

    const closeModal = () => {
        translateY.value = withTiming(window.height, {
            useNativeDriver: true
        })
        setVisible(false)
    }

    const modalContainerStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: '#FFF',
            borderRadius: 24,
            width: normalize(500),
            maxWidth: '90%',
            height: normalize(500),
            maxHeight: '80%',
            overflow: 'hidden',
            transform: [{ translateY: translateY.value }]
        }
    })

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
                                <Animated.Text style={modalHeaderTextStyles}>Select Services</Animated.Text>
                            </View>
                            <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0, alignItems: 'flex-end' }}>
                                <HoverableView style={{ marginRight: SPACING.medium, width: SPACING.x_large, height: SPACING.x_large, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 }} hoveredBackgroundColor={COLORS.hoveredHoveredWhite} backgroundColor={COLORS.hoveredWhite}>
                                    <Ionicons onPress={closeModal} name="close" size={normalize(25)} color="black" />
                                </HoverableView>
                            </View>
                        </View>
                        <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles]} />

                        <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler} style={{ flex: 1, zIndex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small }}>
                            <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginTop: SPACING.xxxxx_large, marginHorizontal: SPACING.small }}>Select Services</Text>

                            <HoverableView style={{ ...styles.searchWrapper, borderRadius: 10, marginVertical: SPACING.xx_small, marginHorizontal: SPACING.small }} hoveredBackgroundColor='#FFF' backgroundColor='#FFF' hoveredBorderColor={COLORS.red} borderColor={searchBorderColor} transitionDuration='0ms'>
                                <Ionicons name="search" size={normalize(20)} color="black" />
                                <TextInput
                                    style={styles.citySearch}
                                    onChangeText={onSearch}
                                    value={search}
                                    placeholder="Search services"
                                    placeholderTextColor="grey"
                                    onBlur={() => setSearchBorderColor(COLORS.placeholder)}
                                    onFocus={() => setSearchBorderColor(COLORS.red)}
                                />
                                <Ionicons onPress={() => onSearch('')} style={{ opacity: search ? '1' : '0' }} name="close" size={normalize(20)} color="black" />
                            </HoverableView>

                            {filteredServicesRef.current.map(service => {
                                const selected = services.includes(service)
                                return (
                                    <HoverableView key={service} hoveredBackgroundColor={selected ?  "rgba(220, 46, 46, .22)" : COLORS.hoveredWhite} backgroundColor={selected ? "rgba(220, 46, 46, .18)" : '#FFF'}>
                                        <TouchableRipple
                                            onPress={() => onSelect(service)}
                                            style={{ paddingVertical: SPACING.xx_small, paddingHorizontal: SPACING.medium, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}
                                            rippleColor="rgba(220, 46, 46, .22)"
                                        >
                                            <>
                                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                                    {service}
                                                </Text>
                                                {
                                                    selected ? <MaterialIcons name="done" style={{ height: normalize(20), width: normalize(20) }} size={normalize(20)} color="green" />
                                                        : <Ionicons name="add-outline" style={{ height: normalize(20), width: normalize(20) }} size={normalize(20)} color="black" />
                                                }
                                            </>
                                        </TouchableRipple>
                                    </HoverableView>
                                )

                            })}
                        </Animated.ScrollView>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default memo(ServicesPicker)

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
    searchWrapper: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        paddingHorizontal: SPACING.x_small,
        overflow: 'hidden'
    },
    citySearch: {
        flex: 1,
        padding: SPACING.xx_small,
        borderRadius: 20,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,
        outlineStyle: 'none',
        color: '#000'
    },
    countrySection: {
        marginVertical: SPACING.xx_small,
        flexDirection: 'row',
        alignItems: 'center'
    },
    countrySection__text: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.large
    },
    countrySection__image: {
        width: SPACING.small,
        height: SPACING.x_small,
        marginRight: SPACING.xx_small,
        marginLeft: SPACING.small
    },
    service: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium
    },
    serviceContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.small,
        width: '100%', 
        paddingVertical: SPACING.xx_small, 
        paddingLeft: SPACING.xx_small, 
        alignItems: 'center'
    },
})