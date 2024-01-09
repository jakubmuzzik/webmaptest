import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, CURRENCIES } from '../constants'
import { normalize, generateThumbnailFromLocalURI } from '../utils'
import { ProgressBar, Button, TouchableRipple, IconButton, SegmentedButtons, TextInput as RNPaperTextInput, Switch, HelperText } from 'react-native-paper'
import HoverableInput from '../components/HoverableInput'
import DropdownSelect from '../components/DropdownSelect'
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5, EvilIcons } from '@expo/vector-icons'
import { TabView } from 'react-native-tab-view'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import {
    ESTABLISHMENT_TYPES
} from '../labels'
import { MotiView } from 'moti'
import * as ImagePicker from 'expo-image-picker'
import AddressSearch from '../components/modal/AddressSearch'
import Toast from 'react-native-toast-message'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { BlurView } from 'expo-blur'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const MAX_PHOTO_SIZE_MB = 5
const MAX_VIDEO_SIZE_MB = 10
const MAX_VIDEOS = 5
const MAX_PHOTOS = 15

const getDataType = (uri) => {
    const parts = uri.split(',')
    return parts[0].split('/')[0].split(':')[1]
}

const getFileSizeInMb = (uri) => {
    return (uri.length * (3 / 4) - 2) / (1024 * 1024)
}

const EstablishmentSignup = ({ }) => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secureTextEntry: true,
        confirmSecureTextEntry: true,
        establishmentType: '',
        address: '',
        hiddenAddress: false,
        description: '',
        workingHours: [{ day: 'monday', from: '', until: '', enabled: true }, { day: 'tuesday', from: '', until: '', enabled: true }, { day: 'wednesday', from: '', until: '', enabled: true }, { day: 'thursday', from: '', until: '', enabled: true }, { day: 'friday', from: '', until: '', enabled: true }, { day: 'saturday', from: '', until: '', enabled: true }, { day: 'sunday', from: '', until: '', enabled: true }],
        images: [null, null],
        videos: [null],
        phone: '',
        viber: false,
        whatsapp: false,
        telegram: false,
        website: '',
        agreed: ''
    })

    const [photosContentWidth, setPhotosContentWidth] = useState(normalize(800))

    const [showLoginInfoErrorMessages, setShowLoginInfoErrorMessages] = useState(false)
    const [showEstablishmentDetailsErrorMessages, setShowEstablishmentDetailsErrorMessages] = useState(false)
    const [showLocationErrorMessages, setShowLocationErrorMessages] = useState(false)
    const [showPhotosErrorMessages, setShowPhotosErrorMessages] = useState(false)

    const [servicesPickerVisible, setServicesPickerVisible] = useState(false)
    const [addressSearchVisible, setAddressSearchVisible] = useState(false)

    const [nextButtonIsLoading, setNextButtonIsLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const [routes] = useState([
        { key: '1. Login Information', index: 0 },
        { key: '2. Establishment Details', index: 1 },
        { key: '3. Address & Working hours', index: 2 },
        { key: '4. Upload Photos', index: 3 },
        { key: '5. Registration Completed', inde: 4 }
    ])

    const scrollYLoginInformation = useSharedValue(0)
    const scrollYEstablishmentDetails = useSharedValue(0)
    const scrollYSericesAndPricing = useSharedValue(0)
    const scrollYLocationAndAvailability = useSharedValue(0)
    const scrollYUploadPhotos = useSharedValue(0)
    const scrollYRegistrationCompleted = useSharedValue(0)

    const scrollHandler1 = useAnimatedScrollHandler((event) => {
        scrollYLoginInformation.value = event.contentOffset.y
    })
    const scrollHandler2 = useAnimatedScrollHandler((event) => {
        scrollYEstablishmentDetails.value = event.contentOffset.y
    })
    const scrollHandler3 = useAnimatedScrollHandler((event) => {
        scrollYLocationAndAvailability.value = event.contentOffset.y
    })
    const scrollHandler4 = useAnimatedScrollHandler((event) => {
        scrollYUploadPhotos.value = event.contentOffset.y
    })
    const scrollHandler5 = useAnimatedScrollHandler((event) => {
        scrollYRegistrationCompleted.value = event.contentOffset.y
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
            opacity: interpolate(scrollYEstablishmentDetails.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles3 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYLocationAndAvailability.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles4 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYUploadPhotos.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })
    const modalHeaderTextStyles5 = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollYRegistrationCompleted.value, [0, 30, 50], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

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

    const processEstablishmentDetailsPage = () => {
        paginageNext()
        return

        if (!data.dateOfBirth) {
            setShowEstablishmentDetailsErrorMessages(true)
            return
        }

        setShowEstablishmentDetailsErrorMessages(false)
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

    const processUploadPhotosPage = () => {
        paginageNext()
    }

    const onTermsOfServicePress = useCallback(() => {

    }, [])

    const onPrivacyPolicyPress = useCallback(() => {

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
        const { title, id, address, position } = value
        setData((data) => ({
            ...data,
            address: { title, id, ...address, ...position }
        }))
    }, [])

    const onSelectImagePress = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            //aspect: [4, 3],
            quality: 0.8,
        })

        if (!result.canceled) {
            try {
                const fileSizeMb = getFileSizeInMb(result.assets[0].uri)
                if (fileSizeMb > MAX_PHOTO_SIZE_MB) {
                    Toast.show({
                        type: 'error',
                        text1: 'File Size Error',
                        text2: `Maximum file size allowed is ${MAX_PHOTO_SIZE_MB}MB.`
                    })
                    return
                }

                const dataType = getDataType(result.assets[0].uri)
                if (dataType !== 'image') {
                    Toast.show({
                        type: 'error',
                        text1: 'Invalid File Type',
                        text2: `Please upload a supported file type.`
                    })
                    return
                }

                setData(d => {
                    d.images[index] = result.assets[0].uri
                    if (index > 0 && d.images.length < MAX_PHOTOS) {
                        d.images.push(null)
                    }
                    return { ...d }
                })
            } catch (e) {
                console.error(e)
            }
        }
    }

    const onSelectVideoPress = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            base64: true,
            quality: 0.8,
        })

        if (!result.canceled) {
            try {
                const fileSizeMb = getFileSizeInMb(result.assets[0].uri)
                if (fileSizeMb > MAX_VIDEO_SIZE_MB) {
                    Toast.show({
                        type: 'error',
                        text1: 'File Size Error',
                        text2: `Maximum file size allowed is ${MAX_VIDEO_SIZE_MB}MB.`
                    })
                    return
                }

                const dataType = getDataType(result.assets[0].uri)
                if (dataType !== 'video') {
                    Toast.show({
                        type: 'error',
                        text1: 'Invalid File Type',
                        text2: `Please upload a supported file type.`
                    })
                    return
                }

                const thumbnail = await generateThumbnailFromLocalURI(result.assets[0].uri, 0)

                setData(d => {
                    d.videos[index] = { thumbnail, video: result.assets[0].uri }
                    if (d.videos.length < MAX_VIDEOS) {
                        d.videos.push(null)
                    }
                    return { ...d }
                })
            } catch (e) {
                console.error(e)
            }
        }
    }

    const onDeleteImagePress = async (index) => {
        setData(d => {
            if (index > 0) {
                d.images.splice(index, 1)
            } else {
                d.images[index] = null
            }

            return { ...d }
        })
    }

    const onDeleteVideoPress = async (index) => {
        setData(d => {
            d.videos.splice(index, 1)

            return { ...d }
        })
    }

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
                return processEstablishmentDetailsPage()
            case 2:
                return processLocationAndAvailabilityPage()
            case 3:
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
                        {/* <HoverableInput
                            placeholder="Agency xxx"
                            label="Establishment Name"
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
                        /> */}
                        <HoverableInput
                            placeholder="agency@email.com"
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
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>

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

                        <View style={{ flexDirection: 'row', alignItems: 'center', flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}>
                            <BouncyCheckbox
                                style={{}}
                                disableBuiltInState
                                isChecked={data.agreed}
                                size={normalize(19)}
                                fillColor={data.agreed ? COLORS.red : COLORS.placeholder}
                                unfillColor="#FFFFFF"
                                iconStyle={{ borderRadius: 3 }}
                                innerIconStyle={{ borderWidth: 2, borderRadius: 3 }}
                                onPress={() => setData(data => ({ ...data, agreed: !data.agreed }))}
                            />
                            <Text style={{ fontSize: FONT_SIZES.medium, fontFamily: FONTS.medium }}>
                                I agree to Ladiesforfun <Text style={{ color: 'blue' }} onPress={onTermsOfServicePress}>Terms of Service</Text> and <Text style={{ color: 'blue' }} onPress={onPrivacyPolicyPress}>Privacy Policy</Text>.
                            </Text>
                        </View>
                    </View>

                    {/* <View style={{ flexDirection: 'row', marginHorizontal: SPACING.x_large, marginTop: SPACING.small }}>
                        <Text style={{ fontSize: FONT_SIZES.medium, fontFamily: FONTS.medium }}>
                            By countinuing, you agree to Ladiesforfun <Text style={{ color: 'blue' }} onPress={onTermsOfServicePress}>Terms of Service</Text> and <Text style={{ color: 'blue' }} onPress={onPrivacyPolicyPress}>Privacy Policy</Text>.
                        </Text>
                    </View> */}
                </Animated.ScrollView>
            </>
        )
    }, [showLocationErrorMessages, data, contentWidth])

    const renderEstablishmentDetails = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles2}>2. Personal Details</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles2]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler2} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={styles.pageHeaderText}>
                        2. Establishment Details
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large }}>
                        <HoverableInput
                            placeholder="Agency xxx"
                            label="Establishment Name"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large, }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.name}
                            setText={(text) => onValueChange(text, 'name')}
                            //leftIconName="badge-account-outline"
                            errorMessage={showEstablishmentDetailsErrorMessages && !data.name ? 'Enter your Name' : undefined}
                        />

                        <DropdownSelect
                            values={ESTABLISHMENT_TYPES}
                            offsetX={contentWidth * i}
                            placeholder="Select establishment type"
                            label="Establishment type"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.establishmentType}
                            setText={(text) => onValueChange(text, 'establishmentType')}
                            rightIconName='chevron-down'
                            errorMessage={showEstablishmentDetailsErrorMessages && !data.establishmentType ? 'Select the establishment type' : undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', marginLeft: SPACING.x_large }}>
                        <HoverableInput
                            placeholder="www.website.com"
                            label="Website"
                            borderColor={COLORS.placeholder}
                            hoveredBorderColor={COLORS.red}
                            textColor='#000'
                            containerStyle={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}
                            textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                            labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                            placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                            text={data.website}
                            setText={(text) => onValueChange(text, 'website')}
                        />

                        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginTop: SPACING.xxx_small, marginRight: SPACING.x_large }}>
                            <HoverableInput
                                placeholder="+420 777 666 777"
                                label="Phone number"
                                borderColor={COLORS.placeholder}
                                hoveredBorderColor={COLORS.red}
                                textColor='#000'

                                textStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#000' }}
                                labelStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}
                                placeholderStyle={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.placeholder }}
                                text={data.phone}
                                setText={(text) => onValueChange(text, 'phone')}
                                errorMessage={showEstablishmentDetailsErrorMessages && !data.phone ? 'Enter your phone' : undefined}
                            />

                            <View style={{ flexDirection: 'row', marginTop: SPACING.xx_small }}>
                                <BouncyCheckbox
                                    style={{ marginRight: SPACING.xx_small }}
                                    disableBuiltInState
                                    isChecked={data.whatsapp}
                                    size={normalize(19)}
                                    fillColor={data.whatsapp ? 'green' : COLORS.placeholder}
                                    unfillColor="#FFFFFF"
                                    iconStyle={{ borderRadius: 3 }}
                                    innerIconStyle={{ borderWidth: 2, borderRadius: 3 }}
                                    onPress={() => setData(data => ({ ...data, whatsapp: !data.whatsapp }))}
                                    textComponent={
                                        <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#108a0c', borderRadius: '50%', marginLeft: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesome5 name="whatsapp" size={18} color="white" />
                                        </View>
                                    }
                                />
                                <BouncyCheckbox
                                    style={{ marginRight: SPACING.xx_small }}
                                    disableBuiltInState
                                    isChecked={data.viber}
                                    size={normalize(19)}
                                    fillColor={data.viber ? 'green' : COLORS.placeholder}
                                    unfillColor="#FFFFFF"
                                    iconStyle={{ borderRadius: 3 }}
                                    innerIconStyle={{ borderWidth: 2, borderRadius: 3 }}
                                    onPress={() => setData(data => ({ ...data, viber: !data.viber }))}
                                    textComponent={
                                        <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#7d3daf', borderRadius: '50%', marginLeft: SPACING.xxx_small, alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesome5 name="viber" size={18} color="white" />
                                        </View>
                                    }
                                />
                                <BouncyCheckbox
                                    disableBuiltInState
                                    isChecked={data.telegram}
                                    size={normalize(19)}
                                    fillColor={data.telegram ? 'green' : COLORS.placeholder}
                                    unfillColor="#FFFFFF"
                                    iconStyle={{ borderRadius: 3 }}
                                    innerIconStyle={{ borderWidth: 2, borderRadius: 3 }}
                                    onPress={() => setData(data => ({ ...data, telegram: !data.telegram }))}
                                    textComponent={
                                        <View style={{ padding: 5, width: 28, height: 28, backgroundColor: '#38a5e4', borderRadius: 30, alignItems: 'center', marginLeft: SPACING.xxx_small, justifyContent: 'center' }}>
                                            <EvilIcons name="sc-telegram" size={22} color="white" />
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: SPACING.x_large }}>
                        <HoverableInput
                            placeholder="Describe your establishment"
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
                            errorMessage={showEstablishmentDetailsErrorMessages && !data.description ? 'Desribe yourself' : undefined}
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
    }, [showEstablishmentDetailsErrorMessages, data, contentWidth])

    const renderLocationAndAvailability = useCallback((i) => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles3}>3. Address & Working Hours</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles3]} />
                <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler3} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={[styles.pageHeaderText, { marginBottom: SPACING.small - 8 }]}>
                        3. Address & Working Hours
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.x_large, alignItems: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={onSearchAddressPress}
                            style={{ flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginRight: SPACING.x_large, marginTop: SPACING.xx_small }}>
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
                                text={data.address?.addressTitle}
                                leftIconName='map-marker-outline'
                                errorMessage={showLocationErrorMessages && !data.address?.addressTitle ? 'Enter your address' : undefined}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xx_small, flexGrow: 1, flexShrink: 1, flexBasis: (contentWidth / 2) - SPACING.x_large * 2, minWidth: 220, marginRight: SPACING.x_large, marginTop: SPACING.xx_small }}>
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

                    <View style={[styles.table, { marginHorizontal: SPACING.x_large, marginTop: SPACING.small, }]}>
                        <View style={{ flexShrink: 1 }}>
                            <View style={[styles.column, { backgroundColor: COLORS.lightGrey }]}>
                                <Text style={styles.tableHeaderText}>Day</Text>
                            </View>
                            <View style={[styles.column, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[0].enabled ? 'none' : 'line-through' }]}>Monday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[1].enabled ? 'none' : 'line-through' }]}>Tuesday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[2].enabled ? 'none' : 'line-through' }]}>Wednesday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[3].enabled ? 'none' : 'line-through' }]}>Thursday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[4].enabled ? 'none' : 'line-through' }]}>Friday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[5].enabled ? 'none' : 'line-through' }]}>Saturday</Text>
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
                                <Text numberOfLines={1} style={[styles.tableHeaderValue, { textDecorationLine: data.workingHours[6].enabled ? 'none' : 'line-through' }]}>Sunday</Text>
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
                    <Animated.Text style={modalHeaderTextStyles4}>4. Photos & Videos</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles4]} />
                <Animated.ScrollView
                    onContentSizeChange={(contentWidth) => setPhotosContentWidth(contentWidth)}
                    scrollEventThrottle={1}
                    onScroll={scrollHandler4}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large }}>
                    <Text style={[styles.pageHeaderText, { marginBottom: SPACING.small + 8 }]}>
                        4. Photos & Videos
                    </Text>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large }}>
                        Add cover photo
                    </Text>

                    <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2, marginHorizontal: SPACING.x_large }}>
                        This photos will be prominently displayed on your profile page
                    </Text>

                    <View style={{ marginTop: SPACING.x_small, flexDirection: 'row', marginHorizontal: SPACING.x_large }}>
                        {data.images[0] ?
                            <React.Fragment>
                                <Image
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                        aspectRatio: 16 / 9,
                                        borderWidth: 1,
                                        borderColor: 'rgba(28,27,31,0.16)'
                                    }}
                                    source={{ uri: data.images[0] }}
                                    placeholder={blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <IconButton
                                    style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: COLORS.grey + 'B3' }}
                                    icon="delete-outline"
                                    iconColor='white'
                                    size={normalize(20)}
                                    onPress={() => onDeleteImagePress(0)}
                                />
                            </React.Fragment> :
                            <TouchableRipple
                                onPress={() => onSelectImagePress(0)}
                                style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', flex: 1, borderRadius: 10, aspectRatio: 16 / 9 }}
                            >
                                <Ionicons name="image-outline" size={normalize(30)} color="black" />
                            </TouchableRipple>
                        }
                    </View>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, marginTop: SPACING.medium }}>
                        Add additional photos
                    </Text>
                    <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2, marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small }}>
                        Visitors can explore these photos by clicking the 'View All' button on your profile
                    </Text>

                    <View style={{ flexDirection: 'row', marginLeft: SPACING.x_large, marginRight: SPACING.x_large - SPACING.xxx_small, flexWrap: 'wrap' }}>
                        {data.images.slice(1).map((image, index) =>
                            <View key={image ?? Math.random()} style={{ width: ((photosContentWidth - (SPACING.x_large * 2) - (SPACING.xxx_small * 2)) / 3), marginRight: SPACING.xxx_small, marginBottom: SPACING.xxx_small }}>
                                {image ?
                                    <ImageBackground
                                        source={{ uri: image }}
                                        style={StyleSheet.absoluteFillObject}
                                        imageStyle={{ opacity: 0.7, borderRadius: 10, borderColor: 'rgba(28,27,31,0.16)', borderWidth: 1, overflow: 'hidden' }}
                                        resizeMode='cover'
                                    >
                                        <BlurView intensity={50} style={{ borderRadius: 10, borderColor: 'rgba(28,27,31,0.16)', borderWidth: 1, }}>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 10,
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
                                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: COLORS.grey + 'B3' }}
                                                icon="delete-outline"
                                                iconColor='white'
                                                size={normalize(20)}
                                                onPress={() => onDeleteImagePress(index + 1)}
                                            />
                                        </BlurView>
                                    </ImageBackground> :
                                    <TouchableRipple
                                        onPress={() => onSelectImagePress(index + 1)}
                                        style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', flex: 1, borderRadius: 10, aspectRatio: 1 / 1 }}
                                    >
                                        <>
                                            <AntDesign name="plus" size={normalize(30)} color="black" />
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>
                                                Add more
                                            </Text>
                                            {/* <Text style={{ fontFamily: FONTS.light, fontSize: FONT_SIZES.small }}>
                                                Max file size: <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>{MAX_PHOTO_SIZE_MB}MB</Text>
                                            </Text> */}
                                        </>
                                    </TouchableRipple>
                                }
                            </View>)}
                    </View>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, marginTop: SPACING.medium - SPACING.xxx_small, }}>
                        Add videos
                    </Text>
                    <Text style={{ color: COLORS.grey, fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium, marginTop: 2, marginHorizontal: SPACING.x_large, marginBottom: SPACING.x_small }}>
                        Visitors can explore these videos by clicking the 'View All' button on your profile
                    </Text>

                    <View style={{ flexDirection: 'row', marginLeft: SPACING.x_large, marginRight: SPACING.x_large - SPACING.xxx_small, flexWrap: 'wrap' }}>
                        {data.videos.map((video, index) =>
                            <View key={video ?? Math.random()} style={{ width: ((photosContentWidth - (SPACING.x_large * 2) - (SPACING.xxx_small * 2)) / 3), marginRight: SPACING.xxx_small, marginBottom: SPACING.xxx_small }}>
                                {video ?
                                    <React.Fragment>
                                        <Image
                                            style={{
                                                flex: 1,
                                                borderRadius: 10,
                                                aspectRatio: 1 / 1,
                                                borderWidth: 1,
                                                borderColor: 'rgba(28,27,31,0.16)'
                                            }}
                                            source={{ uri: video.thumbnail }}
                                            placeholder={blurhash}
                                            resizeMode="cover"
                                            transition={200}
                                        />
                                        <IconButton
                                            style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: COLORS.grey + 'B3' }}
                                            icon="delete-outline"
                                            iconColor='white'
                                            size={normalize(20)}
                                            onPress={() => onDeleteVideoPress(index)}
                                        />
                                    </React.Fragment> :
                                    <TouchableRipple
                                        onPress={() => onSelectVideoPress(index)}
                                        style={{ backgroundColor: 'rgba(28,27,31,0.16)', alignItems: 'center', justifyContent: 'center', flex: 1, borderRadius: 10, aspectRatio: 1 / 1 }}
                                    >
                                        <>
                                            <AntDesign name="videocamera" size={normalize(30)} color="black" />
                                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>
                                                Add video
                                            </Text>
                                            {/* <Text style={{ fontFamily: FONTS.light, fontSize: FONT_SIZES.small }}>
                                                Max file size: <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small }}>{MAX_VIDEO_SIZE_MB}MB</Text>
                                            </Text> */}
                                        </>
                                    </TouchableRipple>
                                }
                            </View>)}
                    </View>
                </Animated.ScrollView>
            </>

        )
    }, [data, showPhotosErrorMessages, contentWidth, photosContentWidth])

    const renderRegistrationCompleted = useCallback(() => {
        return (
            <>
                <View style={styles.modal__header}>
                    <Animated.Text style={modalHeaderTextStyles5}>Registration completed</Animated.Text>
                </View>
                <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles5]} />
                <Animated.ScrollView
                    scrollEventThrottle={1}
                    onScroll={scrollHandler5}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: SPACING.small, paddingTop: SPACING.xxxxx_large, alignItems: 'center' }}
                >
                    <Text style={[styles.pageHeaderText, { textAlign: 'center' }]}>
                        Registration completed
                    </Text>

                    <View style={{ height: 100, width: 100, marginVertical: SPACING.medium }}>
                        {index === 4 && <MotiView
                            style={{ flex: 1 }}
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
                                source={require('../assets/completed.svg')}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </MotiView>}
                    </View>

                    <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center', marginBottom: SPACING.small }}>
                        Your Establishment has been submitted for review!
                    </Text>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center' }}>
                        Our team will review your establishment shortly, and once approved, you'll receive a confirmation email to: {data.email}
                    </Text>

                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, marginHorizontal: SPACING.x_large, textAlign: 'center', marginTop: SPACING.xx_small }}>
                        In the meantime you can log in and start adding your profiles of your ladies.
                    </Text>
                </Animated.ScrollView>
            </>
        )
    }, [index, data])

    const renderScene = ({ route }) => {
        switch (route.key) {
            case '1. Login Information':
                return renderLoginInformation(route.index)
            case '2. Establishment Details':
                return renderEstablishmentDetails(route.index)
            case '3. Address & Working hours':
                return renderLocationAndAvailability(route.index)
            case '4. Upload Photos':
                return renderUploadPhotos(route.index)
            case '5. Registration Completed':
                return renderRegistrationCompleted()
        }
    }

    const progress = (index) / (Object.keys(routes).length - 1)

    return (
        <View style={{ height: '100%', backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', }}>
                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, marginHorizontal: SPACING.medium, marginVertical: SPACING.small, color: '#FFF' }}>
                    Establishment sign up
                </Text>
                <ProgressBar style={{ marginHorizontal: SPACING.medium, borderRadius: 10 }} progress={progress == 0 ? 0.01 : progress} color={COLORS.error} />
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

                    {index !== 4 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: SPACING.x_large, marginVertical: SPACING.small, }}>
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
                            buttonColor={index === Object.keys(routes).length - 2 ? COLORS.red : COLORS.lightBlack}
                            mode="contained"
                            onPress={onNextPress}
                            loading={nextButtonIsLoading}
                        >
                            {index === Object.keys(routes).length - 2 ? 'Sign up' : 'Next'}
                        </Button>
                    </View>}
                </View>

                <AddressSearch visible={addressSearchVisible} setVisible={setAddressSearchVisible} onSelect={onAddressSelect} />
            </MotiView>
        </View>
    )
}

export default EstablishmentSignup

const styles = StyleSheet.create({
    pageHeaderText: {
        //color: '#FFF', 
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.h3,
        marginHorizontal: SPACING.x_large,
        marginBottom: SPACING.small
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