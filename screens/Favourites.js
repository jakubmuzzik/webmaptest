import React from 'react'
import { View, Text, Dimensions } from 'react-native'

import { normalize } from '../utils'

const Favourites = ({ }) => {

    return (
        <View style={{ marginTop: normalize(70), flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text>Favourites</Text>
        </View>
    )
}

export default Favourites