import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect, useRef } from 'react'
import * as Font from 'expo-font'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Provider } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import initStore from './redux/store'
const store = initStore()

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import LadySignup from './screens/LadySignup'
import Home from './screens/Home'
import NotFound from './screens/NotFound'
import Header from './components/navigation/Header'
import Pri from './screens/Pri'
import Esc from './screens/Esc'
import Clu from './screens/Clu'
import Mas from './screens/Mas'
import Profile from './screens/Profile'
import ProfilePhotosList from './screens/ProfilePhotosList'
import PhotoGallery from './screens/PhotoGallery'
import Account from './screens/Account'
import Chat from './screens/Chat'
import Favourites from './screens/Favourites'

import { StackActions } from '@react-navigation/native'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING } from './constants'

import ExploreStack from './navigations/ExploreStack'

import { enableLegacyWebImplementation } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'
import { normalize } from './utils'

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

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
      //Home: 'home',
      Chat: 'chat',
      Favourites: 'favourites',
      //Esc: '',//":city?/:minAge?/:maxAge?/:minHeight?/:maxHeight?/:minWeight?/:maxWeight?/:onlyVerified?/:onlyIndependent?/:onlyPremium?/:services?/:outcall?/:incall?/:bodyType?/:hairColor?/:eyeColor?/:pubicHair?/:breastSize?/:breastType?/:language?/:nationality?/:sexualOrientation?",
      //Pri: 'pri',//"/pri/:city?",
      //Mas: 'mas',//"/mas/:city?",
      //Clu: 'clu',//"/clu/:city?",
      Profile: "/profile/:id",
      Explore: {
        path: '',
        screens: {
          Esc: ":city?/:minAge?/:maxAge?/:minHeight?/:maxHeight?/:minWeight?/:maxWeight?/:onlyVerified?/:onlyIndependent?/:onlyPremium?/:services?/:outcall?/:incall?/:bodyType?/:hairColor?/:eyeColor?/:pubicHair?/:breastSize?/:breastType?/:language?/:nationality?/:sexualOrientation?",
          Pri: "/pri/:city?",
          Mas: "/mas/:city?",
          Clu: "/clu/:city?"
        }
      },
      Account: {
        path: 'me',
        screens: {
          PersonalDetails: 'personal-details',
          Photos: 'photos'
        }
      },
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
}

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'rgb(31,199,10)', /*width: 'fit-content', maxWidth: '80%'*/ }} // this width setup didn't work on mobile
      //contentContainerStyle={{ paddingVertical: 15 }}
      text1Style={{
        fontSize: FONT_SIZES.large,
        fontStyle: FONTS.bold,
      }}
      text2Style={{
        fontSize: FONT_SIZES.medium,
        fontStyle: FONTS.bold,
        color: '#000',
      }}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: COLORS.error }}
      text1Style={{
        fontSize: FONT_SIZES.medium,
        fontStyle: FONTS.bold
      }}
      text2Style={{
        fontSize: FONT_SIZES.small,
        fontStyle: FONTS.bold,
        color: '#000' 
      }}
      text2NumberOfLines={2}
    />
  )
}

const EXPLORE_SCREENS = [
  'Esc', 'Pri', 'Mas', 'Clu'
]

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState(true)

  const navigationRef = useRef()

  const { width } = useWindowDimensions()
  const isSmalScreen = width < SMALL_SCREEN_THRESHOLD

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (isLoading || !navigationRef.current) {
      return
    }

    //initial state
    setState(navigationRef.current.getRootState().routes[0].name)

    const unsubscribe = navigationRef.current.addListener('state', (e) => {
      setState(e.data.state.routes[e.data.state.routes.length - 1].name)
    })

    return unsubscribe
  }, [navigationRef.current, isLoading])

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

  const onBottomScreenPress = (screen) => {
    //navigationRef.current.navigate(screen)
    navigationRef.current.dispatch(StackActions.push(screen))
  }

  if (isLoading) {
    return (
      <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightBlack }}>

      </View>
    )
  }

  return (
    <>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef} linking={linking} theme={{ colors: { background: COLORS.lightBlack } }}>
          <Stack.Navigator screenOptions={{
            header: ({ navigation, route }) => <Header language='en' navigation={navigation} route={route} />,
            animationEnabled: true,
            cardStyle: { flex: 1, paddingBottom: isSmalScreen ? 60 : 0 },
          }}>
            <Stack.Screen name="lady-signup" component={LadySignup} initialParams={{}} />
            {/* <Stack.Screen name="Home" component={Home} initialParams={{}} /> */}
            {/* <Stack.Screen name="Esc" component={Esc} initialParams={{}} />
            <Stack.Screen name="Pri" component={Pri} initialParams={{}} />
            <Stack.Screen name="Mas" component={Mas} initialParams={{}} />
            <Stack.Screen name="Clu" component={Clu} initialParams={{}} /> */}
            <Stack.Screen name="Profile" component={Profile} initialParams={{}} />
            <Stack.Screen name="Explore" component={ExploreStack} initialParams={{}} />
            <Stack.Screen name="Account" component={Account} initialParams={{}} />
            <Stack.Screen name="Chat" component={Chat} initialParams={{}} />
            <Stack.Screen name="Favourites" component={Favourites} initialParams={{}} />
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
            <Stack.Screen name="NotFound" component={ExploreStack} initialParams={{}} />

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

      {isSmalScreen && (
        <View style={{ position: 'absolute', bottom: 0, height: 60, width: '100%', backgroundColor: COLORS.lightGrey, flexDirection: 'row' }}>
          <TouchableRipple
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onBottomScreenPress('Explore')}
          >
            <Ionicons name="search-outline" size={24} color={state === 'Explore' ? COLORS.red : COLORS.placeholder} />
          </TouchableRipple>
          <TouchableRipple
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onBottomScreenPress('Favourites')}
          >
            <Ionicons name="heart-outline" size={24} color={state === 'Favourites' ? COLORS.red : COLORS.placeholder} />
          </TouchableRipple>
          <TouchableRipple
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onBottomScreenPress('Chat')}
          >
            <Ionicons name="chatbox-outline" size={24} color={state === 'Chat' ? COLORS.red : COLORS.placeholder} />
          </TouchableRipple>
          <TouchableRipple
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => onBottomScreenPress('Account')}
          >
            <Ionicons name="person-outline" size={24} color={state === 'Account' ? COLORS.red : COLORS.placeholder} />
          </TouchableRipple>
        </View>
      )}

      <Toast config={toastConfig}/>
    </>
  )
}
