import React from 'react'
import { View, Text } from 'react-native'

import SignUpOrLogin from './SignUpOrLogin'

const Favourites = ({ navigation, route }) => {

    if (false) {
        return <SignUpOrLogin navigation={navigation} route={route}/>
    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text>Favourites</Text>
        </View>
    )
}

export default Favourites