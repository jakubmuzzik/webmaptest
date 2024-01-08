import React, { useState, useMemo, useLayoutEffect, useRef } from 'react'
import { View, Text, useWindowDimensions, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS, SUPPORTED_LANGUAGES } from '../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize, stripEmptyParams, getParam } from '../utils'
import { MotiText, AnimatePresence } from 'moti'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import LadySignup from './LadySignup'

//const Tab = createMaterialTopTabNavigator()

import AccountSettings from './account/AccountSettings'
import EditLady from './account/EditLady'

const { height: initialHeight } = Dimensions.get('window')

const Account = ({ navigation, route }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const { width: windowWidth } = useWindowDimensions()

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'account', title: 'Account' },
        { key: 'edit_lady', title: 'Edit Lady' },
        { key: 'add_lady', title: 'Add Lady' },
    ].map((route, index) => ({ ...route, index })))//.filter(route => route.key !== 'ladies'))

    const location = useLocation()
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (location.pathname.includes('edit-lady')) {
            setIndex(1)
        } else if (location.pathname.includes('add-lady')) {
            setIndex(2)
        } else {
            setIndex(0)
        }
    }, [location])

    const onGoBackPress = () => {
        if (location.key === 'default') {
            navigate({
                pathname: '/account/ladies',
                search: new URLSearchParams(stripEmptyParams(params)).toString()
            })
        } else {
            navigate(-1)
        }
    }

    //todo - this is used only for photos tab - implement skeleton loading
    const renderLazyPlaceholder = () => (
        <View style={{ alignSelf: 'center', marginTop: SPACING.xx_large }}>
            <ActivityIndicator animating color={COLORS.red} size={30} />
        </View>
    )

    const renderPagesScene = ({ route }) => {
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            return <View />
        }

        switch (route.key) {
            case 'account':
                return (
                    <View style={{ marginTop: SPACING.large }}>
                        <AccountSettings />
                    </View>
                )
            case 'edit_lady':
                return (
                    <View style={{ marginTop: SPACING.large }}>
                        <EditLady />
                    </View>
                )
            case 'add_lady':
                return (
                    <View style={{ paddingTop: SPACING.small, backgroundColor: COLORS.lightBlack, flex: 1 }}>
                        <LadySignup showHeaderText={false} offsetX={windowWidth * route.index} />
                    </View>
                )
            default:
                return null
        }
    }

    return (
        <View style={{ backgroundColor: COLORS.lightBlack, height: routes[index].key === 'add_lady' ? initialHeight - normalize(70) :  '100%' }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', marginTop: SPACING.small, paddingHorizontal: SPACING.medium }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text onPress={index !== 0 ? onGoBackPress : undefined} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, color: '#FFF', textDecorationLine: index !== 0 ? 'underline' : 'none' }}>Account</Text>
                    <AnimatePresence>
                    { index !== 0 &&
                   
                        <MotiText 
                            style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, color: '#FFF' }}
                            from={{
                                opacity: 0,
                                transform: [{ translatex: 100 }],
                            }}
                            animate={{
                                opacity: 1,
                                transform: [{ translatex: 0 }],
                            }}
                            exit={{
                                opacity: 0,
                                transform: [{ translatex: 100 }],
                            }}
                            transition={{
                                type: 'timing'
                            }}
                        >
                            {` > ${routes[index].title}`}
                        </MotiText>
                    }
                    </AnimatePresence>
                </View>
            </View>

            <TabView
                renderTabBar={props => null}
                swipeEnabled={false}
                navigationState={{ index, routes }}
                renderScene={renderPagesScene}
                onIndexChange={setIndex}
                //lazy
                //renderLazyPlaceholder={renderLazyPlaceholder}
                initialLayout={{ width: Dimensions.get('window').width }}
            />
        </View>
    )
}

export default Account