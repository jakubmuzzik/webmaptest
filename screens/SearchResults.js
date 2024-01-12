import React, { useMemo, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES } from '../constants'
import { useSearchParams } from 'react-router-dom'
import { getParam } from '../utils'
import { MOCK_DATA } from '../constants'
import ContentLoader, { Rect } from "react-content-loader/native"
import RenderLady from '../components/list/RenderLady'

const SearchResults = () => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), ''),
        query: decodeURIComponent(searchParams.get('q'))
    }), [searchParams])

    const [isLoading, setIsLoading] = useState(true)
    const [contentWidth, setContentWidth] = useState(document.body.clientWidth - (SPACING.page_horizontal - SPACING.large) * 2)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    const cardWidth = useMemo(() => {
        const isXSmallScreen = contentWidth < 300
        const isSmallScreen = contentWidth >= 300 && contentWidth < 550
        const isMediumScreen = contentWidth >= 550 && contentWidth < 750
        const isXMediumScreen = contentWidth >= 750 && contentWidth < 960
        const isLargeScreen = contentWidth >= 960 && contentWidth < 1300

        return isXSmallScreen ? (contentWidth) - (SPACING.large + SPACING.large)
            : isSmallScreen ? (contentWidth / 2) - (SPACING.large + SPACING.large / 2)
            : isMediumScreen ? (contentWidth / 3) - (SPACING.large + SPACING.large / 3)
            : isXMediumScreen ? (contentWidth / 4) - (SPACING.large + SPACING.large / 4)
            : isLargeScreen ? (contentWidth / 5) - (SPACING.large + SPACING.large / 5) : (contentWidth / 6) - (SPACING.large + SPACING.large / 6) 
    }, [contentWidth])

    const renderCard = (data) => {
        return (
            <View key={data.id} style={{ marginRight: SPACING.large, marginBottom: SPACING.large, overflow: 'hidden', width: cardWidth }}>
                <RenderLady client={data} width={cardWidth} />
            </View>
        )
    }

    const skeletonLoader = () => (
        <>
            <ContentLoader
                speed={2}
                width={cardWidth * 2}
                height={FONT_SIZES.h1}
                style={{ marginHorizontal: SPACING.large }}
                backgroundColor={COLORS.grey}
                foregroundColor={COLORS.lightGrey}
            >
                <Rect x="0" y="0" rx="0" ry="0" width="100%" height={FONT_SIZES.h1} />
            </ContentLoader>

            <ContentLoader
                speed={2}
                width={cardWidth * 2}
                height={FONT_SIZES.h3}
                style={{ marginHorizontal: SPACING.large, marginTop: SPACING.large }}
                backgroundColor={COLORS.grey}
                foregroundColor={COLORS.lightGrey}
            >
               <Rect x="0" y="0" rx="0" ry="0" width="40%" height={FONT_SIZES.h3} />
            </ContentLoader>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.large, marginTop: SPACING.medium }}>
                {MOCK_DATA.map((_, index) => (
                    <View key={index} style={{ marginRight: SPACING.large, marginBottom: SPACING.large, overflow: 'hidden', width: cardWidth }}>
                        <ContentLoader
                            speed={2}
                            width={cardWidth}
                            style={{ aspectRatio: 3 / 4, borderRadius: 10 }}
                            backgroundColor={COLORS.grey}
                            foregroundColor={COLORS.lightGrey}
                        >
                            <Rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
                        </ContentLoader>
                    </View>
                ))}
            </View>
        </>
    )
    
    return (
        <View onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)} style={{ backgroundColor: COLORS.lightBlack, flex: 1, marginHorizontal: SPACING.page_horizontal - SPACING.large, paddingTop: SPACING.large }}>
            {
                isLoading ? skeletonLoader() : (
                    <>
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginHorizontal: SPACING.large, color: '#FFF' }}>
                            Search results for {params.query}
                        </Text>

                        <View style={{ marginTop: SPACING.large }}>
                            <Text style={{ fontSize: FONT_SIZES.h3, color: '#FFF', fontFamily: FONTS.bold, marginHorizontal: SPACING.large, }}>
                                Ladies
                            </Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.large, marginTop: SPACING.medium }}>
                                {MOCK_DATA.map(data => renderCard(data))}
                            </View>
                        </View>
                    </>
                )
            }

        </View>
    )
}

export default SearchResults