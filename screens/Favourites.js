import React from 'react'
import { View, Text } from 'react-native'

import SignUpOrLogin from './SignUpOrLogin'
import { normalize } from '../utils'

const Favourites = ({ navigation, route }) => {

    if (true) {
        return <SignUpOrLogin navigation={navigation} route={route}/>
    }

    return (
        <View style={{ marginTop: normalize(70), flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text>Favourites</Text>
        </View>
    )
}

export default Favourites