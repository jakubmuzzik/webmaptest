import React from 'react'
import { View, Text } from 'react-native'
import { COLORS } from '../constants'

const Esc = ({ navigation, route }) => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <Text>Esc</Text>
        </View>
    )
}

export default Esc