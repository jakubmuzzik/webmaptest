import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, CURRENCIES } from '../constants'
import { normalize } from '../utils'
import { ProgressBar, Button, TouchableRipple, IconButton, SegmentedButtons, TextInput as RNPaperTextInput, Switch, HelperText } from 'react-native-paper'
import HoverableInput from '../components/HoverableInput'
import HoverableView from '../components/HoverableView'
import DropdownSelect from '../components/DropdownSelect'
import ServicesPicker from '../components/modal/ServicesPicker'
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { TabView } from 'react-native-tab-view'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'

import {
    LANGUAGES,
    NATIONALITIES,
    BODY_TYPES,
    PUBIC_HAIR_VALUES,
    SEXUAL_ORIENTATION,
    HAIR_COLORS,
    BREAST_SIZES,
    BREAST_TYPES,
    EYE_COLORS
} from '../labels'
import { MotiView } from 'moti'
import * as ImagePicker from 'expo-image-picker'
import AddressSearch from '../components/modal/AddressSearch'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const HOURS = ['0.5 hour', '1 hour', '1.5 hour', '2 hours', '2.5 hour', '3 hours', '3.5 hour', '4 hours', '4.5 hour', '5 hours', '5.5 hour', '6 hours', '6.5 hour', '7 hours', '7.5 hour', '8 hours', '8.5 hour', '9 hours', '9.5 hour', '10 hours', '10.5 hour', '11 hours', '11.5 hour', '12 hours', '12.5 hour', '13 hours', '13.5 hour', '14 hours', '14.5 hour', '15 hours', '15.5 hour', '16 hours', '16.5 hour', '17 hours', '17.5 hour', '18 hours', '18.5 hour', '19 hours', '19.5 hour', '20 hours', '20.5 hour', '21 hours', '21.5 hour', '22 hours', '22.5 hour', '23 hours', '23.5 hour', '24 hours']

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
        currency: 'CZK',
        prices: [], //{length: 1, incall: '', outcall: ''}
        incall: true,
        outcall: true,
        address: '',
        addressTitle: '',
        hiddenAddress: false,
        description: '',
        workingHours: [{ day: 'monday', from: '', until: '', enabled: true }, { day: 'tuesday', from: '', until: '', enabled: true }, { day: 'wednesday', from: '', until: '', enabled: true }, { day: 'thursday', from: '', until: '', enabled: true }, { day: 'friday', from: '', until: '', enabled: true }, { day: 'saturday', from: '', until: '', enabled: true }, { day: 'sunday', from: '', until: '', enabled: true }],
        images: [null, null, null, null, null, null]
    })

    const [photosContentWidth, setPhotosContentWidth] = useState(normalize(800))

    const [showLoginInfoErrorMessages, setShowLoginInfoErrorMessages] = useState(false)
    const [showPersonalDetailsErrorMessages, setShowPersonalDetailsErrorMessages] = useState(false)
    const [showLocationErrorMessages, setShowLocationErrorMessages] = useState(false)
    const [showServicesErrorMessages, setShowServicesErrorMessages] = useState(false)
    const [showPhotosErrorMessages, setShowPhotosErrorMessages] = useState(false)

    const [servicesPickerVisible, setServicesPickerVisible] = useState(false)
    const [addressSearchVisible, setAddressSearchVisible] = useState(false)

    const [nextButtonIsLoading, setNextButtonIsLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const [routes] = useState([
        { key: '1. Login Information', index: 0 },
        { key: '2. Personal Details', index: 1 },
        { key: '3. Services & Pricing', index: 2 },
        { key: '4. Address & Availability', index: 3 },
        { key: '5. Upload Photos', index: 4 }
    ])

    const scrollYLoginInformation = useSharedValue(0)
    const scrollYPersonalDetails = useSharedValue(0)
    const scrollYSericesAndPricing = useSharedValue(0)
    const scrollYLocationAndAvailability = useSharedValue(0)
    const scrollYUploadPhotos = useSharedValue(0)

    const scrollHandler1 = useAnimatedScrollHandler((event) => {
        scrollYLoginInformation.value = event.contentOffset.y
    })
    const scrollHandler2 = useAnimatedScrollHandler((event) => {
        scrollYPersonalDetails.value = event.contentOffset.y
    })
    const scrollHandler3 = useAnimatedScrollHandler((event) => {
        scrollYSericesAndPricing.value = event.contentOffset.y
    })
    const scrollHandler4 = useAnimatedScrollHandler((event) => {
        scrollYLocationAndAvailability.value = event.contentOffset.y
    })
    const scrollHandler5 = useAnimatedScrollHandler((event) => {
        scrollYUploadPhotos.value = event.contentOffset.y
    })

    const modalHeaderTextStyles1 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYLoginInformation.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles2 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYPersonalDetails.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles3 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYSericesAndPricing.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles4 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYLocationAndAvailability.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles5 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYUploadPhotos.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

    const currencyDropdownRef = useRef()
    const pricesDropdownPress = useRef()

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

    const processLocationAndAvailabilityPage = useCallback(() => {
        paginageNext()
        return

        let dataValid = true

        if (!data.address) {
            dataValid = false
        }

        const timeRegex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/
        const workingHours = JSON.parse(JSON.stringify(data.workingHours))

        workingHours.forEach(setup => {
            if (!setup.from) {
                setup.invalidFrom = 'Enter value in HH:mm format.'
            } else {
                setup.invalidFrom = false
            }

            if (!setup.until) {
                setup.invalidUntil = 'Enter value in HH:mm format.'
            } else {
                setup.invalidUntil = false
            }

            if (setup.invalidFrom || setup.invalidUntil) {
                dataValid = false
                return
            }

            try {
                let hours = parseInt(setup.from.split(':')[0], 10)
                let minutes = parseInt(setup.from.split(':')[1], 10)

                if (setup.day === 'monday') {
                    console.log(hours)
                    console.log(minutes)
                }

                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                    setup.invalidFrom = false
                } else {
                    setup.invalidFrom = 'Hours must be between 0 and 23, and minutes between 0 and 59.'
                }

                hours = parseInt(setup.until.split(':')[0], 10)
                minutes = parseInt(setup.until.split(':')[1], 10)

                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                    setup.invalidUntil = false
                } else {
                    setup.invalidUntil = 'Hours must be between 0 and 23, and minutes between 0 and 59.'
                }
            } catch (e) {
                console.error(e)
                dataValid = false
            }

            if (setup.invalidFrom || setup.invalidUntil) {
                dataValid = false
            }
        })

        if (!dataValid) {
            setData(data => ({
                ...data,
                workingHours
            }))
            setShowLocationErrorMessages(true)
            return
        }

        //TODO - if all valid - remove all valid like attributes

        paginageNext()
    }, [data])

    const processServicesAndPricingPage = () => {
        paginageNext()
    }

    const processUploadPhotosPage = () => {
        paginageNext()
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

    const onTermsOfServicePress = useCallback(() => {

    }, [])

    const onPrivacyPolicyPress = useCallback(() => {

    }, [])

    const onAddNewPricePress = useCallback(() => {
        pricesDropdownPress.current?.onDropdownPress()
    }, [pricesDropdownPress.current])

    const onAddNewPrice = useCallback((val) => {
        setData(data => ({
            ...data,
            ['prices']: (data.prices.concat({ length: Number(val.substring(0, val.indexOf('h') - 1)), incall: '', outcall: '' }))
                .sort((a, b) => a.length - b.length)
        }))
    }, [])

    const onPriceDeletePress = useCallback((index) => {
        setData(d => {
            d.prices.splice(index, 1)
            return { ...d }
        })
    }, [])

    const onPriceChange = useCallback((text, index, priceType) => {
        setData(d => {
            d.prices[index][priceType] = text.replace(/[^0-9]/g, '')
            return { ...d }
        })
    }, [])

    const onWorkingHourChange = useCallback((value, index, attribute) => {
        setData(d => {
            d.workingHours[index][attribute] = value
            if (attribute === 'enabled' && !value) {
                d.workingHours[index].from = ''
                d.workingHours[index].until = ''
            }
            return { ...d }
        })
    }, [])

    const onSearchAddressPress = useCallback(() => {
        setAddressSearchVisible(true)
    }, [])

    const onAddressSelect = useCallback((value) => {
        setData((data) => ({
            ...data,
            address: value,
            addressTitle: value?.title
        }))
    }, [])

    const onSelectImagePress = useCallback(async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        })

        if (!result.canceled) {
            try {
                setData(d => {
                    d.images[index] = result.assets[0].uri
                    if (index > 4 && d.images.length < 16) {
                        d.images.push(null)
                    }
                    return { ...d }
                })
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    const onDeleteImagePress = useCallback(async (index) => {
        setData(d => {
            if (index > 4) {
                d.images.splice(index, 1)
            } else {
                d.images[index] = null
            }
            
            return { ...d }
        })
    }, [])

    const paginageNext = () => {
        setIndex(index => index + 1)
    }

    const paginateBack = () => {
        setIndex(index => index - 1)
    }

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
                return processServicesAndPricingPage()
            case 3:
                return processLocationAndAvailabilityPage()
            case 4:
                return processUploadPhotosPage()
            default:
                return
        }
    }

    const renderLoginInformation = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles1}>1. Login Information</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles1]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler1} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
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
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
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
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.email}
                            setText={(text) => onValueChange(text, 'email')}
                            leftIconName="email-outline"
                            errorMessage={showLoginInfoErrorMessages && !data.email ? 'Enter your Email' : undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                        <HoverableInput
                            placeholder="8 or more characters"
                            label="Password"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
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
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.confirmPassword}
                            setText={(text) => onValueChange(text, 'confirmPassword')}
                            leftIconName="lock-outline"
                            rightIconName={data.confirmSecureTextEntry ? 'eye-off' : 'eye'}
                            onRightIconPress={updateConfirmSecureTextEntry}
                            errorMessage={showLoginInfoErrorMessages && (!data.confirmPassword || data.confirmPassword.length < 8) ? 'Password must be at least 8 characters long' : showLoginInfoErrorMessages && data.password !== data.confirmPassword ? 'Provided passwords do not match.' : undefined}
                            secureTextEntry={data.confirmSecureTextEntry}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.small }}>
                        <Text style={{ fontSize: FONT_SIZES.medium, fontFamily: FONTS.medium }}>
                            By countinuing, you agree to Ladiesforfun <Text style={{ color: 'blue' }} onPress={onTermsOfServicePress}>Terms of Service</Text> and <Text style={{ color: 'blue' }} onPress={onPrivacyPolicyPress}>Privacy Policy</Text>.
                        </Text>
                    </View>
                </Animated.ScrollView>
            </>
        )
    }, [showLocationErrorMessages, data, contentWidth])

    const renderPersonalDetails = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles2}>2. Personal Details</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles2]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler2} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
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
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            text={getDateOfBirth()}
                            setText={(text) => onBirthdateChange(text)}
                            errorMessage={showPersonalDetailsErrorMessages && !data.dateOfBirth ? 'Enter your date of birth' : showPersonalDetailsErrorMessages && data.dateOfBirth.length !== 8 ? 'Enter a date in DD.MM.YYYY format.' : undefined}
                        />
                        <DropdownSelect
                            values={SEXUAL_ORIENTATION}
                            offsetX={contentWidth * Number(i)}
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
                            offsetX={contentWidth * i}
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
                            offsetX={contentWidth * i}
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
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
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
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.weight}
                            setText={(text) => onValueChange(text.replace(/[^0-9]/g, ''), 'weight')}
                            errorMessage={showPersonalDetailsErrorMessages && !data.weight ? 'Enter your weight' : undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                        <DropdownSelect
                            values={BODY_TYPES}
                            offsetX={contentWidth * i}
                            placeholder="Select your body type"
                            label="Body type"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.bodyType}
                            setText={(text) => onValueChange(text, 'bodyType')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.bodyType ? 'Select your body type' : undefined}
                        />
                        <DropdownSelect
                            values={PUBIC_HAIR_VALUES}
                            offsetX={contentWidth * i}
                            placeholder="Search your pubic hair"
                            label="Pubic hair"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.pubicHair}
                            setText={(text) => onValueChange(text, 'pubicHair')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.pubicHair ? 'Select your pubic hair' : undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                        <DropdownSelect
                            values={BREAST_SIZES}
                            offsetX={contentWidth * i}
                            placeholder="Select your breast size"
                            label="Breast size"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.breastSize}
                            setText={(text) => onValueChange(text, 'breastSize')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.breastSize ? 'Select your breast size' : undefined}
                        />
                        <DropdownSelect
                            values={BREAST_TYPES}
                            offsetX={contentWidth * i}
                            placeholder="Search your breast type"
                            label="Breast type"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.breastType}
                            setText={(text) => onValueChange(text, 'breastType')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.breastType ? 'Select your breast type' : undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                        <DropdownSelect
                            values={HAIR_COLORS}
                            offsetX={contentWidth * i}
                            placeholder="Select your hair color"
                            label="Hair color"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.hairColor}
                            setText={(text) => onValueChange(text, 'hairColor')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.hairColor ? 'Select your hair color' : undefined}
                        />
                        <DropdownSelect
                            values={EYE_COLORS}
                            offsetX={contentWidth * i}
                            placeholder="Search your eye color"
                            label="Eye color"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.eyeColor}
                            setText={(text) => onValueChange(text, 'eyeColor')}
                            rightIconName='chevron-down'
                            errorMessage={showPersonalDetailsErrorMessages && !data.eyeColor ? 'Select your eye color' : undefined}
                        />
                    </View>

                    <View style={{ marginHorizontal: SPACING.x_large }}>
                        <HoverableInput
                            placeholder="Desribe yourself"
                            multiline
                            numberOfLines={5}
                            maxLength={1000}
                            label="Description"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ marginTop: SPACING.xxx_small }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.description}
                            setText={(text) => onValueChange(text, 'description')}
                            errorMessage={showPersonalDetailsErrorMessages && !data.description ? 'Desribe yourself' : undefined}
                        />
                    </View>
                    <View style={{ marginHorizontal: SPACING.x_large, marginTop: 3 }}>
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small, color: 'grey' }}>
                            {`${data.description.length}/1000`}
                        </Text>
                    </View>
                </Animated.ScrollView>
            </>
        )
    }, [showPersonalDetailsErrorMessages, data, contentWidth])

    const renderServicesAndPricing = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles3}>3. Services & Pricing</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles3]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler3} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={styles.pageHeaderText}>
                        3. Services & Pricing
                    </Text>

                    <Text style={{ marginTop: SPACING.x_small, marginBottom: SPACING.small, marginHorizontal: SPACING.x_large, color: '#000', fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginRight: SPACING.xx_small }}>
                        Available for:
                    </Text>

                    <SegmentedButtons
                        style={{ marginHorizontal: SPACING.x_large }}
                        onValueChange={() => null}
                        theme={{ roundness: 1.5 }}
                        buttons={[
                            {
                                style: { borderColor: COLORS.placeholder, backgroundColor: data.incall && data.outcall ? COLORS.red : 'transparent', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
                                value: data.incall && data.outcall,
                                label: <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: data.incall && data.outcall ? '#FFF' : '#000' }}>Both</Text>,
                                onPress: () => setData(data => ({ ...data, outcall: true, incall: true })),
                                rippleColor: "rgba(220, 46, 46, .10)"
                            },
                            {
                                style: { borderColor: COLORS.placeholder, backgroundColor: data.outcall && !data.incall ? COLORS.red : 'transparent' },
                                value: data.outcall && !data.incall,
                                label: <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: data.outcall && !data.incall ? '#FFF' : '#000' }}>Outcall</Text>,
                                checkedColor: '#FFF',
                                onPress: () => setData(data => ({ ...data, outcall: true, incall: false })),
                                rippleColor: "rgba(220, 46, 46, .10)"
                            },
                            {
                                style: { borderColor: COLORS.placeholder, backgroundColor: data.incall && !data.outcall ? COLORS.red : 'transparent', borderTopRightRadius: 10, borderBottomRightRadius: 10 },
                                value: data.incall && !data.outcall,
                                label: <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: data.incall && !data.outcall ? '#FFF' : '#000' }}>Incall</Text>,
                                checkedColor: '#FFF',
                                onPress: () => setData(data => ({ ...data, incall: true, outcall: false })),
                                rippleColor: "rgba(220, 46, 46, .10)"
                            }
                        ]}
                    />

                    <Text style={{ color: '#000', fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small, marginTop: SPACING.medium }}>
                        Services ({data.services.length})
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: SPACING.x_large }}>
                        {data.services.map((service) => (
                            <HoverableView key={service} style={{ flexDirection: 'row', overflow: 'hidden', borderRadius: 10, marginRight: SPACING.xxx_small, marginBottom: SPACING.xx_small, }} hoveredBackgroundColor={COLORS.hoveredRed} backgroundColor={COLORS.red}>
                                <TouchableRipple
                                    onPress={() => onMultiPicklistChange(service, 'services')}
                                    style={styles.chip}
                                >
                                    <>
                                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, marginRight: SPACING.xx_small, color: '#FFF' }}>{service}</Text>
                                        <Ionicons onPress={() => onMultiPicklistChange(service, 'services')} name="close" size={normalize(18)} color="white" />
                                    </>
                                </TouchableRipple>
                            </HoverableView>
                        ))}
                    </View>

                    <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.xx_small }}>
                        <Button
                            labelStyle={{ fontSize: normalize(20), color: '#000' }}
                            style={{ borderRadius: 10, borderColor: '#000', borderWidth: 2 }}
                            contentStyle={{ height: 35 }}
                            rippleColor="rgba(0, 0, 0, .1)"
                            icon="plus"
                            mode="outlined"
                            onPress={onAddServicePress}
                        >
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}>
                                Add service
                            </Text>
                        </Button>
                    </View>

                    <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small, marginTop: SPACING.medium, alignItems: 'center' }}>
                        <Text style={{ color: '#000', fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginRight: SPACING.xx_small }}>
                            Pricing
                        </Text>

                        <DropdownSelect
                            ref={currencyDropdownRef}
                            offsetX={contentWidth * i}
                            text={data.currency}
                            values={CURRENCIES}
                            setText={(text) => onValueChange(text, 'currency')}
                        >
                            <TouchableOpacity
                                onPress={() => currencyDropdownRef.current?.onDropdownPress()}
                                style={{ marginLeft: SPACING.xxx_small, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}>
                                    {data.currency}
                                </Text>
                                <MaterialCommunityIcons style={{ marginLeft: 4, }} name="chevron-down" size={normalize(20)} color="black" />
                            </TouchableOpacity>
                        </DropdownSelect>
                    </View>
                    {data.prices.length > 0 && <View style={[styles.table, { marginHorizontal: SPACING.x_large, marginBottom: SPACING.xx_small }]}>
                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>Length</Text>
                            </View>
                            {data.prices.map(price => (
                                <View key={price.length} style={styles.column}>
                                    <Text style={styles.tableHeaderValue}>{price.length + ((price['length'].toString()).includes('.') || price['length'] === 1 ? ' hour' : ' hours')}</Text>
                                </View>
                            ))}
                        </View>
                        {data.incall && <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>Incall ({data.currency})</Text>
                            </View>
                            {data.prices.map((price, index) => (
                                <View key={price.length} style={{ padding: 4 }}>
                                    <TextInput
                                        style={[styles.column, {
                                            fontFamily: FONTS.regular,
                                            fontSize: FONT_SIZES.medium,
                                            outlineStyle: 'none',
                                            color: '#000',
                                            height: styles.column.height - 8,
                                            borderColor: '#000',
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }]}
                                        onChangeText={(text) => onPriceChange(text, index, 'incall')}
                                        value={price.incall}
                                        placeholder='0'
                                        placeholderTextColor="grey"
                                    />
                                </View>
                            ))}
                        </View>}
                        {data.outcall && <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>Outcall ({data.currency})</Text>
                            </View>
                            {data.prices.map((price, index) => (
                                <View key={price.length} style={{ padding: 4 }}>
                                    <TextInput
                                        style={[styles.column, {
                                            fontFamily: FONTS.regular,
                                            fontSize: FONT_SIZES.medium,
                                            outlineStyle: 'none',
                                            color: '#000',
                                            height: styles.column.height - 8,
                                            borderColor: '#000',
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }]}
                                        onChangeText={(text) => onPriceChange(text, index, 'outcall')}
                                        value={price.outcall}
                                        placeholder='0'
                                        placeholderTextColor="grey"
                                    />
                                </View>
                            ))}
                        </View>}
                        <View style={{ flexBasis: 45, flexShrink: 0, flexGrow: 0 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>

                            </View>
                            {data.prices.map((price, index) => (
                                <View key={price.length} style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 4, height: normalize(45) }}>
                                    <IconButton
                                        icon="delete-outline"
                                        iconColor='black'
                                        size={20}
                                        onPress={() => onPriceDeletePress(index)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>}

                    <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.xx_small }}>
                        <DropdownSelect
                            ref={pricesDropdownPress}
                            offsetX={contentWidth * i}
                            values={HOURS.filter(hour => !data.prices.some(price => price.length === Number(hour.substring(0, hour.indexOf('h') - 1))))}
                            setText={onAddNewPrice}
                        >
                            <Button
                                labelStyle={{ fontSize: normalize(20), color: '#000' }}
                                style={{ borderRadius: 10, borderColor: '#000', borderWidth: 2 }}
                                contentStyle={{ height: 35 }}
                                rippleColor="rgba(0, 0, 0, .1)"
                                icon="plus"
                                mode="outlined"
                                onPress={onAddNewPricePress}
                            >
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}>
                                    Add price
                                </Text>
                            </Button>
                        </DropdownSelect>
                    </View>
                </Animated.ScrollView>
            </>
        )
    }, [data, showServicesErrorMessages, contentWidth])

    const renderLocationAndAvailability = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles4}>4. Address & Working Hours</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles4]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler4} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={[styles.pageHeaderText, { marginBottom: 0 }]}>
                        4. Address & Working Hours
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large, alignItems: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={onSearchAddressPress}
                            style={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.x_small, marginRight: SPACING.x_large, }}>
                            <HoverableInput
                                pointerEventsDisabled
                                placeholder="Search address"
                                label="Search address"
                                borderColor={COLORS.placeholder}
                                hoveredBorderColor={COLORS.red}
                                textColor='#000'
                                textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                                labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                                placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                                text={data.addressTitle}
                                leftIconName='map-marker-outline'
                                errorMessage={showLocationErrorMessages && !data.addressTitle ? 'Enter your address' : undefined}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xx_small, flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.x_small, marginRight: SPACING.x_large }}>
                            <View style={{ flex: 1, flexDirection: 'column', marginRight: SPACING.small }}>
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large }}>
                                    Show your specific location
                                </Text>
                                <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2 }}>
                                    If not selected, only city will be visible on your profile
                                </Text>
                            </View>
                            <Switch value={data.hiddenAddress}
                                onValueChange={(value) => setData({
                                    ...data,
                                    hiddenAddress: value
                                })} color={COLORS.red}
                            />
                        </View>
                    </View>

                    <Text style={{ marginTop: SPACING.small, marginBottom: SPACING.x_small, marginHorizontal: SPACING.x_large, color: '#000', fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginRight: SPACING.xx_small }}>
                        Working hours
                    </Text>

                    <View style={[styles.table, { marginHorizontal: SPACING.x_large }]}>
                        <View style={{ flexShrink: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>Day</Text>
                            </View>
                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[0].enabled ? 'none' : 'line-through' }]}>Monday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[0].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 0, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[0].invalidFrom || data.workingHours[0].invalidUntil) && data.workingHours[0].enabled) &&
                                <View style={{ height: data.workingHours[0].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[1].enabled ? 'none' : 'line-through' }]}>Tuesday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[1].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 1, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[1].invalidFrom || data.workingHours[1].invalidUntil) && data.workingHours[1].enabled) &&
                                <View style={{ height: data.workingHours[1].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[2].enabled ? 'none' : 'line-through' }]}>Wednesday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[2].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 2, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[2].invalidFrom || data.workingHours[2].invalidUntil) && data.workingHours[2].enabled) &&
                                <View style={{ height: data.workingHours[2].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[3].enabled ? 'none' : 'line-through' }]}>Thursday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[3].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 3, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[3].invalidFrom || data.workingHours[3].invalidUntil) && data.workingHours[3].enabled) &&
                                <View style={{ height: data.workingHours[3].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[4].enabled ? 'none' : 'line-through' }]}>Friday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[4].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 4, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[4].invalidFrom || data.workingHours[4].invalidUntil) && data.workingHours[4].enabled) &&
                                <View style={{ height: data.workingHours[4].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[5].enabled ? 'none' : 'line-through' }]}>Saturday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[5].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 5, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[5].invalidFrom || data.workingHours[5].invalidUntil) && data.workingHours[5].enabled) &&
                                <View style={{ height: data.workingHours[5].errorHeight }} />
                            }

                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[6].enabled ? 'none' : 'line-through' }]}>Sunday</Text>
                                <Switch
                                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }], marginLeft: SPACING.xxx_small }}
                                    value={data.workingHours[6].enabled}
                                    onValueChange={(value) => onWorkingHourChange(value, 6, 'enabled')}
                                    color={COLORS.red}
                                />
                            </View>
                            {((data.workingHours[6].invalidFrom || data.workingHours[6].invalidUntil) && data.workingHours[6].enabled) &&
                                <View style={{ height: data.workingHours[6].errorHeight }} />
                            }
                        </View>

                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>From</Text>
                            </View>
                            {data.workingHours.map((value, index) => (
                                <View key={value.day} style={{ padding: 4, opacity: data.workingHours[index].enabled ? 1 : 0.3 }}>
                                    <TextInput
                                        style={[styles.column, {
                                            fontFamily: FONTS.regular,
                                            fontSize: FONT_SIZES.medium,
                                            outlineStyle: 'none',
                                            color: '#000',
                                            height: styles.column.height - 8,
                                            borderColor: data.workingHours[index].invalidFrom && data.workingHours[index].enabled ? COLORS.error : '#000',
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }]}
                                        editable={data.workingHours[index].enabled}
                                        onChangeText={(text) => onWorkingHourChange(text.replaceAll(' ', '').replace(/[^\d:]/g, ''), index, 'from')}
                                        value={data.workingHours[index].from}
                                        placeholder='HH:mm'
                                        placeholderTextColor="grey"
                                        maxLength={5}
                                    />
                                    {((data.workingHours[index].invalidFrom || data.workingHours[index].invalidUntil) && data.workingHours[index].enabled) &&
                                        <HelperText onLayout={(event) => onWorkingHourChange(event.nativeEvent.layout.height, index, 'errorHeight')} type="error" visible>
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small, color: COLORS.error, opacity: data.workingHours[index].invalidFrom ? 1 : 0 }}>
                                                {data.workingHours[index].invalidFrom || data.workingHours[index].invalidUntil}
                                            </Text>
                                        </HelperText>
                                    }
                                </View>
                            ))}
                        </View>

                        <View style={{ flexBasis: 200, flexShrink: 1, flexGrow: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey, flexShrink: 0 }]}>
                                <Text style={styles.tableHeaderText}>Until</Text>
                            </View>
                            {data.workingHours.map((value, index) => (
                                <View key={value.day} style={{ padding: 4, opacity: data.workingHours[index].enabled ? 1 : 0.3 }}>
                                    <TextInput
                                        style={[styles.column, {
                                            fontFamily: FONTS.regular,
                                            fontSize: FONT_SIZES.medium,
                                            outlineStyle: 'none',
                                            color: '#000',
                                            height: styles.column.height - 8,
                                            borderColor: data.workingHours[index].invalidUntil && data.workingHours[index].enabled ? COLORS.error : '#000',
                                            borderWidth: 1,
                                            borderRadius: 5
                                        }]}
                                        editable={data.workingHours[index].enabled}
                                        onChangeText={(text) => onWorkingHourChange(text.replaceAll(' ', '').replace(/[^\d:]/g, ''), index, 'until')}
                                        value={data.workingHours[index].until}
                                        placeholder='HH:mm'
                                        placeholderTextColor="grey"
                                        maxLength={5}
                                    />
                                    {((data.workingHours[index].invalidFrom || data.workingHours[index].invalidUntil) && data.workingHours[index].enabled) &&
                                        <HelperText onLayout={(event) => onWorkingHourChange(event.nativeEvent.layout.height, index, 'errorHeight')} type="error" visible>
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small, color: COLORS.error, opacity: data.workingHours[index].invalidUntil ? 1 : 0 }}>
                                                {data.workingHours[index].invalidFrom || data.workingHours[index].invalidUntil}
                                            </Text>
                                        </HelperText>
                                    }
                                </View>
                            ))}
                        </View>
                    </View>
                </Animated.ScrollView>
            </>
        )
    }, [data, showLocationErrorMessages, contentWidth])

    const renderUploadPhotos = useCallback((i) => {

        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles5}>5. Photos & Videos</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles5]} />
                <Animated.ScrollView 
                    onContentSizeChange={(contentWidth) => setPhotosContentWidth(contentWidth)}
                    scrollEventThrottle={1} 
                    onScroll={scrollHandler5} 
                    style={{ flex: 1 }} 
                    contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={styles.pageHeaderText}>
                        5. Photos & Videos
                    </Text>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large }}>
                        Add at least 5 cover photos
                    </Text>
                    <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2, marginHorizontal: SPACING.x_large }}>
                        These photos will be prominently displayed on your profile page
                    </Text>

                    <View style={{ marginTop: SPACING.x_small, flexDirection: 'row', marginHorizontal: SPACING.x_large }}>
                        <View style={{ width: '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                            {data.images[0] ?
                                <>
                                    <Image
                                        style={{
                                            aspectRatio: 3 / 4,
                                            width: 'auto',
                                            borderTopLeftRadius: 20,
                                            borderBottomLeftRadius: 20
                                        }}
                                        source={{ uri: data.images[0] }}
                                        placeholder={blurhash}
                                        resizeMode="cover"
                                        transition={200}
                                    />
                                    <IconButton
                                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                        icon="delete-outline"
                                        iconColor='white'
                                        size={normalize(20)}
                                        onPress={() => onDeleteImagePress(0)}
                                    />
                                </> :

                                <TouchableRipple
                                    onPress={() => onSelectImagePress(0)}
                                    style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
                                >
                                    <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                </TouchableRipple>
                            }
                        </View>
                        <View style={{ flexDirection: 'column', width: '50%', flexShrink: 1 }}>
                            <View style={{ flexDirection: 'row', marginBottom: SPACING.xxx_small, flexGrow: 1 }}>

                                <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                                    {data.images[1] ?
                                        <>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    aspectRatio: 3 / 4
                                                }}
                                                source={{ uri: data.images[1] }}
                                                placeholder={blurhash}
                                                resizeMode="cover"
                                                transition={200}
                                            />
                                            <IconButton
                                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                                icon="delete-outline"
                                                iconColor='white'
                                                size={normalize(20)}
                                                onPress={() => onDeleteImagePress(1)}
                                            />
                                        </> :

                                        <TouchableRipple
                                            onPress={() => onSelectImagePress(1)}
                                            style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, flex: 1 }}
                                        >
                                            <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                        </TouchableRipple>

                                    }
                                </View>


                                <View style={{ flex: 1 }}>
                                    {data.images[2] ?
                                        <>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    borderTopRightRadius: 20,
                                                    aspectRatio: 3 / 4
                                                }}
                                                source={{ uri: data.images[2] }}
                                                placeholder={blurhash}
                                                resizeMode="cover"
                                                transition={200}
                                            />
                                            <IconButton
                                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                                icon="delete-outline"
                                                iconColor='white'
                                                size={normalize(20)}
                                                onPress={() => onDeleteImagePress(2)}
                                            />
                                        </> :

                                        <TouchableRipple
                                            onPress={() => onSelectImagePress(2)}
                                            style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, borderTopRightRadius: 20, flex: 1, }}
                                        >
                                            <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                        </TouchableRipple>

                                    }
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flexGrow: 1 }}>

                                <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                                    {data.images[3] ?
                                        <>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    aspectRatio: 3 / 4
                                                }}
                                                source={{ uri: data.images[3] }}
                                                placeholder={blurhash}
                                                resizeMode="cover"
                                                transition={200}
                                            />
                                            <IconButton
                                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                                icon="delete-outline"
                                                iconColor='white'
                                                size={normalize(20)}
                                                onPress={() => onDeleteImagePress(3)}
                                            />
                                        </>
                                        :
                                        <TouchableRipple
                                            onPress={() => onSelectImagePress(3)}
                                            style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, flex: 1, }}
                                        >
                                            <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                        </TouchableRipple>
                                    }
                                </View>

                                <View style={{ flex: 1}}>
                                    {data.images[4] ?
                                        <>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    borderBottomRightRadius: 20,
                                                    aspectRatio: 3 / 4 
                                                }}
                                                source={{ uri: data.images[4] }}
                                                placeholder={blurhash}
                                                resizeMode="cover"
                                                transition={200}
                                            />
                                            <IconButton
                                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                                icon="delete-outline"
                                                iconColor='white'
                                                size={normalize(20)}
                                                onPress={() => onDeleteImagePress(4)}
                                            />
                                        </> :
                                        <TouchableRipple
                                            onPress={() => onSelectImagePress(4)}
                                            style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, borderBottomRightRadius: 20, flex :1, }}
                                        >
                                            <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                        </TouchableRipple>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large,  marginHorizontal: SPACING.x_large, marginTop: SPACING.x_small, }}>
                        Add additional photos or videos
                    </Text>
                    <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2, marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small }}>
                        Visitors can explore these assets by clicking the 'View All' button on your profile
                    </Text>

                    {data.images.length > 5 && <View style={{ flexDirection: 'row', marginLeft: SPACING.x_large, marginRight: SPACING.x_large - SPACING.xxx_small, flexWrap: 'wrap' }}>
                        {data.images.slice(5).map((image, index) =>
                            <View key={image ?? Math.random()} style={{ width: ((photosContentWidth - (SPACING.x_large * 2) - (SPACING.xxx_small * 2)) / 3), marginRight: SPACING.xxx_small, marginBottom: SPACING.xxx_small }}>
                                {image ?
                                    <React.Fragment>
                                        <Image
                                            style={{
                                                flex: 1,
                                                borderRadius: 20,
                                                aspectRatio: 1 / 1,
                                                borderWidth: 1,
                                                borderColor: 'rgba(28,27,31,0.16)'
                                            }}
                                            source={{ uri: image }}
                                            placeholder={blurhash}
                                            resizeMode="contain"
                                            transition={200}
                                        />
                                        <IconButton
                                            style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                            icon="delete-outline"
                                            iconColor='white'
                                            size={normalize(20)}
                                            onPress={() => onDeleteImagePress(index + 5)}
                                        />
                                    </React.Fragment> :
                                    <TouchableRipple
                                        onPress={() => onSelectImagePress(index + 5)}
                                        style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', flex: 1, borderRadius: 20, aspectRatio: 1 / 1 }}
                                    >
                                        <>
                                            <AntDesign name="plus" size={normalize(30)} color="black" />
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>
                                                Add more
                                            </Text>
                                        </>
                                    </TouchableRipple>
                                }
                            </View>)}
                    </View>}
                </Animated.ScrollView>
            </>

        )
    }, [data, showPhotosErrorMessages, contentWidth, photosContentWidth])

    const renderScene = ({ route }) => {
        switch (route.key) {
            case '1. Login Information':
                return renderLoginInformation(route.index)
            case '2. Personal Details':
                return renderPersonalDetails(route.index)
            case '3. Services & Pricing':
                return renderServicesAndPricing(route.index)
            case '4. Address & Availability':
                return renderLocationAndAvailability(route.index)
            case '5. Upload Photos':
                return renderUploadPhotos(route.index)
        }
    }

    const progress = (index) / Object.keys(routes).length

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, marginHorizontal: SPACING.x_large, marginVertical: SPACING.small, color: '#FFF' }}>
                    {/* Lady sign up */}
                </Text>
                <ProgressBar style={{ marginHorizontal: SPACING.x_large, borderRadius: 10 }} progress={progress == 0 ? 0.01 : progress} color={COLORS.error} />
            </View>
            <MotiView
                from={{
                    opacity: 0,
                    transform: [{ translateY: 40 }],
                }}
                animate={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                }}
                transition={{
                    type: 'timing',
                    duration: 400,
                }}
                style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', flex: 1, backgroundColor: COLORS.lightBlack, alignItems: 'center', justifyContent: 'center', padding: SPACING.medium }}>
                <View
                    style={{ flex: 1, maxWidth: '100%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' }}
                    onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
                >
                    {/* <View style={{ marginBottom: SPACING.small, marginTop: SPACING.large, marginHorizontal: SPACING.x_large, }}>
                        <ProgressBar progress={(index) / Object.keys(routes).length} color={COLORS.error} />
                    </View> */}

                    <TabView
                        renderTabBar={props => null}
                        swipeEnabled={false}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: contentWidth }}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: SPACING.x_large, marginVertical: SPACING.small, }}>
                        {index === 0 ? <View /> : <Button
                            labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#000' }}
                            style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0 }}
                            rippleColor="rgba(0,0,0,.1)"
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
                            {index === Object.keys(routes).length - 1 ? 'Sign up' : 'Next'}
                        </Button>
                    </View>
                </View>

                <ServicesPicker visible={servicesPickerVisible} setVisible={setServicesPickerVisible} services={data.services} onSelect={(service) => onMultiPicklistChange(service, 'services')} route={route} />
                <AddressSearch visible={addressSearchVisible} setVisible={setAddressSearchVisible} onSelect={onAddressSelect} route={route} />
            </MotiView>
        </View>
    )
}

export default LadySignup

const styles = StyleSheet.create({
    pageHeaderText: {
        //color: '#FFF', 
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
        // borderColor: 'rgba(255, 255, 255, 0.5)',
        // borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden'
    },
    tableHeaderText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.medium,
        color: '#FFF'
    },
    tableHeaderValue: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium,
        color: '#000'
    },
    column: {
        paddingHorizontal: SPACING.xx_small,
        height: normalize(45),
        justifyContent: 'center'
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