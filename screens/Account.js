import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
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
                return <PersonalDetails />
            case 'photos':
                return <Photos />
            default:
                return null
        }
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'red' }}
            style={{ backgroundColor: 'transparent', width: normalize(800), maxWidth: '100%' }}
            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }}
            tabStyle={{ width: 'auto' }}
            scrollEnabled={true}
        />
    )

    return (
        <View style={{ paddingTop: SPACING.large, paddingBottom: SPACING.medium, marginTop: normalize(70), paddingHorizontal: SPACING.medium, backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', marginBottom: SPACING.large }}>
                    Account
                </Text>

                <TabView
                    renderTabBar={renderTabBar}
                    swipeEnabled={false}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                />
            </View>
        </View>
    )
}

export default Account