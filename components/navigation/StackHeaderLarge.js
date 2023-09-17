import React, { useState, useMemo, useCallback, useRef, memo } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from 'react-native'
import { useLinkProps } from '@react-navigation/native'
import { COLORS, FONTS, FONT_SIZES, DEFAULT_CITY, SPACING, DEFAULT_LANGUAGE} from '../../constants'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { CZECH_CITIES, CZECH, CITY, SELECT_CITY, SEARCH, SIGN_IN, SIGN_UP, translateLabels } from '../../labels'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated'
import HoverableView from '../HoverableView'
import RenderCity from '../list/RenderCity'
import { normalize } from '../../utils'

const logoNav = {
    screen: 'Main'
}

const StackHeaderLarge = ({ language, navigation }) => {
    const labels = useMemo(() => translateLabels(language, [
        CZECH,
        CITY,
        SELECT_CITY,
        SEARCH,
        SIGN_IN,
        SIGN_UP
    ]), [language])

    const { onPress: onLogoPress, ...logoNavProps } = useLinkProps({ to: logoNav })

    const [search, setSearch] = useState('')
    const [citySearch, setCitySearch] = useState('')
    const [searchBorderColor, setSearchBorderColor] = useState('transparent')
    const [searchCityBorderColor, setSearchCityBorderColor] = useState(COLORS.placeholder) 
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
    const [userDropdownVisible, setUserDropdownVisible] = useState(false)
    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false)
    const [dropdownTop, setDropdownTop] = useState(-1000)
    const [languageDropdownRight, setLanguageDropdownRight] = useState(-1000)

    const filteredCitiesRef = useRef([...CZECH_CITIES])
    const userDropdownRef = useRef()
    const languageDropdownRef = useRef()

    const scrollY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const modalHeaderTextStyles = useAnimatedStyle(() => {
        return {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large,
            opacity: interpolate(scrollY.value, [0, 60, 70], [0, 0.8, 1], Extrapolation.CLAMP),
        }
    })

    const onSelectCity = useCallback((city) => {
        setLocationModalVisible(false)
        setSelectedCity(city)
    }, [])

    const onCitySearch = useCallback((search) => {
        filteredCitiesRef.current = search ? [...CZECH_CITIES].filter(city => city.toLowerCase().includes(citySearch.toLowerCase())) : [...CZECH_CITIES]
        setCitySearch(search)
    }, [filteredCitiesRef.current])

    const onLocationModalClose = () => {
        setLocationModalVisible(false)
    }

    const onSearchSubmit = useCallback(() => {
        //navigate to search screen
    }, [search]) 

    const toggleUserDropdown = useCallback(() => {
        userDropdownVisible ? setUserDropdownVisible(false) : openUserDropdown()
    }, [userDropdownVisible])

    const toggleLanguageDropdown = useCallback(() => {
        languageDropdownVisible ? setLanguageDropdownRight(false) : openLanguageDropdown()
    }, [languageDropdownVisible])

    const openLanguageDropdown = useCallback(() => {
        languageDropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
            setDropdownTop(py + h + 10)
        })
        userDropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
            setLanguageDropdownRight(_w + 20)
        })
        setLanguageDropdownVisible(true)
    }, [languageDropdownRef.current])

    const openUserDropdown = useCallback(() => {
        userDropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
            setDropdownTop(py + h + 10)
        })
        setUserDropdownVisible(true)
    }, [userDropdownRef.current])

    const renderUserDropdown = useCallback(() => {
        return (
            <Modal visible={userDropdownVisible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setUserDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.dropdown, { top: dropdownTop }]}>
                            <HoverableView hoveredBackgroundColor={COLORS.lightPlaceholder}>
                                <TouchableOpacity style={{ padding: SPACING.xx_small }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>{labels.SIGN_IN}</Text>
                                </TouchableOpacity>
                            </HoverableView>
                            <HoverableView hoveredBackgroundColor={COLORS.lightPlaceholder}>
                                <TouchableOpacity  style={{ padding: SPACING.xx_small }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZES.medium }}>{labels.SIGN_UP}</Text>
                                </TouchableOpacity>
                            </HoverableView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }, [userDropdownVisible, dropdownTop])

    const rendeLanguageDropdown = useCallback(() => {
        return (
            <Modal visible={languageDropdownVisible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setLanguageDropdownVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.dropdown, { top: dropdownTop, right: languageDropdownRight, overflow: 'hidden' }]}>
                            <HoverableView hoveredBackgroundColor={COLORS.lightPlaceholder}>
                                <TouchableOpacity onPress={() => navigation.setParams({ ...navigation.getState().routes[0].params, language: 'cs' })} style={{ padding: SPACING.xx_small, flexDirection: 'row', alignItems: 'center' }}
                                    activeOpacity={0.8}
                                >
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
                                </TouchableOpacity>
                            </HoverableView>
                            <HoverableView hoveredBackgroundColor={COLORS.lightPlaceholder}>
                                <TouchableOpacity onPress={() => navigation.setParams({ ...navigation.getState().routes[0].params, language: 'en' })} style={{ padding: SPACING.xx_small, flexDirection: 'row', alignItems: 'center' }}
                                    activeOpacity={0.8}
                                >
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
                                </TouchableOpacity>
                            </HoverableView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }, [languageDropdownVisible, dropdownTop, userDropdownRef, language])

    return (
        <View style={styles.header}>
            <View style={styles.header__left}>
                <View
                    onClick={onLogoPress}
                    style={{ height: normalize(50), justifyContent: 'center',  marginRight: SPACING.small }}
                    {...logoNavProps}
                >
                    <Image
                        resizeMode='contain'
                        source={require('../../assets/images/logo-header.png')}
                        style={{
                            height: normalize(32),
                            width: normalize(102)
                        }}
                    />
                </View>
                <HoverableView style={{ ...styles.locationWrapper }} hoveredOpacity={0.7}>
                    <TouchableOpacity style={styles.locationWrapper} activeOpacity={0.8}
                        onPress={() => setLocationModalVisible(true)}
                    >
                        <Ionicons style={{ paddingRight: SPACING.xx_small }} name="md-location-sharp" size={normalize(30)} color={COLORS.red} />
                        <View style={styles.locationWrapper__text}>
                            <Text style={styles.locationHeader}>{labels.CITY}</Text>
                            <Text style={styles.locationValue}>{selectedCity}</Text>
                        </View>
                        <MaterialIcons style={{ paddingLeft: SPACING.xx_small }} name="keyboard-arrow-down" size={normalize(24)} color={COLORS.red} />
                    </TouchableOpacity>
                </HoverableView>
            </View>
            <View style={styles.header__middle}>
                <HoverableView style={{ ...styles.searchWrapper, borderColor: searchBorderColor }} hoveredBackgroundColor={COLORS.lightGrey} backgroundColor={COLORS.grey}>
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
            </View>
            <View style={styles.header__right}>
                <HoverableView hoveredOpacity={0.8} style={{ borderRadius: 20, justifyContent: 'center', marginRight: SPACING.xx_small }}>
                    <TouchableOpacity ref={languageDropdownRef} onPress={toggleLanguageDropdown} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.xxx_small, paddingRight: SPACING.xx_small }}>
                        <MaterialIcons style={{ paddingRight: SPACING.xxx_small }} name="language" size={normalize(20)} color="white" />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>{language ? language.toUpperCase() : DEFAULT_LANGUAGE.toLocaleUpperCase()}</Text>
                        <MaterialIcons style={{ paddingLeft: SPACING.xxx_small }} name="keyboard-arrow-down" size={normalize(20)} color='#FFF' />
                    </TouchableOpacity>
                </HoverableView>
                <HoverableView hoveredBackgroundColor={COLORS.lightGrey} backgroundColor={COLORS.grey} style={{ borderRadius: 20, justifyContent: 'center'}}>
                    <TouchableOpacity ref={userDropdownRef} onPress={toggleUserDropdown} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.xxx_small, paddingRight: SPACING.xx_small }}>
                        <Ionicons name="person-circle-outline" size={normalize(28)} color="white" />
                        <MaterialIcons style={{ paddingLeft: SPACING.xxx_small }} name="menu" size={normalize(20)} color="white" />
                    </TouchableOpacity>
                </HoverableView>
                {rendeLanguageDropdown()}
                {renderUserDropdown()}
            </View>

            <Modal transparent={true}
                visible={locationModalVisible}
                animationType="fade">
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', cursor: 'default' }}
                    activeOpacity={1}
                    onPressOut={onLocationModalClose}
                >
                    <TouchableWithoutFeedback>
                        <View style={{
                            backgroundColor: '#FFF',
                            borderRadius: 24,
                            minWidth: normalize(500),
                            height: normalize(500),
                            maxHeight: '80%',
                            overflow: 'hidden'
                        }}>
                            <View style={styles.modal__header}>
                                <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0 }}></View>
                                <View style={{ flexShrink: 1, flexGrow: 0 }}>
                                    <Animated.Text style={modalHeaderTextStyles}>{labels.SELECT_CITY}</Animated.Text>
                                </View>
                                <View style={{ flexBasis: 50, flexGrow: 1, flexShrink: 0, alignItems: 'flex-end' }}>
                                    <HoverableView style={{ marginRight: SPACING.medium, width: SPACING.x_large, height: SPACING.x_large, justifyContent: 'center', alignItems: 'center', borderRadius: 17.5 }} hoveredBackgroundColor={COLORS.mediumPlaceholder} backgroundColor={COLORS.lightPlaceholder}>
                                        <Ionicons onPress={onLocationModalClose} name="close" size={normalize(25)} color="black" />
                                    </HoverableView>
                                </View>
                            </View>
                            <Animated.View style={[styles.modal__shadowHeader, modalHeaderTextStyles]} />

                            <Animated.ScrollView scrollEventThrottle={1} onScroll={scrollHandler} style={{ flex: 1, zIndex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.small }}>
                                <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginTop: SPACING.xxxxx_large, marginHorizontal: SPACING.small }}>{labels.SELECT_CITY}</Text>

                                <HoverableView style={{ ...styles.searchWrapper, borderRadius: 10, marginVertical: SPACING.xx_small, marginHorizontal: SPACING.small }} hoveredBackgroundColor='#FFF' backgroundColor='#FFF' hoveredBorderColor={COLORS.red} borderColor={searchCityBorderColor} transitionDuration='0ms'>
                                    <Ionicons name="search" size={normalize(20)} color="black" />
                                    <TextInput
                                        style={styles.citySearch}
                                        onChangeText={onCitySearch}
                                        value={citySearch}
                                        placeholder={labels.SEARCH}
                                        placeholderTextColor="grey"
                                        onBlur={() => setSearchCityBorderColor(COLORS.placeholder)}
                                        onFocus={() => setSearchCityBorderColor(COLORS.red)}
                                    />
                                    <Ionicons onPress={() => onCitySearch('')} style={{ opacity: citySearch ? '1' : '0' }} name="close" size={normalize(20)} color="black" />
                                </HoverableView>

                                {(filteredCitiesRef.current.some(filteredCity => CZECH_CITIES.includes(filteredCity)) || !citySearch) && <View style={styles.countrySection}>
                                    <Image
                                        resizeMode='contain'
                                        source={require('../../assets/images/flags/cz.png')}
                                        style={styles.countrySection__image}
                                    />
                                    <Text style={styles.countrySection__text}>{labels.CZECH}</Text>
                                </View>}
                                {filteredCitiesRef.current.map(city => <RenderCity key={city} onSelectCity={onSelectCity} city={city} iconName={city === selectedCity ? 'radio-button-checked' : 'radio-button-unchecked'} iconColor={city === selectedCity ? COLORS.red : 'grey'} />)}
                            </Animated.ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default memo(StackHeaderLarge)

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.large,
        paddingVertical: SPACING.x_small,
        backgroundColor: COLORS.lightBlack,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey
    },
    /*header__left: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 250,
        flexDirection: 'row'
    },
    header__middle: {
        flexBasis: 0,
        flexShrink: 1,
        flexBasis: 400
    },
    header__right: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 250,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },*/
    header__left: {
        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    header__middle: {
        flex:1,
    },
    header__right: {
        flex:1,
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
        color: '#FFF'
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
    searchCity: {
        flex: 1,
        padding: SPACING.xx_small,
        borderRadius: 20,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,
        outlineStyle: 'none',
        color: '#FFF'
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
        marginRight: SPACING.large,
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