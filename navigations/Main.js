import React from 'react'
import { useRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Explore from '../screens/Explore'

const Stack = createStackNavigator()

const Main = ({ route }) => {
    const dynamicRoute = useRoute()
    console.log(dynamicRoute.name)
    console.log(route.params)

    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    name="Explore"
                    component={Explore} initialParams={{}} />
            </Stack.Navigator>
        </>
    )
}

export default Main