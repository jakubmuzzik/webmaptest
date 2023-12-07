import React from 'react'
import { View, Text } from 'react-native'

import SignUpOrLogin from './SignUpOrLogin'
import { normalize } from '../utils'

const Chat = ({ navigation, route }) => {

    if (false) {
        return <SignUpOrLogin navigation={navigation} route={route}/>
    }

    return (
        <View style={{ marginTop: normalize(70), flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text>Chat</Text>
        </View>
    )
}

export default Chat