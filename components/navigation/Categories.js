import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import { AntDesign, Entypo, FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons'
import { COLORS, FONT_SIZES, FONTS, SPACING, SMALL_SCREEN_THRESHOLD, LARGE_SCREEN_THRESHOLD } from '../../constants'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { normalize, stripEmptyParams } from '../../utils'
import { Link } from '@react-navigation/native'
import { SUPPORTED_LANGUAGES } from '../../constants'
import { CZECH_CITIES, CITY, ANYWHERE, SELECT_CITY, SEARCH, CZECH, translateLabels } from '../../labels'
import { Badge } from 'react-native-paper'
import { StackActions } from '@react-navigation/native'

import HoverableView from '../../components/HoverableView'
import Filters from '../modal/Filters'
import CityPicker from '../modal/CityPicker'

const Categories = ({ route, navigation }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
        city: CZECH_CITIES.includes(decodeURIComponent(route.params.city)) ? decodeURIComponent(route.params.city) : ''
    }), [route.params])

    const labels = useMemo(() => translateLabels(route.params.language, [
        CZECH,
        CITY,
        SELECT_CITY,
        SEARCH,
        ANYWHERE
    ]), [params.language])

    const filtersRef = useRef()

    //close modals when changing language, city etc...
    useEffect(() => {
        setFiltersVisible(false)
        setLocationModalVisible(false)
        if (filtersRef.current) {
            setFiltersCount(Object.keys(filtersRef.current.filterParams).length)
        }
    }, [route.params])

    const { width } = useWindowDimensions()
    const isSmallScreen = width <= SMALL_SCREEN_THRESHOLD
    const isLargeScreen = width >= LARGE_SCREEN_THRESHOLD

    const [filtersVisible, setFiltersVisible] = useState(false)
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    const [filtersCount, setFiltersCount] = useState(0)

    const leftCategoryScrollOpacity = useSharedValue(0)
    const rightCategoryScrollOpacity = useSharedValue(1)
    const leftCategoryScrollOpacityStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            left: 0,
            width: normalize(30),
            height: '100%',
            opacity: withTiming(leftCategoryScrollOpacity.value, {
                duration: 200,
            }),
        }
    })
    const rightCategoryScrollOpacityStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            right: 0,//SPACING.medium,
            width: normalize(30),
            height: '100%',
            opacity: withTiming(rightCategoryScrollOpacity.value, {
                duration: 200,
            }),
        }
    })

    const onCategoryScroll = useCallback((event) => {
        //reached left side
        if (event.nativeEvent.contentOffset.x === 0) {
            leftCategoryScrollOpacity.value = 0
        } else if (leftCategoryScrollOpacity.value !== 1) {
            //scrolled from left side
            leftCategoryScrollOpacity.value = 1
        }

        //reached right side
        if (event.nativeEvent.layoutMeasurement.width + event.nativeEvent.contentOffset.x === event.nativeEvent.contentSize.width) {
            rightCategoryScrollOpacity.value = 0
        } else if (rightCategoryScrollOpacity.value !== 1) {
            //scrolled from right side
            rightCategoryScrollOpacity.value = 1
        }
    }, [])

    const onFiltersPress = () => {
        setFiltersVisible(true)
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.grey, borderTopWidth: 0.5, borderColor: 'grey', flexDirection: 'row' }}>
            
            <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: SPACING.page_horizontal, marginVertical: SPACING.xx_small  }}>
                <ScrollView onScroll={onCategoryScroll} scrollEventThrottle={16} showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                    <HoverableView hoveredOpacity={0.7} style={{ marginRight: SPACING.small }}>
                        {/* <Link to={{ screen: 'Esc', params: route.params.language ? { language: route.params.language } : {} }}> */}
                        <Link to={{ screen: 'Esc', params: { ...stripEmptyParams(params) } }} action={StackActions.replace('Esc', {  ...stripEmptyParams(params) })}>
                            <View style={[styles.categoryContainer, route.name === 'Esc' ? styles.selectedCategoryContainer : {}]}>
                                <Entypo name="mask" size={normalize(26)} color={route.name === 'Esc' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Esc' ? COLORS.red : COLORS.placeholder }}>Esc</Text>
                            </View>
                        </Link>  
                    </HoverableView>
                    {/* <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Pri', params: { ...stripEmptyParams(params) } }} action={StackActions.replace('Pri', {  ...stripEmptyParams(params) })}>
                            <View style={[styles.categoryContainer, route.name === 'Pri' ? styles.selectedCategoryContainer : {}]}>
                                <AntDesign name="github" size={normalize(26)} color={route.name === 'Pri' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Pri' ? COLORS.red : COLORS.placeholder }}>Pri</Text>
                            </View>
                        </Link>
                    </HoverableView> */}
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Mas', params: { ...stripEmptyParams(params) } }} action={StackActions.replace('Mas', {  ...stripEmptyParams(params) })}>
                            <View style={[styles.categoryContainer, route.name === 'Mas' ? styles.selectedCategoryContainer : {}]}>
                                <FontAwesome5 name="person-booth" size={normalize(26)} color={route.name === 'Mas' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Mas' ? COLORS.red : COLORS.placeholder }}>Mas</Text>
                            </View>
                        </Link>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Clu', params: { ...stripEmptyParams(params) } }} action={StackActions.replace('Clu', {  ...stripEmptyParams(params) })}>
                            <View style={[styles.categoryContainer, route.name === 'Clu' ? styles.selectedCategoryContainer : {}]}>
                                <MaterialIcons name="meeting-room" size={normalize(26)} color={route.name === 'Clu' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Clu' ? COLORS.red : COLORS.placeholder }}>Clu</Text>
                            </View>
                        </Link>
                    </HoverableView>
                </ScrollView>
                <Animated.View pointerEvents="none" style={leftCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        COLORS.grey,
                        'rgba(255 255 255/0)',
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ width: normalize(30), height: '100%' }} />
                </Animated.View>
                <Animated.View pointerEvents="none" style={rightCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        'rgba(255 255 255/0)',
                        COLORS.grey,
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ width: normalize(30), height: '100%' }} />
                </Animated.View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <HoverableView style={{ marginHorizontal: SPACING.x_small }} hoveredOpacity={0.7}>
                    <TouchableOpacity style={styles.locationWrapper} activeOpacity={0.8}
                        onPress={() => setLocationModalVisible(true)}
                    >
                        <Ionicons style={{ paddingRight: isLargeScreen ? SPACING.xx_small : 0 }} name="md-location-sharp" size={normalize(30)} color={COLORS.red} />
                        {isLargeScreen && <View style={styles.locationWrapper__text}>
                            <Text style={styles.locationHeader}>{params.city ? labels.CITY : labels.ANYWHERE}</Text>
                            <Text style={styles.locationValue} numberOfLines={1}>{params.city}</Text>
                        </View>}
                        <MaterialIcons style={{ paddingLeft: isLargeScreen ? SPACING.xx_small : 0 }} name="keyboard-arrow-down" size={normalize(24)} color={COLORS.red} />
                    </TouchableOpacity>
                </HoverableView>

                <HoverableView hoveredBackgroundColor={COLORS.lightGrey} style={{ justifyContent: 'center', alignItems: 'flex-end', borderWidth: 2, borderRadius: 15, borderColor: filtersCount > 0 ? COLORS.red :COLORS.hoveredLightGrey, marginRight: SPACING.page_horizontal }}>
                    <TouchableOpacity onPress={onFiltersPress} style={{ paddingHorizontal: SPACING.x_small, paddingVertical: SPACING.xx_small, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            resizeMode="contain"
                            source={require('../../assets/icons/filter.svg')}
                            tintColor='#FFF'
                            style={{
                                width: normalize(18),
                                height:  normalize(18)
                            }}
                        />
                        {!isSmallScreen && <Text style={{ marginLeft: SPACING.xx_small, fontFamily: FONTS.medium, letterSpacing: 1, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                            Filters
                        </Text>}
                        {filtersCount > 0 && <View style={{ position: 'absolute', top: normalize(-9, true), right: normalize(-9, true), backgroundColor: COLORS.red, borderRadius: '50%', width: normalize(20), height: normalize(20), alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#FFF', fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>{filtersCount}</Text>
                        </View>}
                    </TouchableOpacity>
                </HoverableView>
            </View>

            <Filters ref={filtersRef} visible={filtersVisible} setVisible={setFiltersVisible} route={route} navigation={navigation} />
            <CityPicker visible={locationModalVisible} setVisible={setLocationModalVisible} route={route} />
        </View>
    )
}

export default Categories

const styles = StyleSheet.create({
    categoryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCategoryContainer: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.red
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationWrapper__text: {
        flexDirection: 'column'
    },
    locationHeader: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium,
        color: '#FFF'
    },
    locationValue: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.medium,
        color: '#FFF'
    },
})