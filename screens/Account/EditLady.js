import React, { useState, useMemo, useLayoutEffect, memo, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS, SUPPORTED_LANGUAGES } from '../../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize, getParam, stripEmptyParams } from '../../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import ContentLoader, { Rect } from "react-content-loader/native"
import { MotiView } from 'moti'
import { connect } from 'react-redux'
import { fetchLadies, showToast } from '../../redux/actions'

import { Ionicons } from '@expo/vector-icons'

import PersonalDetails from './PersonalDetails'
import Photos from './Photos'
import Videos from './Videos'

import { getDoc, doc, db } from '../../firebase/config'

const EditLady = ({ offsetX = 0, ladies, fetchLadies, showToast }) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const { id } = useParams()

    const [index, setIndex] = useState(0)
    const [routes, setRoutes] = useState([
        { key: 'profileInformation', title: 'Profile information', height: '100%'  },
        { key: 'photos', title: 'Photos', height: '100%'  },
        { key: 'videos', title: 'Videos', height: '100%'  },
    ].map((route, index) => ({ ...route, index })))
    const [ladyData, setLadyData] = useState(null)

    useEffect(() => {
        if (!ladies) {
            fetchLadies()
        } else {
            const foundLadyInRedux = ladies.find(lady => lady.id === id)
            if (foundLadyInRedux) {
                setLadyData(foundLadyInRedux)
            } else {
                navigate({
                    pathname: '/account/ladies',
                    search: new URLSearchParams(stripEmptyParams(params)).toString()
                },{ replace: true })
                
                showToast({
                    type: 'error',
                    text: 'Selected Lady could not be found.'
                })
            }
        }
    }, [ladies])

    const setTabHeight = (height, index) => {
        setRoutes(r => {
            r[index].height = height
            return [...r]
        })
    }

    //todo - this is used only for photos tab - implement skeleton loading
    const renderLazyPlaceholder = () => (
        <View style={{ alignSelf: 'center', marginTop: SPACING.xx_large }}>
            <ActivityIndicator animating color={COLORS.red} size={30} />
        </View>
    )

    const onTabPress = ({ route, preventDefault }) => {
        preventDefault()
        
        setIndex(routes.indexOf(route))
    }

    const renderScene = ({ route }) => {
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            //return <View />
        }

        switch (route.key) {
            case 'profileInformation':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[index].height, alignSelf: 'center' }}>
                        <PersonalDetails userData={ladyData} setTabHeight={(height) => setTabHeight(height, route.index)} />
                    </View>
                )
            case 'photos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[index].height, alignSelf: 'center' }}>
                        <Photos setTabHeight={(height) => setTabHeight(height, route.index)} index={route.index} offsetX={offsetX} />
                    </View>
                )
            case 'videos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[index].height, alignSelf: 'center' }}>
                        <Videos setTabHeight={(height) => setTabHeight(height, route.index)} index={route.index} offsetX={offsetX}/>
                    </View>
                )
            default:
                return null
        }
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'red', left: SPACING.medium }}
            style={{ backgroundColor: 'transparent', width: normalize(800), maxWidth: '100%', alignSelf: 'center', paddingHorizontal: SPACING.medium }}
            tabStyle={{ width: 'auto' }}
            scrollEnabled={true}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: focused ? '#FFF' : 'rgba(255,255,255,0.7)' }}>
                    {route.title}
                </Text>
            )}
            onTabPress={onTabPress}
        />
    )

    const LadiesMessages = useCallback(() => {
        return (
            <MotiView
                from={{
                    opacity: 0,
                    transform: [{ translateY: -10 }],
                }}
                animate={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                }}
                style={{ marginHorizontal: SPACING.medium, paddingHorizontal: SPACING.small, paddingVertical: SPACING.x_small, borderRadius: 10, backgroundColor: COLORS.darkGrey, borderWidth: 1, borderColor: '#f08135', marginBottom: SPACING.medium }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="information-circle-outline" size={normalize(20)} color="#f08135" style={{ marginRight: SPACING.xx_small }} />

                    <View style={{ flexShrink: 1 }}>
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}>
                            Lady is in review
                        </Text>
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, marginTop: SPACING.xx_small }}>
                            All profiles go through a standard review before they become visible.
                        </Text>
                    </View>
                </View>
            </MotiView>
        )
    }, [params.language, ladyData])

    const SkeletonLoader = () => (
        <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', marginVertical: SPACING.x_large}}>
            <View style={{ marginHorizontal: SPACING.large, justifyContent: 'space-between', flexDirection: 'row' }}>
                <ContentLoader
                    speed={2}
                    height={35}
                    width={'21.25%'}
                    style={{ borderRadius: 5 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height={35} />
                </ContentLoader>
                <ContentLoader
                    speed={2}
                    height={35}
                    width={'21.25%'}
                    style={{ borderRadius: 5 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height={35} />
                </ContentLoader>
                <ContentLoader
                    speed={2}
                    height={35}
                    width={'21.25%'}
                    style={{ borderRadius: 5 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height={35} />
                </ContentLoader>
                <ContentLoader
                    speed={2}
                    height={35}
                    width={'21.25%'}
                    style={{ borderRadius: 5 }}
                    backgroundColor={COLORS.grey}
                    foregroundColor={COLORS.lightGrey}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="100%" height={35} />
                </ContentLoader>
            </View>

            <ContentLoader
                speed={2}
                height={200}
                style={{ marginHorizontal: SPACING.large, marginTop: SPACING.x_large, borderRadius: 20 }}
                backgroundColor={COLORS.grey}
                foregroundColor={COLORS.lightGrey}
            >
                <Rect x="0" y="0" rx="0" ry="0" width="100%" height={200} />
            </ContentLoader>

            <ContentLoader
                speed={2}
                height={200}
                style={{ marginHorizontal: SPACING.large, marginTop: SPACING.medium, borderRadius: 20 }}
                backgroundColor={COLORS.grey}
                foregroundColor={COLORS.lightGrey}
            >
                <Rect x="0" y="0" rx="0" ry="0" width="100%" height={200} />
            </ContentLoader>
        </View>
    )

    if (ladyData === null) {
        return <SkeletonLoader />
    }

    return (
        <>
            <LadiesMessages />

            <TabView
                renderTabBar={renderTabBar}
                swipeEnabled={false}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                sceneContainerStyle={{
                    width: normalize(800),
                    maxWidth: '100%',
                    alignSelf: 'center',
                    paddingHorizontal: SPACING.medium,
                }}
                initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                lazy={({ route }) => route.key !== 'settings'}
                renderLazyPlaceholder={renderLazyPlaceholder}
            />
        </>
    )
}

const mapStateToProps = (store) => ({
    ladies: store.userState.ladies
})

export default connect(mapStateToProps, { fetchLadies, showToast })(memo(EditLady))