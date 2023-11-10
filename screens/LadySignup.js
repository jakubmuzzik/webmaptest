import React, { useState, useRef } from 'react'
import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants'
import { normalize } from '../utils'
import { ProgressBar, Button } from 'react-native-paper'

const LadySignup = () => {
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const viewPagerRef = useRef()
    const viewPagerX = useRef(0)

    const renderLoginInformation = () => {
        return (
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3 }}>
                Login Information
            </Text>
        )
    }

    const renderPersonalDetails = () => {
        return (
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3 }}>
                Personal Details
            </Text>
        )
    }

    const renderLocationAndAvailability = () => {
        return (
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3 }}>
                Location & Availability
            </Text>
        )
    }

    const renderServicesAndPricing = () => {
        return (
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3 }}>
                Services & Pricing
            </Text>
        )
    }

    const renderUploadPhotos = () => {
        return (
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3 }}>
                Upload Photos
            </Text>
        )
    }

    const pages = {
        'Login Information': renderLoginInformation,
        'Personal Details': renderPersonalDetails,
        'Location & Availability': renderLocationAndAvailability,
        'Services & Pricing': renderServicesAndPricing,
        'Upload Photos': renderUploadPhotos
    }

    const renderPage = ({ item }) => {
        return (
            <View style={{ flexGrow: 1, width: contentWidth }}>
                {pages[item]()}
            </View>
        )
    }

    const handleScroll = ({ nativeEvent }) => {
        viewPagerX.current = nativeEvent.contentOffset.x
        const newIndex = Math.ceil(viewPagerX.current / contentWidth)

        if (newIndex != index) {
            setIndex(newIndex)
        }
    }

    const onNextPress = () => {
        if (index === Object.keys(pages).length - 1) {

        } else {
            viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) + 1) * contentWidth, animated: true })
        }
    }

    const onPreviousPress = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) - 1) * contentWidth, animated: true })
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack, alignItems: 'center', justifyContent: 'center', padding: SPACING.medium, }}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={{ flex: 1, width: normalize(800), maxWidth: '100%',  backgroundColor: COLORS.grey, borderRadius: 20 }}
                contentContainerStyle={{ padding: SPACING.x_large, flexGrow: 1 }}
                onContentSizeChange={(contentWidth) => setContentWidth(contentWidth)}
            >
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', marginBottom: SPACING.medium }}>Lady Sign up</Text>
                <View style={{ marginBottom: SPACING.small }}>
                    <ProgressBar progress={(index + 1) / Object.keys(pages).length} color={COLORS.error} />
                </View>

                <FlatList
                    ref={viewPagerRef}
                    onScroll={handleScroll}
                    style={{ flex: 1 }}
                    data={Object.keys(pages)}
                    renderItem={renderPage}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    pagingEnabled
                    disableIntervalMomentum
                    initialScrollIndex={0}
                    scrollEnabled={false}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {index === 0 ? <View/> : <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                        style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0 }}
                        buttonColor={COLORS.grey}
                        rippleColor="rgba(76,76,76,.3)"
                        mode="outlined"
                        onPress={onPreviousPress}
                    >
                        Back
                    </Button>}

                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                        style={{ flexShrink: 1, borderRadius: 10 }}
                        buttonColor={COLORS.red}
                        rippleColor="rgba(220, 46, 46, .16)"
                        mode="contained"
                        onPress={onNextPress}
                    >
                        {index === Object.keys(pages).length - 1 ? 'Sign up' : 'Next'}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default LadySignup