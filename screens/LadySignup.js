import React, { useState, useRef, useCallback } from 'react'
import { View, Text, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, CURRENCIES } from '../constants'
import { normalize } from '../utils'
import { ProgressBar, Button, TouchableRipple, Chip, Icon, IconButton } from 'react-native-paper'
import HoverableInput from '../components/HoverableInput'
import HoverableView from '../components/HoverableView'
import DropdownSelect from '../components/DropdownSelect'
import ServicesPicker from '../components/modal/ServicesPicker'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

import { 
    LANGUAGES, 
    NATIONALITIES,
    BODY_TYPES,
    PUBIC_HAIR_VALUES,
    SEXUAL_ORIENTATION,
    SERVICES,
    HAIR_COLORS,
    BREAST_SIZES,
    BREAST_TYPES,
    EYE_COLORS
} from '../labels'

const LadySignup = ({ route }) => {
    const [data, setData] = useState({
        gender: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secureTextEntry: true,
        confirmSecureTextEntry: true,
        nationality: '',
        languages: [],
        hairColor: '',
        eyeColor: '',
        breastSize: '',
        breastType: '',
        bodyType: '',
        pubicHair: '',
        weight: '',
        height: '',
        dateOfBirth: '',
        sexuality: '',
        services: [],
        currency: 'CZK'
    })
    const [showLoginInfoErrorMessages, setShowLoginInfoErrorMessages] = useState(false)
    const [showPersonalDetailsErrorMessages, setShowPersonalDetailsErrorMessages] = useState(false)
    const [showLocationErrorMessages, setShowLocationErrorMessages] = useState(false)
    const [showServicesErrorMessages, setShowServicesErrorMessages] = useState(false)
    const [showPhotosErrorMessages, setShowPhotosErrorMessages] = useState(false)

    const [servicesPickerVisible, setServicesPickerVisible] = useState(false)

    const [nextButtonIsLoading, setNextButtonIsLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const viewPagerRef = useRef()
    const viewPagerX = useRef(0)
    const currencyDropdownRef = useRef()

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

    const onMultiPicklistChange = useCallback((value, attribute) => {
        setData(data => ({
            ...data,
            [attribute]: data[attribute].includes(value) 
             ? data[attribute].filter(s => s !== value)
             : data[attribute].concat(value)
        }))
    }, [])

    const onValueChange = useCallback((value, attribute) => {
        setData(data => ({
            ...data,
            [attribute]: value
        }))
    }, [])

    const onNextPress = () => {
        if (nextButtonIsLoading) {
            return
        }

        switch (index) {
            case 0:
                return processLoginInformationPage()
            case 1:
                return processPersonalDetailsPage()
            case 2:
                return processLocationAndAvailabilityPage()
            case 3:
                return processServicesAndPricingPage()
            case 4:
                return processUploadPhotosPage()
            default:
                return
        }
    }

    const processLoginInformationPage = () => {
        paginageNext()
        return



        if (!data.email || !data.password || !data.name || !data.confirmPassword || !data.gender || data.password !== data.confirmPassword) {
            setShowLoginInfoErrorMessages(true)
            return
        }

        setShowLoginInfoErrorMessages(false)

        setNextButtonIsLoading(true)
        setTimeout(() => {
            //TODO - call fetchSignInMethodsForEmail
            setNextButtonIsLoading(false)
            paginageNext()
        }, 1000)
    }

    const processPersonalDetailsPage = () => {
        paginageNext()
        return

        if (!data.dateOfBirth || !data.sexuality || !data.nationality || !data.languages.length || !data.height || data.weight || !data.bodyType || !data.pubicHair || !data.breastSize || !data.breastType || !data.hairColor || !data.eyeColor) {
            setShowPersonalDetailsErrorMessages(true)
            return
        }

        setShowPersonalDetailsErrorMessages(false)
        paginageNext()
    }

    const processLocationAndAvailabilityPage = () => {
        paginageNext()
    }

    const processServicesAndPricingPage = () => {
        paginageNext()
    }

    const processUploadPhotosPage = () => {
        paginageNext()
    }

    const paginageNext = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) + 1) * contentWidth, animated: true })
    }

    const paginateBack = () => {
        viewPagerRef.current.scrollToOffset({ offset: (Math.floor(viewPagerX.current / contentWidth) - 1) * contentWidth, animated: true })
    }

    const getDateOfBirth = useCallback(() => {
        switch (data.dateOfBirth.length) {
            case 0:
                return ''
            case 1:
                return data.dateOfBirth
            case 2:
                return data.dateOfBirth //+ '.'
            case 3:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2]
            case 4:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] //+ '.'
            case 5:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] + '.' + data.dateOfBirth[4] 
            case 6:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] + '.' + data.dateOfBirth[4] + data.dateOfBirth[5] 
            case 7:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] + '.' + data.dateOfBirth[4] + data.dateOfBirth[5] + data.dateOfBirth[6] 
            case 8:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] + '.' + data.dateOfBirth[4] + data.dateOfBirth[5] + data.dateOfBirth[6] + data.dateOfBirth[7]
            default:
                return data.dateOfBirth[0] + data.dateOfBirth[1] + '.' + data.dateOfBirth[2] + data.dateOfBirth[3] + '.' + data.dateOfBirth[4] + data.dateOfBirth[5] + data.dateOfBirth[5] + data.dateOfBirth[7]
        }
    }, [data.dateOfBirth])

    const onBirthdateChange = useCallback((text) => {
        const strippedText = text.replaceAll('.', '').replaceAll(' ', '').replace(/[^0-9]/g, '')

        if (strippedText.length > 8) {
            return
        }

        onValueChange(strippedText, 'dateOfBirth')
    }, [])

    const onAddServicePress = useCallback(() => {
        setServicesPickerVisible(true)
    }, [])

    const renderLoginInformation = useCallback(() => {
        return (
            <>
                <Text style={styles.pageHeaderText}>
                    1. Login Information
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="Enter your name"
                        label="Name"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large, }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.name}
                        setText={(text) => onValueChange(text, 'name')}
                        leftIconName="badge-account-outline"
                        errorMessage={showLoginInfoErrorMessages && !data.name ? 'Enter your Name' : undefined}
                    />
                    <HoverableInput
                        placeholder="Enter your email"
                        label="Email"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.email}
                        setText={(text) => onValueChange(text, 'email')}
                        leftIconName="email-outline"
                        errorMessage={showLoginInfoErrorMessages && !data.email ? 'Enter your Email' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="Password (8 or more characters)"
                        label="Password"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.password}
                        setText={(text) => onValueChange(text, 'password')}
                        leftIconName='lock-outline'
                        rightIconName={data.secureTextEntry ? 'eye-off' : 'eye'}
                        onRightIconPress={updateSecureTextEntry}
                        errorMessage={showLoginInfoErrorMessages && (!data.password || data.password.length < 8) ? 'Password must be at least 8 characters long' : undefined}
                        secureTextEntry={data.secureTextEntry}
                    />

                    <HoverableInput
                        placeholder="Confirm your password"
                        label="Confirm password"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.confirmPassword}
                        setText={(text) => onValueChange(text, 'confirmPassword')}
                        leftIconName="lock-outline"
                        rightIconName={data.confirmSecureTextEntry ? 'eye-off' : 'eye'}
                        onRightIconPress={updateConfirmSecureTextEntry}
                        errorMessage={showLoginInfoErrorMessages && (!data.confirmPassword || data.confirmPassword.length < 8) ? 'Password must be at least 8 characters long' : showLoginInfoErrorMessages && data.password !== data.confirmPassword ? 'Provided passwords do not match.' : undefined}
                        secureTextEntry={data.confirmSecureTextEntry}
                    />
                </View>
            </>
        )
    }, [showLocationErrorMessages, data, contentWidth])

    const renderPersonalDetails = useCallback(() => {
        return (
            <>
                <Text style={styles.pageHeaderText}>
                    2. Personal Details
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="DD.MM.YYYY"
                        label="Date of birth"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large, minWidth: 110 }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={getDateOfBirth()}
                        setText={(text) => onBirthdateChange(text)}
                        errorMessage={showPersonalDetailsErrorMessages && !data.dateOfBirth ? 'Enter your date of birth' : showPersonalDetailsErrorMessages && data.dateOfBirth.length !== 8 ? 'Enter a date in DD.MM.YYYY format.' : undefined}
                    />
                    <DropdownSelect
                        values={SEXUAL_ORIENTATION}
                        placeholder="Select your sexuality"
                        label="Sexuality"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.sexuality}
                        setText={(text) => onValueChange(text, 'sexuality')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.sexuality ? 'Select your sexuality' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <DropdownSelect
                        values={NATIONALITIES}
                        searchable
                        searchPlaceholder="Search nationality"
                        placeholder="Select your nationality"
                        label="Nationality"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.nationality}
                        setText={(text) => onValueChange(text, 'nationality')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.nationality ? 'Select your nationality' : undefined}
                    />
                    <DropdownSelect
                        values={LANGUAGES}
                        multiselect
                        searchable
                        searchPlaceholder="Search language"
                        placeholder="Select languages"
                        label="Languages"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.languages.join(', ')}
                        setText={(text) => onMultiPicklistChange(text, 'languages')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.languages.length ? 'Select at least one language' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <HoverableInput
                        placeholder="Height in cm"
                        label="Height (cm)"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.height}
                        setText={(text) => onValueChange(text.replace(/[^0-9]/g, ''), 'height')}
                        errorMessage={showPersonalDetailsErrorMessages && !data.height ? 'Enter your height' : undefined}
                    />

                    <HoverableInput
                        placeholder="Weight in kg"
                        label="Weight (kg)"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.weight}
                        setText={(text) => onValueChange(text.replace(/[^0-9]/g, ''), 'weight')}
                        errorMessage={showPersonalDetailsErrorMessages && !data.weight ? 'Enter your weight'  : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <DropdownSelect
                        values={BODY_TYPES}
                        placeholder="Select your body type"
                        label="Body type"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.bodyType}
                        setText={(text) => onValueChange(text, 'bodyType')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.bodyType ? 'Select your body type' : undefined}
                    />
                    <DropdownSelect
                        values={PUBIC_HAIR_VALUES}
                        placeholder="Search your pubic hair"
                        label="Pubic hair"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.pubicHair}
                        setText={(text) => onValueChange(text, 'pubicHair')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.pubicHair ? 'Select your pubic hair' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <DropdownSelect
                        values={BREAST_SIZES}
                        placeholder="Select your breast size"
                        label="Breast size"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.breastSize}
                        setText={(text) => onValueChange(text, 'breastSize')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.breastSize ? 'Select your breast size' : undefined}
                    />
                    <DropdownSelect
                        values={BREAST_TYPES}
                        placeholder="Search your breast type"
                        label="Breast type"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.breastType}
                        setText={(text) => onValueChange(text, 'breastType')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.breastType ? 'Select your breast type' : undefined}
                    />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                    <DropdownSelect
                        values={HAIR_COLORS}
                        placeholder="Select your hair color"
                        label="Hair color"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.hairColor}
                        setText={(text) => onValueChange(text, 'hairColor')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.hairColor ? 'Select your hair color' : undefined}
                    />
                    <DropdownSelect
                        values={EYE_COLORS}
                        placeholder="Search your eye color"
                        label="Eye color"
                        borderColor={COLORS.placeholder}
                        hoveredBorderColor={COLORS.red}
                        textColor='#000'
                        containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                        textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                        labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                        text={data.eyeColor}
                        setText={(text) => onValueChange(text, 'eyeColor')}
                        rightIconName='chevron-down'
                        errorMessage={showPersonalDetailsErrorMessages && !data.eyeColor ? 'Select your eye color' : undefined}
                    />
                </View>
            </>
        )
    }, [showPersonalDetailsErrorMessages, data, contentWidth])

    const renderServicesAndPricing = useCallback(() => {
        return (
            <>
                <Text style={styles.pageHeaderText}>
                    3. Services & Pricing
                </Text>

                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small, marginTop: SPACING.x_small }}>
                    Services ({data.services.length})
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: SPACING.x_large }}>
                    {data.services.map((service) => (
                        <HoverableView style={{ flexDirection: 'row', overflow: 'hidden', borderRadius: 10, marginRight: SPACING.xxx_small, marginBottom: SPACING.xx_small, }} hoveredBackgroundColor={"rgba(220, 46, 46, .22)"} backgroundColor={'rgba(220, 46, 46, .18)'}>
                            <TouchableRipple
                                onPress={onAddServicePress}
                                rippleColor="rgba(220, 46, 46, .22)"
                                style={styles.chip}
                            >
                                <>
                                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, marginRight: SPACING.xx_small }}>{service}</Text>
                                    <Ionicons onPress={() => onMultiPicklistChange(service, 'services')} name="close" size={normalize(18)} color="black" />
                                </>
                            </TouchableRipple>
                        </HoverableView>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.xx_small }}>
                    <HoverableView style={{ flexDirection: 'row', overflow: 'hidden', borderRadius: 10, borderColor: COLORS.placeholder, borderWidth: 2 }} hoveredBackgroundColor={COLORS.hoveredWhite}>
                        <TouchableRipple
                            onPress={onAddServicePress}
                            style={{ paddingHorizontal: SPACING.xx_small, paddingVertical: SPACING.xxx_small,  justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
                        >
                            <>
                                <Ionicons name="add-outline" size={normalize(18)} color="black" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                    Add Service
                                </Text>
                            </>
                        </TouchableRipple>
                    </HoverableView>
                </View>

                <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginBottom: SPACING.small, marginTop: SPACING.medium, alignItems: 'center' }}>
                    <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginRight: SPACING.xx_small }}>
                        Pricing
                    </Text>

                    <DropdownSelect
                        ref={currencyDropdownRef}
                        values={CURRENCIES}
                        setText={(text) => onValueChange(text, 'currency')}
                    >
                        <TouchableOpacity
                            onPress={() => currencyDropdownRef.current?.onDropdownPress()}
                            style={styles.chip}
                        >
                            <>
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, marginRight: 5 }}>{data.currency}</Text>
                                <MaterialIcons name="keyboard-arrow-down" size={normalize(20)} color="black" />
                            </>
                        </TouchableOpacity>
                    </DropdownSelect>
                </View>
                <View style={[styles.table, { marginHorizontal: SPACING.x_large }]}>
                    <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                        <View style={[styles.column, { backgroundColor: COLORS.hoveredWhite }]} backgroundColor={COLORS.hoveredWhite} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderText}>Length</Text>
                        </View>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>0.5 hour</Text>
                        </HoverableView>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>1 hour</Text>
                        </HoverableView>
                    </View>
                    <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                        <View style={[styles.column, { backgroundColor: COLORS.hoveredWhite }]}>
                            <Text style={styles.tableHeaderText}>Incall</Text>
                        </View>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>1000 CZK</Text>
                        </HoverableView>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>2500 CZK</Text>
                        </HoverableView>
                    </View>
                    <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                        <View style={[styles.column, { backgroundColor: COLORS.hoveredWhite }]}>
                            <Text style={styles.tableHeaderText}>Outcall</Text>
                        </View>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>1500 CZK</Text>
                        </HoverableView>
                        <HoverableView style={styles.column} backgroundColor={'#FFF'} hoveredBackgroundColor={COLORS.hoveredWhite}>
                            <Text style={styles.tableHeaderValue}>3000 CZK</Text>
                        </HoverableView>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.x_small }}>
                    <HoverableView style={{ flexDirection: 'row', overflow: 'hidden', borderRadius: 10, borderColor: COLORS.placeholder, borderWidth: 2 }} hoveredBackgroundColor={COLORS.hoveredHoveredWhite} >
                        <TouchableRipple
                            //onPress={onPricePress}
                            style={{ paddingHorizontal: SPACING.xx_small, paddingVertical: SPACING.xxx_small, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
                        >
                            <>
                                <Ionicons name="add-outline" size={normalize(18)} color="black" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium,  }}>
                                    Add Price
                                </Text>
                            </>
                        </TouchableRipple>
                    </HoverableView>
                </View>
            </>
        )
    }, [data, showServicesErrorMessages, contentWidth])

    const renderLocationAndAvailability = useCallback(() => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                4. Location & Availability
            </Text>
        )
    }, [data, showLocationErrorMessages, contentWidth])

    const renderUploadPhotos = useCallback(() => {
        return (
            <Text style={{ color: COLORS.lightBlack, fontFamily: FONTS.bold, fontSize: FONT_SIZES.x_large }}>
                5. Upload Photos
            </Text>
        )
    }, [data, showPhotosErrorMessages, contentWidth])

    const pages = {
        'Login Information': renderServicesAndPricing,
        'Personal Details': renderPersonalDetails,
        'Services & Pricing': renderLoginInformation,
        'Location & Availability': renderLocationAndAvailability,
        'Upload Photos': renderUploadPhotos
    }

    const renderPage = ({ item }) => {
        return (
            <ScrollView style={{ width: contentWidth }} showsVerticalScrollIndicator={false}>
                {pages[item]()}
            </ScrollView>
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
                    {/* Lady Sign up */}
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
                    {index === 0 ? <View /> : <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                        style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0 }}
                        buttonColor={COLORS.grey}
                        rippleColor="rgba(76,76,76,.3)"
                        mode="outlined"
                        onPress={paginateBack}
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
                        loading={nextButtonIsLoading}
                    >
                        {index === Object.keys(pages).length - 1 ? 'Sign up' : 'Next'}
                    </Button>
                </View>
            </ScrollView>

            <ServicesPicker visible={servicesPickerVisible} setVisible={setServicesPickerVisible} services={data.services} onSelect={(service) => onMultiPicklistChange(service, 'services')} route={route}/>
        </View>
    )
}

export default LadySignup

const styles = StyleSheet.create({
    pageHeaderText: {
        color: COLORS.lightBlack, 
        fontFamily: FONTS.bold, 
        fontSize: FONT_SIZES.x_large, 
        marginHorizontal: SPACING.x_large, 
        marginBottom: SPACING.xx_small
    },
    chip: { 
        flexDirection: 'row', 
        width: 'fit-content',
        paddingHorizontal: SPACING.xx_small, 
        paddingVertical: 5, 
        borderRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        borderWidth: 1,
        borderColor: 'grey',
        flexDirection: 'row',
        borderRadius: 10,
        overflow:'hidden'
    },
    tableHeaderText: { 
        fontFamily: FONTS.bold, 
        fontSize: FONT_SIZES.medium 
    },
    tableHeaderValue: { 
        fontFamily: FONTS.medium, 
        fontSize: FONT_SIZES.medium 
    },
    column: {
        padding: SPACING.xx_small
        
    }
})