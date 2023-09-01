import React from 'react'
import { View, Text, StyleSheet, useWindowDimensions, Image } from 'react-native'
import { Button } from '@rneui/themed'
import LinkButton from '../components/LinkButton'
import { StackActions } from '@react-navigation/native'

const Register = () => {
    const { width } = useWindowDimensions()
    const isLargeScreen = width >= 768

    return (
        <View style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
            <View style={{ flex: 1, backgroundColor: '#282828', borderRadius: 48 }}>
                <View style={{ flex: 1, right: 0, position: 'absolute', width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderRadius: 48 }}></View>
            </View>

            <View style={{ ...StyleSheet.absoluteFill, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: '10%' }}>
                    <Text style={{ fontSize: 40, color: '#FFF' }}>
                        Find Your Desire
                    </Text>
                    <Text style={{ fontSize: 20, color: '#FFF', marginTop: 10 }}>
                        Explore a world of sensual experiences, connect with passionate service providers.
                    </Text>
                    <LinkButton 
                        to={{ 
                            screen: 'Main' 
                        }} 
                        action={StackActions.replace('Main')}
                        containerStyle={{
                        backgroundColor: '#E0191A',
                        borderRadius: 24,
                        marginTop: 40,
                        width: 200
                    }}>
                        <Button
                            title="Explore Now"
                            buttonStyle={{
                                backgroundColor: '#E0191A',
                                borderRadius: 24,
                            }}
                        />
                    </LinkButton>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: '#FFF', paddingHorizontal: '10%' }}>
                    <Image
                        resizeMode='contain'
                        source={require('../assets/images/logo.png')}
                        style={{ width: '70%', height: '70%' }}
                    />
                </View>
            </View>
        </View>
    )
}

export default Register