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
import { ACTIVE, MASSAGE_SERVICES } from '../labels'
import RenderLady from '../components/list/RenderLady'
import { normalize, getParam } from '../utils'
import { MOCK_DATA } from '../constants'
import { useSearchParams } from 'react-router-dom'
import { getCountFromServer, db, collection, query, where, startAt, limit, orderBy, getDocs, getDoc, startAfter } from '../firebase/config'
import { updateMasseusesCount, updateMasseusesData } from '../redux/actions'
import { MotiView, MotiText } from 'moti'
import { connect } from 'react-redux'
import SwappableText from '../components/animated/SwappableText'

const Mas = ({ updateMasseusesCount, updateMasseusesData, masseusesCount, masseusesData, ladyCities=[] }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), ''),
        city: getParam(ladyCities, searchParams.get('city'), ''),
        page: searchParams.get('page') && !isNaN(searchParams.get('page')) ? searchParams.get('page') : 1
    }), [searchParams, ladyCities])

    const [contentWidth, setContentWidth] = useState(document.body.clientWidth - (SPACING.page_horizontal - SPACING.large) * 2)
    const [isLoading, setIsLoading] = useState(true)

    const numberOfPages = Math.ceil(masseusesCount / MAX_ITEMS_PER_PAGE)

    useEffect(() => {
        if (!masseusesCount) {
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
        if (Number(params.page) === 1) {
            loadDataForFirstPage()
            return
        }

        //previous page has data and is the last one
        if (masseusesData[Number(params.page) - 1] && masseusesData[Number(params.page) - 1].length < MAX_ITEMS_PER_PAGE) {
            updateMasseusesData([], params.page)
            return
        }

        try {
            let lastVisibleSnapshot

            if (masseusesData[Number(params.page) - 1]) {
                const lastVisibleId = masseusesData[Number(params.page) - 1][MAX_ITEMS_PER_PAGE - 1].id
                lastVisibleSnapshot = await getDoc(doc(db, 'users', lastVisibleId))
            } else {
                const offset = (Number(params.page) - 1) * MAX_ITEMS_PER_PAGE
    
                //query all data from the beginning till the last one
                const q = query(
                    collection(db, "users"), 
                    where('accountType', '==', 'lady'), 
                    where('status', '==', ACTIVE),
                    where('services', 'array-contains-any', MASSAGE_SERVICES),
                    orderBy("createdDate"),
                    limit(offset)
                )
    
                const offsetSnapshot = await getDocs(q)
                //requested page number from url might exceeds data size
                if (offsetSnapshot.empty || offsetSnapshot.size !== offset) {
                    updateMasseusesData([], params.page)
                    return
                }
    
                lastVisibleSnapshot = offsetSnapshot.docs[offsetSnapshot.docs.length-1]
            }

            const snapshot = await getDocs(
                query(
                    collection(db, "users"), 
                    where('accountType', '==', 'lady'), 
                    where('status', '==', ACTIVE),
                    where('services', 'array-contains-any', MASSAGE_SERVICES),
                    orderBy("createdDate"),
                    startAfter(lastVisibleSnapshot),
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

    const loadDataForFirstPage = async () => {
        try {
            const snapshot = await getDocs(
                query(
                    collection(db, "users"), 
                    where('accountType', '==', 'lady'), 
                    where('status', '==', ACTIVE),
                    where('services', 'array-contains-any', MASSAGE_SERVICES),
                    orderBy("createdDate"),
                    startAt(0),
                    limit(MAX_ITEMS_PER_PAGE)
                )
            )
            
            if (snapshot.empty) {
                updateMasseusesData([], 1)
            } else {
                const data = snapshot.docs.map(doc => {                    
                    return ({
                        ...doc.data(),
                        id: doc.id
                    })
                })
    
                updateMasseusesData(data, 1)
            }
        } catch(error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        } 
    }

    const getMasseusesCount = async () => {
        try {
            const snapshot = await getCountFromServer(
                query(
                    collection(db, "users"), 
                    where('accountType', '==', 'lady'), 
                    where('status', '==', ACTIVE),
                    where('services', 'array-contains-any', MASSAGE_SERVICES)
                )
            )
            
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
            <View
                key={data.id}
                style={[styles.cardContainer, { width: cardWidth }]}
            >
                <RenderLady lady={data} width={cardWidth} delay={index * 20}/>
            </View>
        )
    }

    const renderSkeleton = () => {
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

    const animatedHeaderText = () => {
        return (
            <>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', textAlign: 'center' }}>
                    Massages
                </Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                    <SwappableText value={params.city ? params.city : ladyCities.length === 0 ? '' : 'Anywhere'} style={{ color: COLORS.greyText, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium, textAlign: 'center' }} />

                    {!isNaN(masseusesCount) && (
                        <MotiText
                            from={{
                                opacity: 0,
                                transform: [{ rotateX: '90deg' }],
                            }}
                            animate={{
                                opacity: 1,
                                transform: [{ rotateX: '0deg' }],
                            }}
                            style={{ color: COLORS.red, fontSize: FONT_SIZES.large, fontFamily: FONTS.medium, textAlign: 'center' }}
                        >
                            &nbsp;•&nbsp;<Text style={{ color: COLORS.greyText }}>{masseusesCount} {masseusesCount === 1 ? 'Masseuse' : 'Masseuses'}</Text>
                        </MotiText>
                    )}
                </View>
            </>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack, marginHorizontal: SPACING.page_horizontal - SPACING.large, paddingTop: SPACING.large }} 
            onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
           <View style={{ marginLeft: SPACING.large }}>
                {animatedHeaderText()}

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.large }}>
                    {isLoading && renderSkeleton()}
                    {!isLoading && masseusesData[params.page]?.map((data, index) => renderCard(data, index))}
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    masseusesCount: store.appState.masseusesCount,
    masseusesData: store.appState.masseusesData,
    ladyCities: store.appState.ladyCities,
})

export default connect(mapStateToProps, { updateMasseusesCount, updateMasseusesData })(Mas)

const styles = StyleSheet.create({
    cardContainer: {
        marginRight: SPACING.large,
        marginBottom: SPACING.large,
        //flexShrink: 1
    },
})