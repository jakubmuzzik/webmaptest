import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, CATEGORY1, CATEGORY2, CATEGORY3, CATEGORY4, CATEGORY5, SMALL_SCREEN_THRESHOLD, LARGE_SCREEN_THRESHOLD } from '../constants'
import HoverableView from '../components/HoverableView'
import { MaterialIcons } from '@expo/vector-icons'
import { normalize } from '../utils'
import {
    SELECT_CITY,
    translateLabels
} from '../labels'
import CityPicker from '../components/modal/CityPicker'
import { useLinkProps, Link } from '@react-navigation/native'

const Home = ({ route, navigation }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(route.params.language) ? route.params.language : DEFAULT_LANGUAGE
    }), [route.params])

    const labels = useMemo(() => translateLabels(params.language, [
        SELECT_CITY
    ]), [params.language])

    const [locationModalVisible, setLocationModalVisible] = useState(false)

    console.log(navigation.isFocused())

    useEffect(() => {
        setLocationModalVisible(false)
    }, [route.params])

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setLocationModalVisible(false)
        })

        return unsubscribe
    }, [navigation])

    const { width } = useWindowDimensions()
    const isXSmallScreen = width < 300
    const isSmallScreen = width >= 300 && width < SMALL_SCREEN_THRESHOLD
    const isMediumScreen = width >= SMALL_SCREEN_THRESHOLD && width < 960
    const isLargeScreen = width >= 960 && width < 1300
    const isXLargeScreen = width >= 1300

    
    const categoryFlexBasis = isXSmallScreen ? (width) - (SPACING.large + SPACING.large)
        : isSmallScreen ? (width / 2) - (SPACING.large + SPACING.large / 2)
        : isMediumScreen ? (width / 3) - (SPACING.large + SPACING.large / 3)
        : isLargeScreen ? (width / 4) - (SPACING.large + SPACING.large / 4) : (width / 5) - (SPACING.large + SPACING.large / 5)
    //isSmallScreen ? (width / 2) - (SPACING.large + SPACING.large / 2) : isLargeScreen ? (width / 4) - (SPACING.large + SPACING.large / 4) : (width / 3) - (SPACING.large + SPACING.large / 3)

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <View style={{ marginBottom: SPACING.medium }}>
                <ImageBackground
                    source={require('../assets/header_logo2.png')}
                    style={{ width: '100%', /*height: 390,*/ justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xx_large, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, overflow: 'hidden' }}
                    imageStyle={{ opacity: 0.6 }}
                    resizeMode='cover'
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.medium }}>
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', textAlign: 'center' }}>Find and Book Your Perfect Massage</Text>
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: '#FFF', marginTop: SPACING.medium, textAlign: 'center' }}>Discover Local Masseuses Near You!</Text>
                    </View>
                    <HoverableView style={{ marginTop: SPACING.x_large, borderRadius: 10, borderWidth: 2, borderColor: '#FFF', alignItems: 'center', overflow: 'hidden' }} hoveredBackgroundColor='rgba(255,255,255,0.1)'>
                        <TouchableOpacity onPress={() => setLocationModalVisible(true)} style={{ flexDirection: 'row', paddingHorizontal: SPACING.small, paddingVertical: SPACING.xx_small, alignItems: 'center', justifyContent: 'space-between' }} activeOpacity={0.8}>
                            {/* <Ionicons name="md-location-sharp" size={normalize(20)} color="white" /> */}
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: '#FFF', marginHorizontal: SPACING.xx_small }}>{labels.SELECT_CITY}</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={normalize(20)} color="white" />
                        </TouchableOpacity>
                    </HoverableView>
                </ImageBackground>
            </View>

            <View style={{ }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', marginLeft: SPACING.large, marginBottom: SPACING.medium }}>Browse by Category</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.large }}>
                    <HoverableView style={{...styles.categoryContainer, flexBasis: categoryFlexBasis }} hoveredOpacity={0.8}>
                        <Link to={{ screen: 'Esc', params: route.params.language ? { language: params.language } : {} }}>
                            <ImageBackground
                                source={require('../assets/CATEGORY.png')}
                                style={[styles.category, { width: '100%'}]}
                                imageStyle={{ opacity: 0.6 }}
                                resizeMode='cover'
                            >
                                <Text style={styles.categoryText}>{CATEGORY1}</Text>
                            </ImageBackground>
                        </Link>
                    </HoverableView>
                    <HoverableView style={{...styles.categoryContainer, flexBasis: categoryFlexBasis }} hoveredOpacity={0.8}>
                        <Link to={{ screen: 'Pri', params: route.params.language ? { language: params.language } : {} }}>
                            <ImageBackground
                                source={require('../assets/CATEGORY.png')}
                                style={[styles.category, { width: '100%'}]}
                                imageStyle={{ opacity: 0.6 }}
                                resizeMode='cover'
                            >
                                <Text style={styles.categoryText}>{CATEGORY2}</Text>
                            </ImageBackground>
                        </Link>
                    </HoverableView>
                    <HoverableView style={{...styles.categoryContainer, flexBasis: categoryFlexBasis }} hoveredOpacity={0.8}>
                        <Link to={{ screen: 'Mas', params: route.params.language ? { language: params.language } : {} }}>
                            <ImageBackground
                                source={require('../assets/CATEGORY.png')}
                                style={[styles.category, { width: '100%'}]}
                                imageStyle={{ opacity: 0.6 }}
                                resizeMode='cover'
                            >
                                <Text style={styles.categoryText}>{CATEGORY3}</Text>
                            </ImageBackground>
                        </Link>
                    </HoverableView>
                    <HoverableView style={{...styles.categoryContainer, flexBasis: categoryFlexBasis }} hoveredOpacity={0.8}>
                        <Link to={{ screen: 'Clu', params: route.params.language ? { language: params.language } : {} }}>
                            <ImageBackground
                                source={require('../assets/CATEGORY.png')}
                                style={[styles.category, { width: '100%'}]}
                                imageStyle={{ opacity: 0.6 }}
                                resizeMode='cover'
                            >
                                <Text style={styles.categoryText}>{CATEGORY4}</Text>
                            </ImageBackground>
                        </Link>
                    </HoverableView>
                    <HoverableView style={{...styles.categoryContainer, flexBasis: categoryFlexBasis }} hoveredOpacity={0.8}>
                        <Link to={{ screen: 'Esc', params: route.params.language ? { language: params.language } : {} }}>
                            <ImageBackground
                                source={require('../assets/CATEGORY.png')}
                                style={[styles.category, { width: '100%'}]}
                                imageStyle={{ opacity: 0.6 }}
                                resizeMode='cover'
                            >
                                <Text style={styles.categoryText}>{CATEGORY5}</Text>
                            </ImageBackground>
                        </Link>
                    </HoverableView>
                </View>
            </View>

            <CityPicker visible={locationModalVisible} setVisible={setLocationModalVisible} route={{ name: 'Explore', params: route.params.language ? { language: params.language } : {} }} />
        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    categoryContainer: {
        marginRight: SPACING.large,
        marginBottom: SPACING.large,
        flexShrink: 1
    },
    category: {
        paddingVertical: SPACING.xx_large, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
    },
    categoryText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.large,
        color: '#FFF'
    }
})