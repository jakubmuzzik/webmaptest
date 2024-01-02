import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Header from '../components/navigation/Header'
import Categories from '../components/navigation/Categories'
import { Outlet } from 'react-router-dom'
import { COLORS } from '../constants'
import { normalize } from '../utils'
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'

const Explore = () => {

    const previousScrollY = useRef(window.scrollY)
    const positiveScrollYDelta = useRef(0)

    const translateY = useSharedValue(0)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > previousScrollY.current) {
                positiveScrollYDelta.current += window.scrollY - previousScrollY.current
            } else {
                positiveScrollYDelta.current = 0

                if (translateY.value < 0) {
                    translateY.value = withTiming(0, {
                        useNativeDriver: true
                    })
                }
            }

            previousScrollY.current = window.scrollY
        
            if (positiveScrollYDelta.current >= normalize(70) && translateY.value === 0) {
                translateY.value = withTiming(-normalize(70), {
                    useNativeDriver: true
                })
            }
        }

        document.addEventListener("scroll", handleScroll)

        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
      }, [])

    const containersStyle = useAnimatedStyle(() => {
        return {
            position: 'fixed', 
            zIndex: 1, 
            transform: [{ translateY: translateY.value }], 
            width: '100%', 
            flexDirection: 'column', 
            backgroundColor: 
            COLORS.lightBlack, 
            top: normalize(70)
        }
    })

    return (
        <>
            <Animated.View style={containersStyle}>
                <Categories />
            </Animated.View>

            <Outlet />
        </>
    )
}

export default Explore