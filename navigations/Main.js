import React from 'react'
import { useWindowDimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Home from '../screens/Home'
import Massages from '../screens/Massages'
import Girls from '../screens/Girls'

const Drawer = createDrawerNavigator()

const Main = () => {
    const { width } = useWindowDimensions()
    const isLargeScreen = width >= 768

    return (
        <Drawer.Navigator 
            screenOptions={{
                drawerType:isLargeScreen ? 'permanent' : 'front',
                drawerStyle: isLargeScreen ? { width: '15%' } : { width: '100%' },
            }}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Girls" component={Girls} />
            <Drawer.Screen name="Massages" component={Massages} />
        </Drawer.Navigator>
    )
}

export default Main