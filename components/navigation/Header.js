import React, { useState, useMemo, useCallback, useRef, memo, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    useWindowDimensions
} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {
    COLORS,
    FONTS,
    FONT_SIZES,
    SPACING,
    DEFAULT_LANGUAGE,
    SMALL_SCREEN_THRESHOLD,
    LARGE_SCREEN_THRESHOLD,
    SUPPORTED_LANGUAGES
} from '../../constants'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import {
    CZECH_CITIES,
    SEARCH,
    SIGN_IN,
    SIGN_UP,
    translateLabels
} from '../../labels'
import { stripEmptyParams, getParam } from '../../utils'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import HoverableView from '../HoverableView'
import { normalize } from '../../utils'
import Categories from './Categories'
import Login from '../modal/Login'
import Signup from '../modal/Signup'

import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'

const SCREENS_WITH_CITY_SELECTION = [
    'Esc', 'Pri', 'Mas', 'Clu', 'NotFound', 'Explore'
]

const Header = ({ }) => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), ''),
        city: getParam(CZECH_CITIES, searchParams.get('city'), '')
    }), [searchParams])

    const labels = useMemo(() => translateLabels(params.language, [
        SEARCH,
        SIGN_IN,
        SIGN_UP
    ]), [params.language])

    const [search, setSearch] = useState('')
    const [searchBorderColor, setSearchBorderColor] = useState('transparent')
    const [userDropdownVisible, setUserDropdownVisible] = useState(false)
    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false)
    const [dropdownTop, setDropdownTop] = useState(-1000)
    const [languageDropdownRight, setLanguageDropdownRight] = useState(-1000)
    const [loginVisible, setLoginVisible] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(false)

    const userDropdownRef = useRef()
    const userDropdownModalRef = useRef()
    const languageDropdownRef = useRef()
    const languageDropdownModalRef = useRef()
    const loginButtonsRef = useRef()

    //close modals when changing language, city etc...
    useEffect(() => {
        setLanguageDropdownVisible(false)
    }, [searchParams])

    const { width } = useWindowDimensions()
    const isSmallScreen = width < SMALL_SCREEN_THRESHOLD
    const isLargeScreen = width >= LARGE_SCREEN_THRESHOLD

    const onSearchSubmit = useCallback(() => {
        //navigate to search screen
    }, [search])

    const toggleUserDropdown = useCallback(() => {
        userDropdownVisible ? setUserDropdownVisible(false) : openUserDropdown()
    }, [userDropdownVisible])

    const toggleLanguageDropdown = useCallback(() => {
        languageDropdownVisible ? setLanguageDropdownRight(false) : openLanguageDropdown()
    }, [languageDropdownVisible, isLargeScreen, isSmallScreen])

    const openLanguageDropdown = () => {
        languageDropdownRef.current.measureLayout(
            languageDropdownModalRef.current,
            (left, top, width, height) => {
                setDropdownTop(top + height + 20)
            },
        )

        if (isLargeScreen) {
            loginButtonsRef.current.measure((_fx, _fy, _w, h, _px, py) => {
                setLanguageDropdownRight(_w + SPACING.page_horizontal + SPACING.xx_small)
            })
        } else if (userDropdownRef.current) {
            userDropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
                setLanguageDropdownRight(_w + SPACING.page_horizontal + SPACING.xx_small)
            })
        } else {
            setLanguageDropdownRight(SPACING.page_horizontal)
        }

        setLanguageDropdownVisible(true)
    }

    const openUserDropdown = () => {
        userDropdownRef.current.measureLayout(
            userDropdownModalRef.current,
            (left, top, width, height) => {
                setDropdownTop(top + height + 20)
            },
        )
        setUserDropdownVisible(true)
    }

    const onLoginPress = () => {
        setSignUpVisible(false)
        setLoginVisible(true)
        if (userDropdownVisible) {
            setUserDropdownVisible(false)
        }
    }

    const onSignUpPress = () => {
        setLoginVisible(false)
        setSignUpVisible(true)
        if (userDropdownVisible) {
            setUserDropdownVisible(false)
        }
    }

    const renderUserDropdown = () => {
        return (
            <Modal visible={userDropdownVisible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setUserDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <MotiView
                            from={{
                                opacity: 0,
                                transform: [{ scaleY: 0.8 }, { translateY: -10 }],
                            }}
                            animate={{
                                opacity: 1,
                                transform: [{ scaleY: 1 }, { translateY: 0 }],
                            }}
                            transition={{
                                type: 'timing',
                                duration: 100,
                            }}
                            style={[styles.dropdown, { top: dropdownTop }]}
                        >
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite} style={{ overflow: 'hidden' }}>
                                <TouchableOpacity onPress={onSignUpPress} style={{ padding: SPACING.xx_small, margin: SPACING.xxx_small, backgroundColor: COLORS.red, borderRadius: 7, overflow: 'hidden' }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                                        {labels.SIGN_UP}
                                    </Text>
                                </TouchableOpacity>
                            </HoverableView>
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite}>
                                <TouchableOpacity onPress={onLoginPress} style={{ padding: SPACING.xx_small }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                        {labels.SIGN_IN}
                                    </Text>
                                </TouchableOpacity>
                            </HoverableView>

                            {isSmallScreen && (
                                <>
                                    <View style={{ marginVertical: 2, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.2)' }} />

                                    <HoverableView style={{ flexDirection: 'row', padding: SPACING.xx_small }} hoveredBackgroundColor={COLORS.hoveredWhite}>
                                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, opacity: 0.8 }}>
                                            Language:&nbsp;
                                        </Text>
                                        <Picker
                                            selectedValue={params.language.length ? params.language : DEFAULT_LANGUAGE}
                                            onValueChange={(itemValue, itemIndex) => navigate({
                                                pathname: location.pathname,
                                                search: new URLSearchParams(stripEmptyParams({ ...params, language: itemValue })).toString()
                                            })
                                            }
                                            fontFamily={FONTS.bold}
                                            style={{ borderWidth: 0, fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, outlineStyle: 'none' }}
                                        >
                                            <Picker.Item label="Čeština" value="cs" />
                                            <Picker.Item label="English" value="en" />
                                        </Picker>
                                    </HoverableView>
                                </>
                            )}
                        </MotiView>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }

    const renderSeoContent = () => (
        <>
            <Link to={{ pathname: location.pathname, search: new URLSearchParams(stripEmptyParams({ ...params, language: 'cs' })).toString() }} />
            <Link to={{ pathname: location.pathname, search: new URLSearchParams(stripEmptyParams({ ...params, language: 'en' })).toString() }} />
            {/* {CZECH_CITIES.map(city => <Link key={city} to={{ pathname: location.pathname, search: new URLSearchParams(stripEmptyParams({ ...params, city })).toString() }} />)} */}
        </>
    )

    const rendeLanguageDropdown = useCallback(() => {
        return (
            <Modal ref={languageDropdownModalRef} visible={languageDropdownVisible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setLanguageDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <MotiView
                            from={{
                                opacity: 0,
                                transform: [{ scaleY: 0.8 }, { translateY: -10 }],
                            }}
                            animate={{
                                opacity: 1,
                                transform: [{ scaleY: 1 }, { translateY: 0 }],
                            }}
                            transition={{
                                type: 'timing',
                                duration: 100,
                            }}
                            style={[styles.dropdown, { top: dropdownTop, right: languageDropdownRight, marginRight: 0, overflow: 'hidden' }]}
                        >
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite}>
                                <Link style={{ textDecoration: 'none' }} to={{ pathname: location.pathname, search: new URLSearchParams(stripEmptyParams({ ...params, language: 'cs' })).toString() }}>
                                    <View style={{ padding: SPACING.xx_small, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            resizeMode='contain'
                                            source={require('../../assets/images/flags/cz.png')}
                                            style={{
                                                width: SPACING.small,
                                                height: SPACING.x_small,
                                                marginRight: SPACING.xx_small,
                                            }}
                                        />
                                        <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium }}>Čeština</Text>
                                    </View>
                                </Link>
                            </HoverableView>
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite}>
                                <Link style={{ textDecoration: 'none' }} to={{ pathname: location.pathname, search: new URLSearchParams(stripEmptyParams({ ...params, language: 'en' })).toString() }} >
                                    <View style={{ padding: SPACING.xx_small, flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            resizeMode='contain'
                                            source={require('../../assets/images/flags/us.png')}
                                            style={{
                                                width: SPACING.small,
                                                height: SPACING.x_small,
                                                marginRight: SPACING.xx_small,
                                            }}
                                        />
                                        <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium }}>English</Text>
                                    </View>
                                </Link>
                            </HoverableView>
                        </MotiView>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }, [languageDropdownVisible, languageDropdownRight, dropdownTop, userDropdownRef, languageDropdownModalRef, params.language])

    const renderRightHeader = useCallback(() => {
        return isSmallScreen ? (
            <>
                <HoverableView style={{ ...styles.searchWrapper, borderColor: searchBorderColor, flexGrow: 1, flexShrink: 1 }} hoveredBackgroundColor={COLORS.hoveredLightGrey} backgroundColor={COLORS.lightGrey}>
                    <Ionicons name="search" size={normalize(20)} color="white" />
                    <TextInput
                        style={styles.search}
                        onChangeText={setSearch}
                        value={search}
                        placeholder={labels.SEARCH}
                        placeholderTextColor={COLORS.placeholder}
                        onBlur={() => setSearchBorderColor('transparent')}
                        onFocus={() => setSearchBorderColor(COLORS.red)}
                        onSubmitEditing={onSearchSubmit}
                    />
                    <Ionicons onPress={() => setSearch('')} style={{ opacity: search ? '1' : '0' }} name="close" size={normalize(20)} color="white" />
                </HoverableView>
                <HoverableView hoveredBackgroundColor={COLORS.hoveredLightGrey} backgroundColor={COLORS.lightGrey} style={{ marginLeft: SPACING.small, borderRadius: 20, justifyContent: 'center' }}>
                    <TouchableOpacity ref={userDropdownRef} onPress={toggleUserDropdown} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.xxx_small, paddingRight: SPACING.xx_small }}>
                        <Ionicons name="person-circle-outline" size={normalize(28)} color="white" />
                        <MaterialIcons style={{ paddingLeft: SPACING.xxx_small }} name="menu" size={normalize(20)} color="white" />
                    </TouchableOpacity>
                </HoverableView>
            </>
        ) : (
            <>
                <HoverableView hoveredOpacity={0.8} style={{ borderRadius: 20, justifyContent: 'center', marginRight: SPACING.xx_small }}>
                    <TouchableOpacity ref={languageDropdownRef} onPress={toggleLanguageDropdown} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.xxx_small, paddingRight: SPACING.xx_small }}>
                        <MaterialIcons style={{ paddingRight: SPACING.xxx_small }} name="language" size={normalize(20)} color="white" />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>{params.language ? params.language.toUpperCase() : DEFAULT_LANGUAGE.toUpperCase()}</Text>
                        <MaterialIcons style={{ paddingLeft: SPACING.xxx_small }} name="keyboard-arrow-down" size={normalize(20)} color='#FFF' />
                    </TouchableOpacity>
                </HoverableView>
                {isLargeScreen ? (
                    <View style={{ flexDirection: 'row' }} ref={loginButtonsRef}>
                        <HoverableView hoveredBackgroundColor={COLORS.red} backgroundColor={COLORS.red} hoveredOpacity={0.8} style={{ borderRadius: 10, justifyContent: 'center', marginRight: SPACING.xx_small, overflow: 'hidden' }}>
                            <LinearGradient
                                colors={[COLORS.red, COLORS.darkRed]}
                                style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' }}
                            //start={{ x: 0, y: 0.5 }}
                            //end={{ x: 1, y: 0.5 }}
                            />
                            <TouchableOpacity onPress={onSignUpPress} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.x_small, paddingVertical: SPACING.xx_small }}>
                                <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium }}>Sign up</Text>
                            </TouchableOpacity>
                        </HoverableView>
                        <HoverableView hoveredOpacity={0.8} style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={onLoginPress} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.x_small, paddingVertical: SPACING.xx_small }}>
                                <Text style={{ color: '#FFF', fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>Log in</Text>
                            </TouchableOpacity>
                        </HoverableView>
                    </View>
                ) : (
                    <HoverableView hoveredBackgroundColor={COLORS.hoveredLightGrey} backgroundColor={COLORS.lightGrey} style={{ borderRadius: 20, justifyContent: 'center' }}>
                        <TouchableOpacity ref={userDropdownRef} onPress={toggleUserDropdown} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.xxx_small, paddingRight: SPACING.xx_small }}>
                            <Ionicons name="person-circle-outline" size={normalize(28)} color="white" />
                            <MaterialIcons style={{ paddingLeft: SPACING.xxx_small }} name="menu" size={normalize(20)} color="white" />
                        </TouchableOpacity>
                    </HoverableView>
                )}
            </>
        )
    }, [isSmallScreen, isLargeScreen, search, params.language, searchBorderColor, languageDropdownVisible, userDropdownVisible])

    const renderLeftHeader = () => (
        <>
            <View
                style={{ height: normalize(50), justifyContent: 'center', marginRight: SPACING.x_small }}
            >
                <Link to={{ pathname: '/', search: new URLSearchParams(stripEmptyParams(params)).toString() }}>
                    <Image
                        resizeMode='contain'
                        source={require('../../assets/images/logo-header.png')}
                        style={{
                            height: normalize(32),
                            width: normalize(102)
                        }}
                    />
                </Link>
            </View>
        </>
    )

    return (
        <>
            {/* <View style={{ width: '100%', height: normalize(70) + (SCREENS_WITH_CITY_SELECTION.includes(route.name) ? normalize(70) : 0), backgroundColor: COLORS.lightBlack }}> */}
            {/* <View style={{ position: 'fixed', width: '100%', flexDirection: 'column', backgroundColor: COLORS.lightBlack }}> */}
                <View style={isSmallScreen ? styles.headerSmall : styles.headerLarge}>
                    <View style={isSmallScreen ? styles.headerLeftSmall : styles.headerLeftLarge}>
                        {renderLeftHeader()}
                    </View>
                    {!isSmallScreen && <View style={styles.headerMiddle}>
                        <HoverableView style={{ ...styles.searchWrapper, borderColor: searchBorderColor }} hoveredBackgroundColor={COLORS.hoveredLightGrey} backgroundColor={COLORS.lightGrey}>
                            <Ionicons name="search" size={normalize(20)} color="white" />
                            <TextInput
                                style={styles.search}
                                onChangeText={setSearch}
                                value={search}
                                placeholder={labels.SEARCH}
                                placeholderTextColor={COLORS.placeholder}
                                onBlur={() => setSearchBorderColor('transparent')}
                                onFocus={() => setSearchBorderColor(COLORS.red)}
                                onSubmitEditing={onSearchSubmit}
                            />
                            <Ionicons onPress={() => setSearch('')} style={{ opacity: search ? '1' : '0' }} name="close" size={normalize(20)} color="white" />
                        </HoverableView>
                    </View>}
                    <View style={isSmallScreen ? styles.headerRightSmall : styles.headerRightLarge}>
                        {renderRightHeader()}
                        {rendeLanguageDropdown()}
                        {renderUserDropdown()}
                    </View>

                    {renderSeoContent()}
                </View>

                {/* {SCREENS_WITH_CITY_SELECTION.includes(route.name) && <Categories navigation={navigation} route={route} />} */}
            {/* </View> */}

            <Login visible={loginVisible} setVisible={setLoginVisible} onSignUpPress={onSignUpPress} />
            <Signup visible={signUpVisible} setVisible={setSignUpVisible} onLoginPress={onLoginPress} />
        </>
    )
}

export default memo(Header)

const styles = StyleSheet.create({
    headerSmall: {
        //position: 'fixed',
        width: '100%',
        //height: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.page_horizontal,
        backgroundColor: COLORS.grey,
        height: normalize(70)
    },
    headerLarge: {
        //position: 'fixed',
        width: '100%',
        //height: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.page_horizontal,
        paddingVertical: SPACING.x_small,
        backgroundColor: COLORS.grey,
        height: normalize(70)
    },
    headerLeftSmall: {
        flexGrow: 0,
        flexDirection: 'row'
    },
    headerRightSmall: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    headerLeftLarge: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    headerMiddle: {
        flex: 1,
    },
    headerRightLarge: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    searchWrapper: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        paddingHorizontal: SPACING.x_small,
        overflow: 'hidden'
    },
    search: {
        flex: 1,
        padding: SPACING.xx_small,
        borderRadius: 20,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,
        outlineStyle: 'none',
        color: '#FFF',
        minWidth: 30
    },
    citySearch: {
        flex: 1,
        padding: SPACING.xx_small,
        borderRadius: 20,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,
        outlineStyle: 'none',
        color: '#000'
    },
    locationWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationWrapper__text: {
        flexDirection: 'column'
    },
    locationHeader: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.medium,
        color: '#FFF'
    },
    locationValue: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.medium,
        color: '#FFF'
    },
    modal__header: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: normalize(55),
        backgroundColor: '#FFF',
        zIndex: 2,
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
        zIndex: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5
    },
    countrySection: {
        marginVertical: SPACING.xx_small,
        flexDirection: 'row',
        alignItems: 'center'
    },
    countrySection__text: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZES.large
    },
    countrySection__image: {
        width: SPACING.small,
        height: SPACING.x_small,
        marginRight: SPACING.xx_small,
        marginLeft: SPACING.small
    },
    searchBar_input: {
        fontFamily: FONTS.light,
        fontSize: FONT_SIZES.medium,
    },
    searchBar_container: {
        backgroundColor: 'transparent'
    },
    dropdownOverlay: {
        width: '100%',
        height: '100%',
        cursor: 'default',
        alignItems: 'flex-end',
    },
    dropdown: {
        position: 'absolute',
        minWidth: normalize(100),
        backgroundColor: '#fff',
        marginRight: SPACING.page_horizontal,
        borderRadius: 10,
        paddingVertical: SPACING.xxx_small,
        shadowColor: "#000",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10.62,
        elevation: 8,
        overflow: 'hidden'
    }
})