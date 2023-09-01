import { NavigationContainer } from '@react-navigation/native'

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import Register from './screens/Register'
import Main from './navigations/Main'
import NotFound from './screens/NotFound'

const linking = {
  config: {
    screens: {
      Register: "register",
      //Main: "home",
      //Feed: "feed/:sort?/:type",
      Main: {
        path: "",
        screens: {
          Home: "home",
          Girls: "girls",
          Massages: "massages",
        },
      },
      NotFound: "*",
    }
  },
};

export default function App() {
  return (
    <>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Register"
            component={Register}
            options={{
              headerShown: false
            }} />
          <Stack.Screen name="Main" component={Main}
            options={{
              headerShown: false
            }} />
          <Stack.Screen name="NotFound" component={NotFound}
            options={{
              headerShown: false
            }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}
