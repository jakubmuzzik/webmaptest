import { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { StyleSheet, View, useWindowDimensions, Dimensions } from 'react-native'
import { normalize, stripEmptyParams, getParam } from '../utils'

import { connect } from 'react-redux'
import { updateScrollDisabled } from '../redux/actions'

import { getAuth, onAuthStateChanged } from '../firebase/config'

import Toast from '../components/Toast'

import LadySignup from '../screens/LadySignup'
import NotFound from '../screens/NotFound'
import Header from '../components/navigation/Header'
import Footer from '../components/navigation/Footer'
import Pri from '../screens/Pri'
import Esc from '../screens/Esc'
import Clu from '../screens/Clu'
import Mas from '../screens/Mas'
import Profile from '../screens/Profile'
import Account from '../screens/Account'
import EstablishmentSignup from '../screens/EstablishmentSignup'
import SignUpOrLogin from '../screens/SignUpOrLogin'
import SearchResults from '../screens/SearchResults'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING, SUPPORTED_LANGUAGES } from '../constants'

import Explore from './Explore'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet, Navigate, useLocation, useSearchParams } from 'react-router-dom'

const { height: initialHeight } = Dimensions.get('window')

const auth = getAuth()

const Main = ({ scrollDisabled, updateScrollDisabled, toastData }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [userVerified, setUserVerified] = useState(null)

    const toastRef = useRef()
    const hasLoadedRef = useRef(false)

    const { height } = useWindowDimensions()

    useEffect(() => {
        if (toastData) {
            toastRef.current?.show(toastData)
        }
    }, [toastData])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (!user) {
                setIsLoggedIn(false)
                setUserVerified(false)

                if (hasLoadedRef.current) {
                    toastRef.current?.show({
                        type: 'success',
                        text: 'Successfully logged out.'
                    })
                }                
            } else if (!user.emailVerified) {
                if (hasLoadedRef.current) {
                    toastRef.current?.show({
                        type: 'success',
                        text: 'Successfully logged in.'
                    })
                }

                setIsLoggedIn(true)
                setUserVerified(false)
            } else {
                if (hasLoadedRef.current) {
                    toastRef.current?.show({
                        type: 'success',
                        text: 'Successfully logged in.'
                    })
                }

                setIsLoggedIn(true)
                setUserVerified(true)
            }

            hasLoadedRef.current = true
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const RequireAuth = useCallback(({ children }) => {
        const location = useLocation()
        const [searchParams] = useSearchParams()

        const params = {
            language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
        }

        let to = '/auth'
        //need to hardcode => search param on Navigate component didn't work
        if (params.language) {
            to += '?language=' + params.language
        }

        if (!isLoggedIn) {
            return <Navigate to={to} state={{ from: location }} replace />
        }

        return children
    }, [isLoggedIn, userVerified])

    const Redirect = ({ replace, to }) => {
        const [searchParams] = useSearchParams()

        const params = {
            language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
        }

        //need to hardcode => search param on Navigate component didn't work
        if (params.language) {
            to += '?language=' + params.language
        }

        return <Navigate to={to} replace={replace} />
    }

    const LayoutWithHeader = useCallback(({ children }) => (
        <>
            <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                <Header />
            </View>

            <View style={{ flex: 1, marginTop: normalize(70) }}>
                {children}
            </View>

            <Footer />
        </>
    ), [])

    const router = createBrowserRouter(createRoutesFromElements(
        <>
            <Route path='/' element={
                <LayoutWithHeader>
                    <Explore />
                </LayoutWithHeader>
            } >
                <Route index element={<Esc />} />
                <Route path='/mas' element={<Mas />} />
                <Route path='/clu' element={<Clu />} />
            </Route>

            <Route path='/profile/:id' element={
                <LayoutWithHeader>
                    <Profile />
                </LayoutWithHeader>
            } />

            <Route path='/account' element={
                <RequireAuth>
                    <LayoutWithHeader>
                        <Outlet />
                    </LayoutWithHeader>
                </RequireAuth>
            } >
                <Route index element={<Redirect to="/account/profile-information" replace />} />
                <Route path='profile-information' element={<Account />} />
                <Route path='ladies' element={<Account />} />
                <Route path='edit-lady/:id' element={<Account />} />
                <Route path='add-lady' element={<Account />} />
                <Route path='photos' element={<Account />} />
                <Route path='videos' element={<Account />} />
                <Route path='settings' element={<Account />} />
            </Route>

            <Route path='/lady-signup' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ height: initialHeight, paddingTop: normalize(70) }}>
                        <LadySignup independent/>
                    </View>
                </>
            } />

            <Route path='/establishment-signup' element={
                <>
                    <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}>
                        <Header />
                    </View>

                    <View style={{ height: initialHeight, paddingTop: normalize(70) }}>
                        <EstablishmentSignup />
                    </View>
                </>
            } />

            <Route path='/auth' element={
                <LayoutWithHeader>
                    <SignUpOrLogin />
                </LayoutWithHeader>
            } />

            <Route path='/search' element={
                <LayoutWithHeader>
                    <SearchResults />
                </LayoutWithHeader>
            } />

            <Route path='*' element={
                <LayoutWithHeader>
                    <Account />
                </LayoutWithHeader>
            } />
        </>
    ))

    router.subscribe(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant'})

        //reset scroll whenever user navigates
        if (scrollDisabled) {
            setTimeout(() => updateScrollDisabled(false))
        }
    })

    if (isLoggedIn == null || userVerified == null) {
        return null
    }

    return (
        <>
            <View style={scrollDisabled ? { height, overflow: 'hidden' }: {flex:1}}>
                <RouterProvider router={router} />
            </View>

            <Toast ref={toastRef} />
        </>
    )
}

const mapStateToProps = (store) => ({
    scrollDisabled: store.appState.scrollDisabled,
    toastData: store.appState.toastData
})

export default connect(mapStateToProps, { updateScrollDisabled })(Main)