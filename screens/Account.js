import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { FONTS, FONT_SIZES, SPACING, COLORS } from '../constants'
import { Button } from 'react-native-paper'
import { normalize } from '../utils'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import SignUpOrLogin from './SignUpOrLogin'

const Tab = createMaterialTopTabNavigator()

import PersonalDetails from './account/PersonalDetails'
import Photos from './account/Photos'

const Account = ({ navigation, route }) => {
    const [loginVisible, setLoginVisible] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(false)

    const onLoginPress = () => {
        setSignUpVisible(false)
        setLoginVisible(true)
    }

    const onSignUpPress = () => {
        setLoginVisible(false)
        setSignUpVisible(true)
    }

    if (false) {
        return <SignUpOrLogin navigation={navigation} route={route} />
    }

    return (
        <View style={{ paddingTop: SPACING.large, paddingBottom: SPACING.medium, marginTop: normalize(70), paddingHorizontal: SPACING.medium }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: '#FFF', marginBottom: SPACING.large }}>
                    Account
                </Text>

                <Tab.Navigator
                    screenOptions={{
                        tabBarLabelStyle: { fontFamily: FONTS.medium, fontSize: FONTS.medium },
                        tabBarItemStyle: { width: 'auto' },
                        tabBarStyle: { backgroundColor: 'transparent', width: normalize(800), maxWidth: '100%', },
                        tabBarIndicatorStyle: { backgroundColor: COLORS.red },
                        tabBarScrollEnabled: true
                    }}
                    style={{ }}
                >
                    <Tab.Screen
                        name="PersonalDetails"
                        component={PersonalDetails}
                        initialParams={{}}
                        options={{
                            title: 'Personal Details',
                            tabBarLabel: ({ focused, color }) => <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: focused ? '#FFF' : COLORS.placeholder }}>Personal Details</Text>
                        }}
                    />
                    <Tab.Screen
                        name="Photos"
                        component={Photos}
                        initialParams={{}}
                        options={{
                            title: 'Photos',
                            tabBarLabel: ({ focused, color }) => <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: focused ? '#FFF' : COLORS.placeholder }}>Photos</Text>
                        }}
                    />
                </Tab.Navigator>
            </View>
        </View>
    )
}

export default Account