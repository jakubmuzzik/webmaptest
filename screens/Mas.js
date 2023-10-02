import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { 
    View, 
    Dimensions, 
    StyleSheet,
    ScrollView
} from 'react-native'
import ContentLoader, { Rect } from "react-content-loader/native"
import { COLORS, SMALL_SCREEN_THRESHOLD, SPACING } from '../constants'
import RenderClient from '../components/list/RenderClient'

const {
    width: INITIAL_SCREEN_WIDTH
} = Dimensions.get('window')

import { MOCK_DATA } from '../constants'

const Mas = ({ navigation, route }) => {
    const [contentWidth, setContentWidth] = useState(INITIAL_SCREEN_WIDTH)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    const cardWidth = useMemo(() => {
        const isXSmallScreen = contentWidth < 350
        const isSmallScreen = contentWidth >= 350 && contentWidth < SMALL_SCREEN_THRESHOLD
        const isMediumScreen = contentWidth >= SMALL_SCREEN_THRESHOLD && contentWidth < 960
        const isLargeScreen = contentWidth >= 960 && contentWidth < 1300

        return isXSmallScreen ? (contentWidth) - (SPACING.large + SPACING.large)
            : isSmallScreen ? (contentWidth / 2) - (SPACING.large + SPACING.large / 2)
            : isMediumScreen ? (contentWidth / 3) - (SPACING.large + SPACING.large / 3)
            : isLargeScreen ? (contentWidth / 4) - (SPACING.large + SPACING.large / 4) : (contentWidth / 5) - (SPACING.large + SPACING.large / 5) 
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
                    width='100%'
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
            contentContainerStyle={{ paddingTop: SPACING.large }}
            onContentSizeChange={(contentWidth) => setContentWidth(contentWidth)}
        >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.large }}>
                {isLoading ? loadingCards : MOCK_DATA.map(data => renderCard(data))}
            </View>
        </ScrollView>
    )
}

export default Mas

const styles = StyleSheet.create({
    cardContainer: {
        marginRight: SPACING.large,
        marginBottom: SPACING.large,
        //flexShrink: 1
    },
})