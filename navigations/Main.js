import { useState, useMemo, useRef } from 'react'
import { StyleSheet, View, useWindowDimensions, Dimensions } from 'react-native'
import { normalize } from '../utils'

import { connect } from 'react-redux'

import LadySignup from '../screens/LadySignup'
import NotFound from '../screens/NotFound'
import Header from '../components/navigation/Header'
import Pri from '../screens/Pri'
import Esc from '../screens/Esc'
import Clu from '../screens/Clu'
import Mas from '../screens/Mas'
import Profile from '../screens/Profile'
import Account from '../screens/Account'
import Chat from '../screens/Chat'
import Favourites from '../screens/Favourites'
import MobileFooter from './MobileFooter'
import SignUpOrLogin from '../screens/SignUpOrLogin'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING } from '../constants'

import Explore from './Explore'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

const Main = ({ scrollDisabled }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const insets = useSafeAreaInsets()

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
}

const mapStateToProps = (store) => ({
    scrollDisabled: store.appState.scrollDisabled
})

export default connect(mapStateToProps)(Main)