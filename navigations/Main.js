import { NavigationContainer } from '@react-navigation/native'
import { useState, useMemo, useRef } from 'react'
import { StyleSheet, View, useWindowDimensions, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { normalize } from '../utils'

import { connect } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

import LadySignup from '../screens/LadySignup'
import Home from '../screens/Home'
import NotFound from '../screens/NotFound'
import Header from '../components/navigation/Header'
import Pri from '../screens/Pri'
import Esc from '../screens/Esc'
import Clu from '../screens/Clu'
import Mas from '../screens/Mas'
import Profile from '../screens/Profile'
import ProfilePhotosList from '../screens/ProfilePhotosList'
import PhotoGallery from '../screens/PhotoGallery'
import Account from '../screens/Account'
import Chat from '../screens/Chat'
import Favourites from '../screens/Favourites'
import Categories from '../components/navigation/Categories'
import MobileFooter from './MobileFooter'
import SignUpOrLogin from '../screens/SignUpOrLogin'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING } from '../constants'

import { BlurView } from 'expo-blur'

import { TouchableRipple } from 'react-native-paper'

//import { NativeRouter, Route, Routes } from 'react-router-native'
import Explore from './Explore'

import { BrowserRouter, Routes, Route, Link, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

const { height } = Dimensions.get('window')

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
            Esc: '',//":city?/:minAge?/:maxAge?/:minHeight?/:maxHeight?/:minWeight?/:maxWeight?/:onlyVerified?/:onlyIndependent?/:onlyPremium?/:services?/:outcall?/:incall?/:bodyType?/:hairColor?/:eyeColor?/:pubicHair?/:breastSize?/:breastType?/:language?/:nationality?/:sexualOrientation?",
            Pri: 'pri',//"/pri/:city?",
            Mas: 'mas',//"/mas/:city?",
            Clu: 'clu',//"/clu/:city?",
            Profile: "/profile/:id",
            /*Explore: {
              path: '',
              screens: {
                Esc: ":city?/:minAge?/:maxAge?/:minHeight?/:maxHeight?/:minWeight?/:maxWeight?/:onlyVerified?/:onlyIndependent?/:onlyPremium?/:services?/:outcall?/:incall?/:bodyType?/:hairColor?/:eyeColor?/:pubicHair?/:breastSize?/:breastType?/:language?/:nationality?/:sexualOrientation?",
                Pri: "/pri/:city?",
                Mas: "/mas/:city?",
                Clu: "/clu/:city?"
              }
            },*/
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

const Main = ({ scrollDisabled }) => {
    const [state, setState] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const insets = useSafeAreaInsets()

    const navigationRef = useRef()

    const { width, height } = useWindowDimensions()
    const isSmalScreen = width < SMALL_SCREEN_THRESHOLD

    const router = createBrowserRouter(createRoutesFromElements(
        <>
            <Route path='/' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        <Explore />
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } >
                <Route index element={<Esc />} />
                <Route path='/mas' element={<Mas />} />
                <Route path='/clu' element={<Clu />} />
            </Route>

            <Route path='/profile/:id' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>
                    
                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        <Profile />
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />

            <Route path='/favourites' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        {isLoggedIn ? <Favourites /> : <SignUpOrLogin />}
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />

            <Route path='/chat' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        {isLoggedIn ? <Chat /> : <SignUpOrLogin />}
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />

            <Route path='/me' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        {!isLoggedIn ? <Account /> : <SignUpOrLogin />}
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />

            <Route path='/lady-signup' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, height: height - normalize(70) }}>
                        <LadySignup />
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />

            <Route path='*' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, flex: 1 }}>
                        <NotFound />
                    </View>

                    {isSmalScreen && <MobileFooter />}
                </>
            } />
        </>
    ))

    return (
        <View style={scrollDisabled ? { height, overflow: 'hidden' }: {}}>
            <RouterProvider router={router} />
        </View>
    )

    return (
        <>
            <NavigationContainer ref={navigationRef} linking={linking} theme={{ colors: { background: COLORS.lightBlack } }}>
                <Stack.Navigator screenOptions={{
                    header: ({ navigation, route }) => (
                        <View style={{ position: 'fixed', width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                            <Header language='en' navigation={navigation} route={route} />
                        </View>
                    ),
                    /*cardStyleInterpolator: ({ current }) => ({
                      cardStyle: {
                        opacity: current.progress,
                      },
                    }),*/
                    //animationEnabled: true,
                    cardStyle: { /*flex: 1,*/ paddingBottom: isSmalScreen ? 60 + insets.bottom : 0, /*overscrollBehavior: 'none'*/ },
                }}>

                    <Stack.Group
                        screenOptions={{
                            cardStyle: { flex: 1, paddingBottom: isSmalScreen ? 60 + insets.bottom : 0 }
                        }}
                    >
                        <Stack.Screen name="lady-signup" component={LadySignup} initialParams={{}} />
                    </Stack.Group>
                    { }

                    <Stack.Group
                        screenOptions={{
                            header: ({ navigation, route }) => (
                                <View style={{ position: 'fixed', width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                                    <Header language='en' navigation={navigation} route={route} />
                                    <Categories navigation={navigation} route={route} />
                                </View>
                            ),
                        }}
                    >
                        <Stack.Screen name="Esc" component={Esc} initialParams={{}} />
                        <Stack.Screen name="Pri" component={Pri} initialParams={{}} />
                        <Stack.Screen name="Mas" component={Mas} initialParams={{}} />
                        <Stack.Screen name="Clu" component={Clu} initialParams={{}} />
                    </Stack.Group>

                    <Stack.Screen name="Profile" component={Profile} initialParams={{}} />
                    {/* <Stack.Screen name="Explore" component={ExploreStack} initialParams={{}} /> */}
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

            {isSmalScreen && (
                <View style={{ position: 'fixed', bottom: 0, height: 60 + insets.bottom, width: '100%', backgroundColor: COLORS.lightGrey, flexDirection: 'row', paddingBottom: insets.bottom }}>
                    <TouchableRipple
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => onBottomScreenPress('Esc')}
                    >
                        <Ionicons name="search-outline" size={24} color={state === 'Esc' ? COLORS.red : COLORS.placeholder} />
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
        </>
    )
}

const mapStateToProps = (store) => ({
    scrollDisabled: store.appState.scrollDisabled
})

export default connect(mapStateToProps)(Main)