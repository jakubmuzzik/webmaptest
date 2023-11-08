import React, { useMemo, useState, useRef, useEffect, memo } from 'react'
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import HoverableView from '../HoverableView'
import { normalize } from '../../utils'
import {
    COLORS,
    FONTS,
    FONT_SIZES,
    SPACING,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
} from '../../constants'
import HoverableInput from '../HoverableInput'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableRipple } from 'react-native-paper'

const window = Dimensions.get('window')

const Signup = ({ visible, setVisible, route, onLoginPress }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : DEFAULT_LANGUAGE,
    }), [route.params])

    const [data, setData] = useState({
        email: '',
        password: '',
        emailForReset: '',
        secureTextEntry: true
    })
    const [showErrorMessages, setShowErrorMessages] = useState(false)
    const [contentWidth, setContentWidth] = useState(normalize(500))
    const [profileType, setProfileType] = useState()
    const [index, setIndex] = useState(0)

    const viewPagerRef = useRef()
    const viewPagerX = useRef(0)

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, {
                useNativeDriver: true
            })
        } else {
            translateY.value = withTiming(window.height, {
                useNativeDriver: true
            })
        }
    }, [visible])

    const scrollY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const translateY = useSharedValue(window.height)

    const modalHeaderTextStyles = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollY.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

    const closeModal = () => {
        translateY.value = withTiming(window.height, {
            useNativeDriver: true
        })
        setVisible(false)
        setShowErrorMessages(false)
        setIndex(0)
        viewPagerX.current = 0
    }

    const modalContainerStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: '#FFF',
            borderRadius: 24,
            width: normalize(500),
            maxWidth: '90%',
            height: normalize(500),
            maxHeight: '80%',
            overflow: 'hidden',
            transform: [{ translateY: translateY.value }]
        }
    })

    const updateSecureTextEntry = () => {
        setData((data) => ({
            ...data,
            secureTextEntry: !data.secureTextEntry
        }))
    }

    const onForgotPasswordPress = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) + 1) * contentWidth, animated: true })
    }

    const onGoBackPress = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) - 1) * contentWidth, animated: true })
    }

    const onSignUpPress = () => {
        if (!data.email || !data.password) {
            setShowErrorMessages(true)
            return
        }
    }
    
    const onResetPasswordPress = () => {
        if (!data.emailForReset) {
            setShowErrorMessages(true)
            return
        }
    }

    const handleScroll = ({ nativeEvent }) => {
        viewPagerX.current = nativeEvent.contentOffset.x
        const newIndex = Math.floor(viewPagerX.current / contentWidth)

        if (newIndex != index) {
            setIndex(newIndex)
        }
    }

    const renderLoginPage = () => {
        return (
            <>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginTop: SPACING.xxxxx_large }}>
                    Sign up
                </Text>

                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.x_large, paddingTop: SPACING.small, marginBottom: SPACING.medium }}>
                    What are you looking for?
                </Text>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableRipple style={{ 
                        flex:1, 
                        marginRight: SPACING.xx_small, 
                        flexDirection: 'column', 
                        padding: SPACING.x_small, 
                        borderRadius: 5, 
                        borderColor: profileType === 'member' ? COLORS.red : COLORS.placeholder, 
                        backgroundColor: profileType === 'member' ? 'rgba(220, 46, 46, .10)' : 'transparent',
                        borderWidth: 1 
                    }}
                        onPress={() => setProfileType('member')}
                        rippleColor="rgba(220, 46, 46, .32)"
                    >
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <MaterialCommunityIcons name="guy-fawkes-mask" size={28} color="black" />
                            </View>
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginTop: SPACING.x_small }}>
                                I'm seeking a Lady, to have fun
                            </Text>
                        </>

                    </TouchableRipple>
                    <TouchableRipple style={{ 
                        flex: 1,
                        marginLeft: SPACING.xx_small, 
                        flexDirection: 'column', 
                        padding: SPACING.x_small, 
                        borderRadius: 5, 
                        borderColor: profileType === 'lady' ? COLORS.red : COLORS.placeholder, 
                        backgroundColor: profileType === 'lady' ? 'rgba(220, 46, 46, .10)' : 'transparent',
                        borderWidth: 1 
                    }}
                        onPress={() => setProfileType('lady')}
                        rippleColor="rgba(220, 46, 46, .32)"
                    >
                        <>
                            <View>
                                <Entypo name="mask" size={28} color="black" />
                            </View>
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginTop: SPACING.x_small }}>
                                I'm a Lady, providing services
                            </Text>
                        </>
                    </TouchableRipple>
                </View>

                <HoverableView style={{ marginTop: SPACING.medium, borderRadius: 10, overflow: 'hidden' }} hoveredBackgroundColor={COLORS.red} backgroundColor={COLORS.red} hoveredOpacity={0.8}>
                    <TouchableOpacity onPress={onSignUpPress} style={{ padding: 10, alignItems: 'center' }} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[COLORS.red, COLORS.darkRed]}
                            style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}
                        />
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Continue</Text>
                    </TouchableOpacity>
                </HoverableView>

                <Text style={{ alignSelf: 'center', marginTop: SPACING.small, fontSize: FONTS.medium, fontStyle: FONTS.medium, color: COLORS.lightBlack }}>
                    Already have an Account?
                    <Text onPress={onLoginPress} style={{ marginLeft: SPACING.xxx_small, color: COLORS.linkColor }}>Log in</Text>
                </Text>
            </>
        )
    }

    const renderForgotPasswordPage = () => {
        return (
            <>
                <Image
                    resizeMode='contain'
                    source={require('../../assets/images/padlock-icon.png')}
                    style={{ width: contentWidth * 0.18, height: contentWidth * 0.18, alignSelf: 'center', marginTop: SPACING.xxxx_large, }}
                />

                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginTop: SPACING.large, textAlign: 'center' }}>
                    Forgot your password?
                </Text>
                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, paddingTop: SPACING.small, textAlign: 'center', marginBottom: SPACING.medium }}>
                    Enter your email and we will send you the instructions to reset your password.
                </Text>

                <HoverableInput
                    placeholder="Enter your email"
                    label="Email"
                    borderColor={COLORS.placeholder}
                    hoveredBorderColor={COLORS.red}
                    textColor='#000'
                    textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                    labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                    placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                    text={data.emailForReset}
                    setText={(text) => setData({ ...data, ['emailForReset']: text })}
                    left={() => <AntDesign
                        name="user"
                        size={normalize(20)}
                        color={COLORS.lightBlack}
                    />}
                    errorMessage={showErrorMessages && !data.emailForReset ? 'Enter Email' : undefined}
                />

                <HoverableView style={{ marginTop: SPACING.medium, borderRadius: 10, overflow: 'hidden' }} hoveredBackgroundColor={COLORS.red} backgroundColor={COLORS.red} hoveredOpacity={0.8}>
                    <TouchableOpacity onPress={onResetPasswordPress} style={{ padding: 10, alignItems: 'center' }} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[COLORS.red, COLORS.darkRed]}
                            style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}
                        />
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Reset Password</Text>
                    </TouchableOpacity>
                </HoverableView>
            </>
        )
    }

    const pages = {
        'login': renderLoginPage,
        'forgowPassword': renderForgotPasswordPage,
    }

    const renderPage = ({ item }) => {
        return (
            <View style={{ width: contentWidth,  paddingHorizontal: SPACING.small }}>
                {pages[item]()}
            </View>
        )
    }

    return (
        <Modal transparent={true}
            visible={visible}
            animationType="fade">
            <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', cursor: 'default' }}
                activeOpacity={1}
                onPressOut={closeModal}
            >
                <TouchableWithoutFeedback>
                    <Animated.View style={modalContainerStyles}>
                        <View style={styles.modal__header}>
                            <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0 }}>
                                {index === 1 && (
                                    <HoverableView style={{ marginLeft: SPACING.medium, width: SPACING.x_large, height: SPACING.x_large, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 }} hoveredBackgroundColor={COLORS.hoveredHoveredWhite} backgroundColor={COLORS.hoveredWhite}>
                                        <Ionicons onPress={onGoBackPress} name="arrow-back" size={normalize(25)} color="black" />
                                    </HoverableView>
                                )}
                            </View>
                            <View style={{ flexShrink: 1, flexGrow: 0 }}>
                                <Animated.Text style={modalHeaderTextStyles}>Sign up</Animated.Text>
                            </View>
                            <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0, alignItems: 'flex-end' }}>
                                <HoverableView style={{ marginRight: SPACING.medium, width: SPACING.x_large, height: SPACING.x_large, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 }} hoveredBackgroundColor={COLORS.hoveredHoveredWhite} backgroundColor={COLORS.hoveredWhite}>
                                    <Ionicons onPress={closeModal} name="close" size={normalize(25)} color="black" />
                                </HoverableView>
                            </View>
                        </View>
                        <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles]} />

                        <Animated.ScrollView scrollEventThrottle={1} 
                            onScroll={scrollHandler} 
                            style={{ flex: 1, zIndex: 1 }} 
                            contentContainerStyle={{ paddingBottom: SPACING.small }}
                            onContentSizeChange={(contentWidth) => setContentWidth(contentWidth)}
                        >
                            <FlatList 
                                ref={viewPagerRef}
                                onScroll={handleScroll}
                                style={{ flex: 1 }}
                                data={Object.keys(pages)}
                                renderItem={renderPage}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                bounces={false}
                                pagingEnabled
                                disableIntervalMomentum
                                initialScrollIndex={0}
                                scrollEnabled={false}
                            />
                        </Animated.ScrollView>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default memo(Signup)

const styles = StyleSheet.create({
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
        justifyContent: 'space-between',
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
    }
})