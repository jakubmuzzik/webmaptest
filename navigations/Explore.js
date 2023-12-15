import React from 'react'
import { View } from 'react-native'
import Header from '../components/navigation/Header'
import Categories from '../components/navigation/Categories'
import { Outlet } from 'react-router-dom'
import { COLORS } from '../constants'
import { normalize } from '../utils'

const Explore = () => {

    return (
        <>
            <View style={{ position: 'fixed', zIndex: 1, width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack, top: normalize(70) }}>
                <Categories />
            </View>

            <Outlet />
        </>
    )
}

export default Explore