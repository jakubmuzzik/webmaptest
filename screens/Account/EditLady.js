import React, { useState, useMemo, useLayoutEffect, memo } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS, SUPPORTED_LANGUAGES } from '../../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize, getParam } from '../../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useSearchParams } from 'react-router-dom'

import PersonalDetails from './PersonalDetails'
import Photos from './Photos'
import Videos from './Videos'
import Settings from './Settings'
import Ladies from './Ladies'

const EditLady = ({  }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])


    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'profileInformation', title: 'Profile information' },
        { key: 'photos', title: 'Photos' },
        { key: 'videos', title: 'Videos' },
    ].map((route, index) => ({ ...route, index })))

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
            return <View />
        }

        switch (route.key) {
            case 'profileInformation':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <PersonalDetails />
                    </View>
                )
            case 'photos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <Photos />
                    </View>
                )
            case 'videos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <Videos />
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

    return (
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
    )
}

export default memo(EditLady)