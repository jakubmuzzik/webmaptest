import React, { useState } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS } from '../constants'
import { Button } from 'react-native-paper'
import { normalize } from '../utils'

import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

//const Tab = createMaterialTopTabNavigator()

import PersonalDetails from './account/PersonalDetails'
import Photos from './account/Photos'

const Account = ({ navigation, route }) => {
    const [loginVisible, setLoginVisible] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(false)
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'personalDetails', title: 'Personal Details' },
        { key: 'photos', title: 'Photos' },
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

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'personalDetails':
                return (
                    <View style={{ width: normalize(850), maxWidth: '100%', alignSelf: 'center' }}>
                        <PersonalDetails />
                    </View>
                )
            case 'photos':
                return (
                    <View style={{ width: normalize(850), maxWidth: '100%', alignSelf: 'center' }}>
                        <Photos />
                    </View>
                )
            case 'settings':
                return (
                    <View style={{ width: normalize(850), maxWidth: '100%', alignSelf: 'center' }}>
                        
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
            style={{ backgroundColor: 'transparent', width: normalize(850), maxWidth: '100%', alignSelf: 'center', paddingHorizontal: SPACING.medium }}
            tabStyle={{ width: 'auto' }}
            scrollEnabled={true}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: focused ? '#FFF' : 'rgba(255,255,255,0.7)' }}>
                    {route.title}
                </Text>
            )}
        />
    )

    return (
        <View style={{ marginTop: normalize(70), backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(850), maxWidth: '100%', alignSelf: 'center', marginBottom: SPACING.large, marginTop: SPACING.medium, paddingHorizontal: SPACING.medium }}>
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
                    width: normalize(850), maxWidth: '100%', alignSelf: 'center',
                    paddingHorizontal: SPACING.medium
                }}
                initialLayout={{ width: Dimensions.get('window').width }}
            />
        </View>
    )
}

export default Account