import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect } from 'react'
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
import { updateMasseusesCount, updateMasseusesData } from '../redux/actions'
import { MotiView, MotiText } from 'moti'
import { connect } from 'react-redux'

const Mas = ({ updateMasseusesCount, updateMasseusesData, masseusesCount, masseusesData }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), ''),
        city: getParam(CZECH_CITIES, searchParams.get('city'), ''),
        page: searchParams.get('page') && !isNaN(searchParams.get('page')) ? searchParams.get('page') : 1
    }), [searchParams])

    const [contentWidth, setContentWidth] = useState(document.body.clientWidth - (SPACING.page_horizontal - SPACING.large) * 2)
    const [isLoading, setIsLoading] = useState(true)

    const numberOfPages = Math.ceil(masseusesCount / MAX_ITEMS_PER_PAGE)

    useEffect(() => {
        if (!masseusesCount) {
            console.log('ladies count init')
            getMasseusesCount()
        }
    }, [masseusesCount])

    useLayoutEffect(() => {
        if (!masseusesData[params.page]) {
            setIsLoading(true)
            loadDataForPage()
        } else {
            setIsLoading(false)
        }
    }, [params.page])

    const loadMockDataForPage = () => {
        updateMasseusesData(new Array(MAX_ITEMS_PER_PAGE).fill({
            name: 'llll',
            dateOfBirth: '25071996',
            address: {city: 'Praha'},
            images: [{ downloadUrl: require('../assets/dummy_photo.png') }]
        }, 0), params.page)
        setIsLoading(false)
    }

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
                updateMasseusesData([], params.page)
            } else {
                const data = snapshot.docs.map(doc => {                    
                    return ({
                        ...doc.data(),
                        id: doc.id
                    })
                })

                updateMasseusesData(data, params.page)
            }
        } catch(error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        } 
    }

    const getMasseusesCount = async () => {
        //updateMasseusesCount(MAX_ITEMS_PER_PAGE * 10) 
        //return
        try {
            const snapshot = await getCountFromServer(query(collection(db, "users"), where('accountType', '==', 'lady'), where('status', '==', ACTIVE)))
            updateMasseusesCount(snapshot.data().count)
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

    const renderCard = (data, index) => {
        return (
            <MotiView
                from={{
                    opacity: 0,
                    transform: [{ translateY: 50 }],
                }}
                animate={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                }}
                transition={{
                    //type: 'timing',
                    //duration: 600,
                }}
                delay={index * 20}
                key={data.id}
                style={[styles.cardContainer, { width: cardWidth }]}
            >
                <RenderLady lady={data} width={cardWidth} />
            </MotiView>
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

    const AnimatedHeaderText = useCallback(() => {
        return (
            <>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', textAlign: 'center' }}>
                    Massages
                </Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium, textAlign: 'center' }}>
                        {params.city ? params.city : 'Anywhere'}
                    </Text>
                    {masseusesCount && (
                        <MotiText
                            from={{
                                opacity: 0,
                                transform: [{ rotateX: '90deg' }],
                            }}
                            animate={{
                                opacity: 1,
                                transform: [{ rotateX: '0deg' }],
                            }}
                            transition={{
                                //type: 'timing',
                                //duration: 600,
                            }}
                            style={{ color: COLORS.red, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium, textAlign: 'center' }}
                        >
                            &nbsp;•&nbsp;<Text style={{ color: COLORS.greyText }}>{masseusesCount} ladies</Text>
                        </MotiText>
                    )}
                </View>
            </>
        )
    }, [masseusesCount, params.city])

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack, marginHorizontal: SPACING.page_horizontal - SPACING.large, paddingTop: SPACING.large }} 
            onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
           <View style={{ marginLeft: SPACING.large }}>
                <AnimatedHeaderText />

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.large }}>
                    {isLoading && <Skeleton />}
                    {!isLoading && masseusesData[params.page]?.map((data, index) => renderCard(data, index))}
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    masseusesCount: store.appState.masseusesCount,
    masseusesData: store.appState.masseusesData
})

export default connect(mapStateToProps, { updateMasseusesCount, updateMasseusesData })(Mas)

const styles = StyleSheet.create({
    cardContainer: {
        marginRight: SPACING.large,
        marginBottom: SPACING.large,
        //flexShrink: 1
    },
})