import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS } from '../constants'
import { ActivityIndicator } from 'react-native-paper'
import { normalize } from '../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

//const Tab = createMaterialTopTabNavigator()

import PersonalDetails from './account/PersonalDetails'
import Photos from './account/Photos'
import Settings from './Account/Settings'

const Account = ({ navigation, route }) => {
    const [loginVisible, setLoginVisible] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(false)
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'profileInformation', title: 'Profile information' },
        { key: 'photosAndVideos', title: 'Photos & Videos' },
        { key: 'settings', title: 'Settings' },
    ])

    const onLoginPress = () => {
        setSignUpVisible(false)
        setLoginVisible(true)
    }

    const onSignUpPress = () => {
        setLoginVisible(false)
        setSignUpVisible(true)
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
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <PersonalDetails />
                    </View>
                )
            case 'photosAndVideos':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <Photos />
                    </View>
                )
            case 'settings':
                return (
                    <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center' }}>
                        <Settings />
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
            //onTabPress={(props) => setIndex(routes.indexOf(props.route))}
        />
    )

    return (
        <View style={{ marginTop: normalize(70), backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', marginBottom: SPACING.large, marginTop: SPACING.medium, paddingHorizontal: SPACING.medium }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF' }}>
                    Account
                </Text>
            </View>

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
                    paddingHorizontal: SPACING.medium
                }}
                initialLayout={{ width: Dimensions.get('window').width }}
                lazy={({ route }) => route.key === 'photosAndVideos'}
                renderLazyPlaceholder={renderLazyPlaceholder}       
            />
        </View>
    )
}

export default Account