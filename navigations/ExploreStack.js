import React from 'react'
import { useRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Categories from '../components/navigation/Categories'
import Esc from '../screens/Esc'
import Pri from '../screens/Pri'
import Mas from '../screens/Mas'
import Clu from '../screens/Clu'
import Header from '../components/navigation/Header'

const Stack = createStackNavigator()

const ExploreStack = ({ route, navigation }) => {
    const dynamicRoute = useRoute()
    //console.log(dynamicRoute.name)
    //console.log(route.params)

    return (
        <Stack.Navigator screenOptions={{
            headerTransparent: false,
            header: ({ navigation, route }) => <Categories navigation={navigation} route={route} />,
            animationEnabled: true
            //header: ({ navigation, route }) => <Header language='en' navigation={navigation} route={route} />,
          }}>
            <Stack.Screen 
                name="Esc" 
                component={Esc} 
                initialParams={{}} 
            />
            <Stack.Screen 
                name="Pri" 
                component={Pri} 
                initialParams={{}} 
            />
            <Stack.Screen 
                name="Mas" 
                component={Mas} 
                initialParams={{}} 
            />
            <Stack.Screen 
                name="Clu" 
                component={Clu} 
                initialParams={{}} 
            />
        </Stack.Navigator>
    )
}

export default ExploreStack