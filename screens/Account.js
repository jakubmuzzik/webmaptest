import React, { useState, useRef, useLayoutEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS } from '../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize } from '../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

//const Tab = createMaterialTopTabNavigator()

import AccountSettings from './account/AccountSettings'
import EditLady from './account/EditLady'

const Account = ({ navigation, route }) => {
    const [index, setIndex] = useState(0)
    const [routes, setRoutes] = useState([
        { key: 'account', title: 'Account', height: '100%' },
        { key: 'edit_lady', title: 'Edit Lady', height: '100%' }
    ].map((route, index) => ({ ...route, index })))//.filter(route => route.key !== 'ladies'))

    const setTabHeight = (height, index) => {
        setRoutes(r => {
            r[index].height = height
            return [...r]
        })
    }

    const onEditLadyPress = (ladyId) => {
        setIndex(1)
    }

    const onGoBackPress = () => {
        setIndex(0)
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
                        <AccountSettings setTabHeightFromParent={(height) => setTabHeight(height, route.index)} onEditLadyPress={onEditLadyPress} />
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