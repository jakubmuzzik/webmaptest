import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import * as Font from 'expo-font'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Provider } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import initStore from './redux/store'
const store = initStore()

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import LadySignup from './screens/LadySignup'
import Home from './screens/Home'
import Main from './navigations/Main'
import NotFound from './screens/NotFound'
import Header from './components/navigation/Header'
import Explore from './screens/Explore'
import Pri from './screens/Pri'
import Esc from './screens/Esc'
import Clu from './screens/Clu'
import Mas from './screens/Mas'
import Profile from './screens/Profile'
import ProfilePhotosList from './screens/ProfilePhotosList'
import PhotoGallery from './screens/PhotoGallery'

import { COLORS } from './constants'

import { enableLegacyWebImplementation } from 'react-native-gesture-handler'
//enableLegacyWebImplementation(true)

const linking = {
  prefixes: ['https://jakubmuzzik.github.io/webmaptest'],
  config: {
    screens: {
      LadySignup: "lady-signup",
      //Main: "home",
      //Feed: "feed/:sort?/:type", -> “/feed/notifications?sort=latest” OR “/feed/latest/notifications”
      /*Main: {
        path: "",
        screens: {
          //Explore: ":category?"
          Explore: ''
        },
      },*/
      Home: "",
      Esc: "/esc/:city?/:minAge?/:maxAge?/:minHeight?/:maxHeight?/:minWeight?/:maxWeight?/:onlyVerified?/:onlyIndependent?/:onlyPremium?/:services?/:outcall?/:incall?/:bodyType?/:hairColor?/:eyeColor?/:pubicHair?/:breastSize?/:breastType?/:language?/:nationality?/:sexualOrientation?",
      Pri: "/pri/:city?",
      Mas: "/mas/:city?",
      Clu: "/clu/:city?",
      Profile: "/profile/:id",
      Explore: "/explore/:city?",
      Photos: {
        path: "/photos/:id/:photos?",
        parse: {
          photos: (photos) => '',
        },
        stringify: {
          photos: (photos) => '',
        },
      },
      Gallery: {
        path: "/gallery/:id/:photos?/:index?",
        parse: {
          photos: (photos) => '',
          index: (index) => '',
        },
        stringify: {
          photos: (photos) => '',
          index: (index) => '',
        },
      },
      NotFound: "*",
    }
  },
};

export default function App() {

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      await Promise.all([
        Font.loadAsync({
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf')
        })
      ])
    } catch (e) {
      // handle errors
      console.log('error during init', e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightBlack }}>

      </View>
    )
  }

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{
          header: ({ navigation, route }) => <Header language='en' navigation={navigation} route={route} />,
          animationEnabled: true,
          cardStyle: { flex: 1 }
        }}>
          <Stack.Screen name="lady-signup" component={LadySignup} initialParams={{}} />
          <Stack.Screen name="Home" component={Home} initialParams={{}} />
          <Stack.Screen name="Esc" component={Esc} initialParams={{}} />
          <Stack.Screen name="Pri" component={Pri} initialParams={{}} />
          <Stack.Screen name="Mas" component={Mas} initialParams={{}} />
          <Stack.Screen name="Clu" component={Clu} initialParams={{}} />
          <Stack.Screen name="Profile" component={Profile} initialParams={{}} />
          <Stack.Screen name="Explore" component={Explore} initialParams={{}} />
          <Stack.Screen
            name="Photos"
            component={ProfilePhotosList}
            initialParams={{}}
            options={{
              headerShown: false,
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress,
                },
              }),
            }}
          />

          {/* <Stack.Screen
              name="Explore"
              component={Explore} initialParams={{}} />
            <Stack.Screen name="Main" component={Main}
              options={{
                headerShown: false
              }} /> */}
          <Stack.Screen name="NotFound" component={Esc} initialParams={{}} />

          <Stack.Group
            screenOptions={{
              presentation: 'modal'
            }}
          >
            <Stack.Screen name="Gallery" component={PhotoGallery} initialParams={{}} options={{

              gestureEnabled: false,
              headerShown: false
            }} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}