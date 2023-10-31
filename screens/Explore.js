import React, { useCallback, useLayoutEffect, useState, useMemo, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Image } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLORS, FONT_SIZES, FONTS, SUPPORTED_LANGUAGES, SPACING, CATEGORY1, CATEGORY2, CATEGORY3, CATEGORY4, CATEGORY5, SUPPORTED_CATEGORIES, DEFAULT_CATEGORY, DEFAULT_LANGUAGE, SMALL_SCREEN_THRESHOLD, LARGE_SCREEN_THRESHOLD } from '../constants'
import { LinearGradient } from 'expo-linear-gradient'
import { translateLabel, HOME } from '../labels'
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { normalize } from '../utils'

import { FlashList } from "@shopify/flash-list"
import ContentLoader from "react-content-loader"
import StackHeaderLarge from '../components/navigation/StackHeaderLarge'
import StackHeaderSmall from '../components/navigation/StackHeaderSmall'
import HoverableView from '../components/HoverableView'
import RenderClient from '../components/list/RenderClient'

import { MOCK_DATA } from '../constants'

const Explore = ({ route, navigation }) => {
    const { width } = useWindowDimensions()
    const isSmalScreen = width < SMALL_SCREEN_THRESHOLD
    const isLargeScreen = width >= LARGE_SCREEN_THRESHOLD

    const numOfColumns = useMemo(() => {
        return isSmalScreen ? 2 : isLargeScreen ? 5 : 3 
    }, [isSmalScreen, isLargeScreen])

    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : undefined,
        category: SUPPORTED_CATEGORIES.includes(decodeURIComponent(route.params.category)) ? decodeURIComponent(route.params.category) : undefined
    }), [route])
    
    const [selectedCategory, setSelectedCategory] = useState(SUPPORTED_CATEGORIES.includes(route.params.category) ? route.params.category : DEFAULT_CATEGORY)
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        setIsLoading(true)
        //load items
        setTimeout(() => {
            setData([...MOCK_DATA])
            setIsLoading(false)
        }, 1000)
    }, [selectedCategory])

    useLayoutEffect(() => {
        /*navigation.setOptions({
            header: () => width < 700 ? <StackHeaderSmall language={params.language} /> : <StackHeaderLarge language={params.language} navigation={navigation} />
        })*/
    }, [width < 700, params])

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
        } else if(leftCategoryScrollOpacity.value !== 1) {
            //scrolled from left side
            leftCategoryScrollOpacity.value = 1
        }

        //reached right side
        if(event.nativeEvent.layoutMeasurement.width + event.nativeEvent.contentOffset.x === event.nativeEvent.contentSize.width) {
            rightCategoryScrollOpacity.value = 0
        } else if (rightCategoryScrollOpacity.value !== 1) {
            //scrolled from right side
            rightCategoryScrollOpacity.value = 1
        }
    }, [])

    const onCategoryPress = useCallback((category) => {
        setSelectedCategory(category)
        navigation.setParams({
            ...JSON.parse(JSON.stringify(params)),
            category
        })
    }, [params])

    const renderItem = useCallback(({ item }) => {
        switch (selectedCategory) {
            case CATEGORY1:
                return <RenderClient client={item}/>
            case CATEGORY2:
                return <RenderClient client={item}/>
            case CATEGORY3:
                return <RenderClient client={item}/>
            case CATEGORY4:
                return <RenderClient client={item}/>
            case CATEGORY5:
                return <RenderClient client={item}/>
            default:
                return <View></View>
        }
    }, [selectedCategory])

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <View style={{ flexDirection: 'row', marginHorizontal: SPACING.xx_large, marginVertical: SPACING.large }}>
                <ScrollView onScroll={onCategoryScroll} scrollEventThrottle={16} centerContent showsHorizontalScrollIndicator={false} horizontal style={{ flexGrow: 1 }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <HoverableView hoveredOpacity={0.7} style={{ marginRight: SPACING.small }}>
                        <TouchableOpacity style={[styles.categoryContainer, selectedCategory === CATEGORY1 ? styles.selectedCategoryContainer : {}]} activeOpacity={0.8} onPress={() => onCategoryPress(CATEGORY1)}>
                            <AntDesign name="home" size={normalize(26)} color={selectedCategory === CATEGORY1 ? COLORS.red : COLORS.placeholder} />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: selectedCategory === CATEGORY1 ? COLORS.red : COLORS.placeholder }}>Home</Text>
                        </TouchableOpacity>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <TouchableOpacity style={[styles.categoryContainer, selectedCategory === CATEGORY2 ? styles.selectedCategoryContainer : {}]} activeOpacity={0.8} onPress={() => onCategoryPress(CATEGORY2)}>
                            <AntDesign name="home" size={normalize(26)} color={selectedCategory === CATEGORY2 ? COLORS.red : COLORS.placeholder} />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: selectedCategory === CATEGORY2 ? COLORS.red : COLORS.placeholder }}>Home</Text>
                        </TouchableOpacity>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <TouchableOpacity style={[styles.categoryContainer, selectedCategory === CATEGORY3 ? styles.selectedCategoryContainer : {}]} activeOpacity={0.8} onPress={() => onCategoryPress(CATEGORY3)}>
                            <AntDesign name="home" size={normalize(26)} color={selectedCategory === CATEGORY3 ? COLORS.red : COLORS.placeholder} />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: selectedCategory === CATEGORY3 ? COLORS.red : COLORS.placeholder }}>Home</Text>
                        </TouchableOpacity>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <TouchableOpacity style={[styles.categoryContainer, selectedCategory === CATEGORY4 ? styles.selectedCategoryContainer : {}]} activeOpacity={0.8} onPress={() => onCategoryPress(CATEGORY4)}>
                            <AntDesign name="home" size={normalize(26)} color={selectedCategory === CATEGORY4 ? COLORS.red : COLORS.placeholder} />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: selectedCategory === CATEGORY4 ? COLORS.red : COLORS.placeholder }}>Home</Text>
                        </TouchableOpacity>
                    </HoverableView>
                    <HoverableView hoveredOpacity={0.7} style={{ marginHorizontal: SPACING.small }}>
                        <TouchableOpacity style={[styles.categoryContainer, selectedCategory === CATEGORY5 ? styles.selectedCategoryContainer : {}]} activeOpacity={0.8} onPress={() => onCategoryPress(CATEGORY5)}>
                            <AntDesign name="home" size={normalize(26)} color={selectedCategory === CATEGORY5 ? COLORS.red : COLORS.placeholder} />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: selectedCategory === CATEGORY5 ? COLORS.red : COLORS.placeholder }}>Home</Text>
                        </TouchableOpacity>
                    </HoverableView>
                </ScrollView>
                <Animated.View style={leftCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        COLORS.lightBlack,
                        'rgba(255 255 255/0)',
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ width: normalize(30), height: '100%' }}/>
                </Animated.View>
                <Animated.View style={rightCategoryScrollOpacityStyle}>
                    <LinearGradient colors={[
                        'rgba(255 255 255/0)',
                        COLORS.lightBlack,
                    ]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }} style={{ position: 'absolute', width: normalize(30), height: '100%' }}/>
                </Animated.View>
                <HoverableView hoveredOpacity={0.7} style={{ justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <Image
                            resizeMode='contain'
                            source={require('../assets/icons/filter.svg')}
                            tintColor= '#FFF'
                            style={{
                                width: SPACING.medium,
                                height: SPACING.medium
                            }}
                        />
                    </TouchableOpacity>
                </HoverableView>
            </View>

            {
                isLoading ? (
                    <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
                        <ContentLoader
                            speed={2}
                            width={400}
                            height={150}
                            viewBox="0 0 400 150"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <circle cx="10" cy="20" r="8" />
                            <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
                            <circle cx="10" cy="50" r="8" />
                            <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
                            <circle cx="10" cy="80" r="8" />
                            <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
                            <circle cx="10" cy="110" r="8" />
                            <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
                        </ContentLoader>
                    </View>
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderItem}
                        estimatedItemSize={200}
                        numColumns={numOfColumns}
                        refreshing={isLoading}
                        contentContainerStyle={{ paddingHorizontal: SPACING.medium }}
                        //ListEmptyComponent={{}}
                    />
                )
            }
        </View>
    )
}

export default Explore

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