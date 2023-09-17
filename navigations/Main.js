import React from 'react'
import { useWindowDimensions, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { SMALL_SCREEN_THRESHOLD } from '../constants'
import Explore from '../screens/Explore'

const Stack = createStackNavigator()

const Main = ({ route }) => {
    const { width } = useWindowDimensions()
    const isSmalScreen = width < SMALL_SCREEN_THRESHOLD
    const dynamicRoute = useRoute()
    console.log(dynamicRoute.name)
    console.log(route.params)

    const { language = 'en' } = route.params ?? {}

    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    name="Explore"
                    component={Explore} initialParams={{}} />
            </Stack.Navigator>
            {isSmalScreen && (
                <View style={{ height: 100, width: '100%', backgroundColor: 'grey' }}>

                </View>
            )}
        </>
    )
}

export default Main