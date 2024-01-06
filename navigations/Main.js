import { useState, useMemo, useRef, useEffect } from 'react'
import { StyleSheet, View, useWindowDimensions, Dimensions } from 'react-native'
import { normalize } from '../utils'

import { connect } from 'react-redux'
import { updateScrollDisabled } from '../redux/actions'

import LadySignup from '../screens/LadySignup'
import NotFound from '../screens/NotFound'
import Header from '../components/navigation/Header'
import Categories from '../components/navigation/Categories'
import Pri from '../screens/Pri'
import Esc from '../screens/Esc'
import Clu from '../screens/Clu'
import Mas from '../screens/Mas'
import Profile from '../screens/Profile'
import Account from '../screens/Account'
import Chat from '../screens/Chat'
import Favourites from '../screens/Favourites'
import EstablishmentSignup from '../screens/EstablishmentSignup'
import SignUpOrLogin from '../screens/SignUpOrLogin'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING } from '../constants'

import Explore from './Explore'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet, Navigate } from 'react-router-dom'

const { height: initialHeight } = Dimensions.get('window')

const Main = ({ scrollDisabled, updateScrollDisabled }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const { height } = useWindowDimensions()

    const router = createBrowserRouter(createRoutesFromElements(
        <>
            <Route path='/' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Explore />
                    </View>
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
                    
                    <View style={{ flex: 1 }}>
                        <Profile />
                    </View>
                </>
            } />

            <Route path='/favourites' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View>
                        {isLoggedIn ? <Favourites /> : <SignUpOrLogin />}
                    </View>
                </>
            } />

            <Route path='/chat' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>
                    <View style={{ flex: 1 }}>
                        {isLoggedIn ? <Chat /> : <SignUpOrLogin />}
                    </View>
                </>
            } />

            <Route path='/account' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <Outlet />
                </>
            } >
                <Route index element={<Navigate to="/account/profile-information" replace />} />
                <Route path='profile-information' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />
                <Route path='ladies' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />
                <Route path='edit-lady/:id' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />
                <Route path='photos' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />
                <Route path='videos' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />
                <Route path='settings' element={!isLoggedIn ? <Account /> : <SignUpOrLogin />} />

                <Route path='*' element={<NotFound />} />
            </Route>

            <Route path='/lady-signup' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ height: initialHeight - normalize(70) }}>
                        <LadySignup independent/>
                    </View>
                </>
            } />

            <Route path='/establishment-signup' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ height: initialHeight - normalize(70) }}>
                        <EstablishmentSignup />
                    </View>
                </>
            } />

            <Route path='*' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Account />
                    </View>
                </>
            } />
        </>
    ))

    router.subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant'})

        if (scrollDisabled) {
            setTimeout(() => updateScrollDisabled(false))
        }
    })

    return (
        <View style={scrollDisabled ? { height, overflow: 'hidden' }: {flex:1}}>
            <RouterProvider router={router} />
        </View>
    )
}

const mapStateToProps = (store) => ({
    scrollDisabled: store.appState.scrollDisabled
})

export default connect(mapStateToProps, { updateScrollDisabled })(Main)