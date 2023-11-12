import React, { useState, useRef } from 'react'
import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants'
import { normalize } from '../utils'
import { ProgressBar, Button } from 'react-native-paper'
import HoverableInput from '../components/HoverableInput'

const LadySignup = () => {
    const [data, setData] = useState({
        gender: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secureTextEntry: true,
        confirmSecureTextEntry: true,
    })
    const [showErrorMessages, setShowErrorMessages] = useState(false)
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const viewPagerRef = useRef()
    const viewPagerX = useRef(0)

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirmSecureTextEntry: !data.confirmSecureTextEntry
        })
    }

    const handleScroll = ({ nativeEvent }) => {
        viewPagerX.current = nativeEvent.contentOffset.x
        const newIndex = Math.ceil(viewPagerX.current / contentWidth)

        if (newIndex != index) {
            setIndex(newIndex)
        }
    }

    const onNextPress = () => {
        if (index === Object.keys(pages).length - 1) {
            //complete signup
        } else if (validate()) {
            viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) + 1) * contentWidth, animated: true })
        }
    }

    const validate = () => {
        switch (index) {
            case 0:
                return validateLoginInformation()
            case 1:
                return validatePersonalDetails()
            case 2:
                return validateLocationAndAvailability()
            case 3:
                return validateServicesAndPricing()
            case 4:
                return validateUploadPhotos()
            default:
                return false
        }
    }

    const validateLoginInformation = () => {

    }

    const validatePersonalDetails = () => {
        
    }

    const validateLocationAndAvailability = () => {
        
    }

    const validateServicesAndPricing = () => {
        
    }

    const validateUploadPhotos = () => {
        
    }

    const onPreviousPress = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) - 1) * contentWidth, animated: true })
    }

    const renderLoginInformation = () => {
        return (
            <>
                <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large, marginHorizontal: SPACING.x_large, marginBottom: SPACING.xx_small }}>
                    Login Information
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="Enter your Name"
                        label="Name"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large, }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.name}
                        setText={(text) => setData({ ...data, ['name']: text })}
                        leftIconName="badge-account-outline"
                        errorMessage={showErrorMessages && !data.name ? 'Enter your Name' : undefined}
                    />
                    <HoverableInput
                        placeholder="Enter Your email"
                        label="Email"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.email}
                        setText={(text) => setData({ ...data, ['email']: text })}
                        leftIconName="email-outline"
                        errorMessage={showErrorMessages && !data.email ? 'Enter your Email' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="Enter Your Password"
                        label="Password"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.password}
                        setText={(text) => setData({ ...data, ['password']: text.replaceAll(' ', '') })}
                        leftIconName='lock-outline'
                        rightIconName={data.secureTextEntry ? 'eye-off' : 'eye'}
                        onRightIconPress={updateSecureTextEntry}
                        errorMessage={showErrorMessages && (!data.password || data.password.length < 8) ? 'Password must be at least 8 characters long' : undefined}
                        secureTextEntry={data.secureTextEntry}
                    />

                    <HoverableInput
                        placeholder="Enter Your Password"
                        label="Confirm Password"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.confirmPassword}
                        setText={(text) => setData({ ...data, ['confirmPassword']: text.replaceAll(' ', '') })}
                        leftIconName="lock-outline"
                        rightIconName={data.confirmSecureTextEntry ? 'eye-off' : 'eye'}
                        onRightIconPress={updateConfirmSecureTextEntry}
                        errorMessage={showErrorMessages && (!data.confirmPassword || data.confirmPassword.length < 8) ? 'Password must be at least 8 characters long' : undefined}
                        secureTextEntry={data.confirmSecureTextEntry}
                    />
                </View>
            </>
        )
                }

    const renderPersonalDetails = () => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                Personal Details
            </Text>
        )
    }

    const renderLocationAndAvailability = () => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                Location & Availability
            </Text>
        )
    }

    const renderServicesAndPricing = () => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                Services & Pricing
            </Text>
        )
    }

    const renderUploadPhotos = () => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                Upload Photos
            </Text>
        )
    }

    const pages = {
        'Login Information': renderLoginInformation,
        'Personal Details': renderPersonalDetails,
        'Location & Availability': renderLocationAndAvailability,
        'Services & Pricing': renderServicesAndPricing,
        'Upload Photos': renderUploadPhotos
    }

    const renderPage = ({ item }) => {
        return (
            <View style={{ width: contentWidth }}>
                {pages[item]()}
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack, alignItems: 'center', justifyContent: 'center', padding: SPACING.medium, }}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={{ flex: 1, width: normalize(800), maxWidth: '100%', backgroundColor: '#FFF', borderRadius: 20 }}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={(contentWidth) => setContentWidth(contentWidth)}
            >
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, color: COLORS.lightBlack, margin: SPACING.x_large, marginBottom: SPACING.medium }}>
                    Lady Sign up
                </Text>
                <View style={{ marginBottom: SPACING.small, marginHorizontal: SPACING.x_large, }}>
                    <ProgressBar progress={(index) / Object.keys(pages).length} color={COLORS.error} />
                </View>

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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: SPACING.x_large, marginTop: SPACING.medium, }}>
                    {index === 0 ? <View/> : <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                        style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0 }}
                        buttonColor={COLORS.grey}
                        rippleColor="rgba(76,76,76,.3)"
                        mode="outlined"
                        onPress={onPreviousPress}
                    >
                        Back
                    </Button>}

                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                        style={{ flexShrink: 1, borderRadius: 10 }}
                        buttonColor={COLORS.red}
                        rippleColor="rgba(220, 46, 46, .16)"
                        mode="contained"
                        onPress={onNextPress}
                    >
                        {index === Object.keys(pages).length - 1 ? 'Sign up' : 'Next'}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default LadySignup