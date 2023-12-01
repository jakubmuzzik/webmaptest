import React from 'react'
import { View, Text } from 'react-native'

import SignUpOrLogin from './SignUpOrLogin'

const Chat = ({ navigation, route }) => {

    if (true) {
        return <SignUpOrLogin navigation={navigation} route={route}/>
    }

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text>Chat</Text>
        </View>
    )
}

export default Chat