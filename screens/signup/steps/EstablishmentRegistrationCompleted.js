import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import { COLORS, SPACING, FONTS, FONT_SIZES } from '../../../constants'
import { normalize } from '../../../utils'
import { Image } from 'expo-image'
import { MotiView } from 'moti'

const EstablishmentRegistrationCompleted = ({ visible, email }) => {
    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const modalHeaderTextStyles = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollY.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

    return (
        <>
            <View style={styles.modal__header}>
                <Animated.Text style={modalHeaderTextStyles}>Registration completed</Animated.Text>
            </View>
            <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles]} />
            <Animated.ScrollView
                scrollEventThrottle={1}
                onScroll={scrollHandler}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}
            >
                <Text style={styles.pageHeaderText}>
                    Registration completed
                </Text>

                <View style={{ height: 100, width: 100, marginVertical: SPACING.medium, alignSelf: 'center' }}>
                    {visible && <MotiView
                        style={{ flex: 1,  }}
                        from={{
                            transform: [{ scale: 0 }]
                        }}
                        animate={{
                            transform: [{ scale: 1 }],
                        }}
                        transition={{
                            delay: 50,
                        }}
                    >
                        <Image
                            resizeMode='contain'
                            source={require('../../../assets/completed.svg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </MotiView>}
                </View>

                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center', marginBottom: SPACING.small }}>
                    Your Establishment has been submitted for review!
                </Text>

                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center' }}>
                    Our team will review your establishment shortly, and once approved, you'll receive a confirmation email to: {email}
                </Text>

                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center', marginTop: SPACING.xx_small }}>
                    In the meantime you can log in and start adding your profiles of your ladies.
                </Text>
            </Animated.ScrollView>
        </>
    )
}

export default memo(EstablishmentRegistrationCompleted)

const styles = StyleSheet.create({
    pageHeaderText: {
        //color: '#FFF', 
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.h3,
        marginHorizontal: SPACING.x_large,
        marginBottom: SPACING.small,
        textAlign: 'center'
    },
    modal__header: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: normalize(55),
        //backgroundColor: '#FFF',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal__shadowHeader: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: normalize(55),
        backgroundColor: '#FFF',
        zIndex: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5
    },
})