import React from 'react'
import { View, Text } from 'react-native'
import { COLORS } from '../constants'

const Clu = ({ navigation, route }) => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <Text>Clu</Text>
        </View>
    )
}

export default Clu