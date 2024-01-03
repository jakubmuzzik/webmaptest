import React, { useState, useRef, useLayoutEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS } from '../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize } from '../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

//const Tab = createMaterialTopTabNavigator()

import PersonalDetails from './account/PersonalDetails'
import Photos from './account/Photos'
import Videos from './Account/Videos'
import Settings from './Account/Settings'
import Ladies from './account/Ladies'

const Account = ({ navigation, route }) => {
    const [loginVisible, setLoginVisible] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(false)
    const [index, setIndex] = useState(0)
    const [routes, setRoutes] = useState([
        { key: 'profileInformation', title: 'Profile information', height: '100%' },
        { key: 'ladies', title: 'Ladies', height: '100%' },
        { key: 'photos', title: 'Photos', height: '100%' },
        { key: 'videos', title: 'Videos', height: '100%' },
        { key: 'settings', title: 'Settings', height: '100%' },
    ].map((route, index) => ({...route, index})))//.filter(route => route.key !== 'ladies'))
    const [mockIndex, setMockIndex] = useState(0)
    
    const onLoginPress = () => {
        setSignUpVisible(false)
        setLoginVisible(true)
    }

    const onSignUpPress = () => {
        setLoginVisible(false)
        setSignUpVisible(true)
    }

    const setTabHeight = (height, index) => {
        setRoutes(r => {
            r[index].height = height
            return [...r]
        })
    }

    //todo - this is used only for photos tab - implement skeleton loading
    const renderLazyPlaceholder = () => (
        <View style={{ alignSelf: 'center', marginTop: SPACING.xx_large }}>
            <ActivityIndicator animating color={COLORS.red} size={30}/>
        </View>
    )

    const renderScene = ({ route }) => {
        if (Math.abs(index - routes.indexOf(route)) > 0) {
            //return <View />
        }

        switch (route.key) {
            case 'profileInformation':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[mockIndex].height, alignSelf: 'center' }}>
                        <PersonalDetails setTabHeight={(height) => setTabHeight(height, route.index)} />
                    </View>
                )
            case 'ladies':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[mockIndex].height, alignSelf: 'center' }}>
                        <Ladies setTabHeight={(height) => setTabHeight(height, route.index)} />
                    </View>
                )
            case 'photos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[mockIndex].height, alignSelf: 'center' }}>
                        <Photos setTabHeight={(height) => setTabHeight(height, route.index)}/>
                    </View>
                )
            case 'videos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[mockIndex].height, alignSelf: 'center' }}>
                        <Videos setTabHeight={(height) => setTabHeight(height, route.index)} />
                    </View>
                )
            case 'settings':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', height: routes[mockIndex].height, alignSelf: 'center' }}>
                        <Settings setTabHeight={(height) => setTabHeight(height, route.index)}/>
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
            onTabPress={(props) => setMockIndex(routes.indexOf(props.route))}
        />
    )

    return (
        <View style={{ marginTop: normalize(70), backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', marginBottom: SPACING.large, marginTop: SPACING.medium, paddingHorizontal: SPACING.medium }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, color: '#FFF' }}>
                    Account
                </Text>
            </View>

        <View style={{ flex: 1 }}>
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
                initialLayout={{ width: Dimensions.get('window').width }}
                lazy={({ route }) => route.key !== 'settings'}
                renderLazyPlaceholder={renderLazyPlaceholder}
            />
            </View>
        </View>
    )
}

export default Account