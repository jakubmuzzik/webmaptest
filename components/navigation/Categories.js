import React, { useCallback, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { AntDesign, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONT_SIZES, FONTS, SPACING } from '../../constants'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { normalize, stripEmptyParams } from '../../utils'
import { Link } from '@react-navigation/native'
import { SUPPORTED_LANGUAGES } from '../../constants'
import { CZECH_CITIES } from '../../labels'

import HoverableView from '../../components/HoverableView'

const Categories = ({ route }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(route.params.language) ? route.params.language : '',
        city: CZECH_CITIES.includes(route.params.city) ? route.params.city : ''
    }), [route.params])

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
            right: SPACING.medium,
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

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.grey, borderTopWidth: 0.5, borderColor: 'grey' }}>
            <View style={{ flexDirection: 'row', marginHorizontal: SPACING.page_horizontal, marginVertical: SPACING.x_small }}>
                <ScrollView onScroll={onCategoryScroll} scrollEventThrottle={16} centerContent showsHorizontalScrollIndicator={false} horizontal style={{ flexGrow: 1 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <HoverableView hoveredOpacity={0.7} style={{ marginRight: SPACING.small }}>
                        {/* <Link to={{ screen: 'Esc', params: route.params.language ? { language: route.params.language } : {} }}> */}
                        <Link to={{ screen: 'Esc', params: { ...stripEmptyParams(params) } }}>
                            <View style={[styles.categoryContainer, route.name === 'Esc' ? styles.selectedCategoryContainer : {}]}>
                                <Entypo name="mask" size={normalize(26)} color={route.name === 'Esc' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Esc' ? COLORS.red : COLORS.placeholder }}>Esc</Text>
                            </View>
                        </Link>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Pri', params: { ...stripEmptyParams(params) } }}>
                            <View style={[styles.categoryContainer, route.name === 'Pri' ? styles.selectedCategoryContainer : {}]}>
                                <AntDesign name="github" size={normalize(26)} color={route.name === 'Pri' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Pri' ? COLORS.red : COLORS.placeholder }}>Pri</Text>
                            </View>
                        </Link>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Mas', params: { ...stripEmptyParams(params) } }}>
                            <View style={[styles.categoryContainer, route.name === 'Mas' ? styles.selectedCategoryContainer : {}]}>
                                <FontAwesome5 name="person-booth" size={normalize(26)} color={route.name === 'Mas' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Mas' ? COLORS.red : COLORS.placeholder }}>Mas</Text>
                            </View>
                        </Link>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <Link to={{ screen: 'Clu', params: { ...stripEmptyParams(params) } }}>
                            <View style={[styles.categoryContainer, route.name === 'Clu' ? styles.selectedCategoryContainer : {}]}>
                                <MaterialIcons name="meeting-room" size={normalize(26)} color={route.name === 'Clu' ? COLORS.red : COLORS.placeholder} />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: route.name === 'Clu' ? COLORS.red : COLORS.placeholder }}>Clu</Text>
                            </View>
                        </Link>
                    </HoverableView>
                </ScrollView>
                <Animated.View style={leftCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        COLORS.grey,
                        'rgba(255 255 255/0)',
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ width: normalize(30), height: '100%' }} />
                </Animated.View>
                <Animated.View style={rightCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        'rgba(255 255 255/0)',
                        COLORS.grey,
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ position: 'absolute', width: normalize(30), height: '100%' }} />
                </Animated.View>
                <HoverableView hoveredOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Image
                            resizeMode='contain'
                            source={require('../../assets/icons/filter.svg')}
                            tintColor='#FFF'
                            style={{
                                width: SPACING.medium,
                                height: SPACING.medium
                            }}
                        />
                    </TouchableOpacity>
                </HoverableView>
            </View>
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
    }
})