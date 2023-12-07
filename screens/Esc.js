import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { 
    View, 
    Dimensions, 
    StyleSheet,
    ScrollView,
    Text
} from 'react-native'
import ContentLoader, { Rect } from "react-content-loader/native"
import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING, SUPPORTED_LANGUAGES } from '../constants'
import { CZECH_CITIES } from '../labels'
import RenderClient from '../components/list/RenderClient'

const {
    width: INITIAL_SCREEN_WIDTH
} = Dimensions.get('window')

import { MOCK_DATA } from '../constants'
import { normalize } from '../utils'

const Esc = ({ navigation, route }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
        city: CZECH_CITIES.includes(decodeURIComponent(route.params.city)) ? decodeURIComponent(route.params.city) : ''
    }), [route.params])

    const [contentWidth, setContentWidth] = useState(INITIAL_SCREEN_WIDTH)
    const [isLoading, setIsLoading] = useState(true)

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
     
    const renderCard = useCallback((data) => {
        return (
            <View key={data.id} style={[styles.cardContainer, { width: cardWidth }]}>
                <RenderClient client={data} width={cardWidth} />
            </View>
        )
    }, [cardWidth])

    const loadingCards = useMemo(() => {
        return Array(20).fill({}).map((_, index) => (
            <View key={index} style={[styles.cardContainer, { width: cardWidth }]}>
                <ContentLoader
                    speed={2}
                    width={cardWidth}
                    //width='100%'
                    style={{ aspectRatio: 3/4, borderRadius: 20 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
                </ContentLoader>
            </View>
        ))
    }, [cardWidth])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.lightBlack, paddingHorizontal: SPACING.page_horizontal - SPACING.large }} 
            contentContainerStyle={{ paddingTop: SPACING.large + normalize(70) + normalize(70) }}
            onContentSizeChange={(contentWidth) => setContentWidth(contentWidth)}
            //onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
            <View style={{ marginLeft: SPACING.large }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, color: '#FFF' }}>
                    {params.city ? 'Esc ' + params.city : 'All esc'} • Discover 212 ...
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.large }}>
                    {isLoading ? loadingCards : MOCK_DATA.map(data => renderCard(data))}
                </View>
            </View>
        </ScrollView>
    )
}

export default Esc

const styles = StyleSheet.create({
    cardContainer: {
        marginRight: SPACING.large,
        marginBottom: SPACING.large,
        overflow: 'hidden'
        //flexShrink: 1
    },
})