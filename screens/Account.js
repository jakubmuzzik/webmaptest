import React, { useState, useMemo, useLayoutEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS, SUPPORTED_LANGUAGES } from '../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize, stripEmptyParams, getParam } from '../utils'
import { MotiText, AnimatePresence } from 'moti'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

//const Tab = createMaterialTopTabNavigator()

import AccountSettings from './account/AccountSettings'
import EditLady from './account/EditLady'

const Account = ({ navigation, route }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const [index, setIndex] = useState(0)
    const [routes, setRoutes] = useState([
        { key: 'account', title: 'Account', height: '100%'},
        { key: 'edit_lady', title: 'Edit Lady', height: '100%' }
    ].map((route, index) => ({ ...route, index })))//.filter(route => route.key !== 'ladies'))

    const location = useLocation()
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (location.pathname.includes('edit-lady')) {
            setIndex(1)
        } else {
            setIndex(0)
        }
    }, [location])

    const setTabHeight = (height, index) => {
        setRoutes(r => {
            r[index].height = height
            return [...r]
        })
    }

    const onGoBackPress = () => {
        navigate({
            pathname: '/account/ladies',
            search: new URLSearchParams(stripEmptyParams(params)).toString()
        })
    }

    //todo - this is used only for photos tab - implement skeleton loading
    const renderLazyPlaceholder = () => (
        <View style={{ alignSelf: 'center', marginTop: SPACING.xx_large }}>
            <ActivityIndicator animating color={COLORS.red} size={30} />
        </View>
    )


    const renderPagesScene = ({ route }) => {
        switch (route.key) {
            case 'account':
                return (
                    <View style={{ height: routes[index].height }}>
                        <AccountSettings setTabHeightFromParent={(height) => setTabHeight(height, route.index)} />
                    </View>
                )
            case 'edit_lady':
                return (
                    <View style={{ height: routes[index].height }}>
                        <EditLady setTabHeightFromParent={(height) => setTabHeight(height, route.index)} onGoBackPress={onGoBackPress} />
                    </View>
                )
            default:
                return null
        }
    }

    return (
        <View style={{ marginTop: normalize(70), backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', marginBottom: SPACING.large, marginTop: SPACING.medium, paddingHorizontal: SPACING.medium }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text onPress={index !== 0 ? onGoBackPress : undefined} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, color: '#FFF', textDecorationLine: index !== 0 ? 'underline' : 'none' }}>Account</Text>
                    <AnimatePresence>
                    { index === 1 &&
                   
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
                            {' > Edit Lady'}
                        </MotiText>
                    }
                    </AnimatePresence>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <TabView
                    renderTabBar={props => null}
                    swipeEnabled={false}
                    navigationState={{ index, routes }}
                    renderScene={renderPagesScene}
                    onIndexChange={setIndex}
                    lazy
                    renderLazyPlaceholder={renderLazyPlaceholder}
                    initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                />
            </View>
        </View>
    )
}

export default Account