import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { 
    View, 
    Dimensions, 
    StyleSheet,
    ScrollView,
    Text
} from 'react-native'
import ContentLoader, { Rect } from "react-content-loader/native"
import { COLORS, FONTS, FONT_SIZES, MAX_ITEMS_PER_PAGE, SPACING, SUPPORTED_LANGUAGES } from '../constants'
import { CZECH_CITIES, ACTIVE } from '../labels'
import RenderLady from '../components/list/RenderLady'
import { normalize, getParam } from '../utils'
import { MOCK_DATA } from '../constants'
import { useSearchParams } from 'react-router-dom'
import { getCountFromServer, db, collection, query, where, startAt, limit, orderBy, getDocs } from '../firebase/config'

const Mas = () => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), ''),
        city: getParam(CZECH_CITIES, searchParams.get('city'), ''),
        page: searchParams.get('page') && !isNaN(searchParams.get('page')) ? searchParams.get('page') : 1
    }), [searchParams])

    const [contentWidth, setContentWidth] = useState(document.body.clientWidth - (SPACING.page_horizontal - SPACING.large) * 2)
    const [isLoading, setIsLoading] = useState(true)

    const [ladiesCount, setLadiesCount] = useState()
    const [data, setData] = useState({})

    const numberOfPages = Math.ceil(ladiesCount / MAX_ITEMS_PER_PAGE)

    useEffect(() => {
        getLadiesCount()
    }, [])

    useEffect(() => {
        setIsLoading(true)

        if (!data[params.page]) {
            loadDataForPage()
        } else {
            setIsLoading(false)
        }
    }, [params.page])

    const loadDataForPage = async () => {
        try {
            const snapshot = await getDocs(
                query(
                    collection(db, "users"), 
                    where('accountType', '==', 'lady'), 
                    where('status', '==', ACTIVE),
                    orderBy("createdDate"),
                    startAt((Number(params.page) - 1) * MAX_ITEMS_PER_PAGE),
                    limit(MAX_ITEMS_PER_PAGE)
                )
            )
            
            if (snapshot.empty) {
                setData(data => ({
                    ...data,
                    [params.page]: []
                }))
                return 
            } else {
                setData(data => ({
                    ...data,
                    [params.page]: snapshot.docs.map(doc => {
                        const data = doc.data()
                        return ({
                            ...data,
                            id: doc.id
                        })
                    })
                }))
            }
        } catch(error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        } 
    }

    const getLadiesCount = async () => {
        try {
            const snapshot = await getCountFromServer(query(collection(db, "users"), where('accountType', '==', 'lady'), where('status', '==', ACTIVE)))
            setLadiesCount(snapshot.data().count)
        } catch(e) {
            console.error(e)
        }
    }

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
            <View key={data.id} style={[styles.cardContainer, { width: cardWidth }]}>
                <RenderLady lady={data} width={cardWidth} />
            </View>
        )
    }

    const Skeleton = () => {
        return new Array(MAX_ITEMS_PER_PAGE).fill(null, 0).map((_, index) => (
            <View key={index} style={[styles.cardContainer, { width: cardWidth }]}>
                <ContentLoader
                    speed={2}
                    width={cardWidth}
                    style={{ aspectRatio: 3/4, borderRadius: 10 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
                </ContentLoader>
            </View>
        ))
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack, marginHorizontal: SPACING.page_horizontal - SPACING.large, paddingTop: SPACING.large }} 
            onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
           <View style={{ marginLeft: SPACING.large }}>
                {/* <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', textAlign: 'center' }}>
                    Massages
                </Text> */}
                {/* <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium, textAlign: 'center' }}>
                    Anywhere • 218 ladies
                </Text> */}

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.large }}>
                    {isLoading && <Skeleton />}
                    {!isLoading && data[params.page]?.map(data => renderCard(data))}
                </View>
            </View>
        </View>
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