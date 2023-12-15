import React from "react"
import { View } from "react-native"
import { COLORS } from "../constants"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableRipple } from "react-native-paper"
import { Ionicons } from '@expo/vector-icons'
import { useLocation, useNavigate } from 'react-router-dom'

const MobileFooter = ({ router }) => {
    const insets = useSafeAreaInsets()
    let location = useLocation()
    const navigate = useNavigate()

    return (
        <View style={{ position: 'fixed', bottom: 0, height: 60 + insets.bottom, width: '100%', backgroundColor: COLORS.lightGrey, flexDirection: 'row', paddingBottom: insets.bottom }}>
            <TouchableRipple
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigate('/')}
            >
                <Ionicons name="search-outline" size={24} color={location.pathname === '/' ? COLORS.red : COLORS.placeholder} />
            </TouchableRipple>
            <TouchableRipple
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigate('/favourites')}
            >
                <Ionicons name="heart-outline" size={24} color={location.pathname === '/favourites' ? COLORS.red : COLORS.placeholder} />
            </TouchableRipple>
            <TouchableRipple
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigate('/chat')}
            >
                <Ionicons name="chatbox-outline" size={24} color={location.pathname === '/chat' ? COLORS.red : COLORS.placeholder} />
            </TouchableRipple>
            <TouchableRipple
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigate('/me')}
            >
                <Ionicons name="person-outline" size={24} color={location.pathname === '/me' ? COLORS.red : COLORS.placeholder} />
            </TouchableRipple>
        </View>
    )
}

export default MobileFooter