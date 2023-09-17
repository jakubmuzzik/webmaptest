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
import { COLORS, FONTS, FONT_SIZES, DEFAULT_CITY, SPACING } from '../../constants'
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

const StackHeaderSmall = ({ language }) => {
    const labels = useMemo(() => translateLabels(language, [
        CZECH,
        CITY,
        SELECT_CITY,
        SEARCH,
        SIGN_IN,
        SIGN_UP
    ]), [language])

    const [search, setSearch] = useState('')
    const [citySearch, setCitySearch] = useState('')
    const [searchBorderColor, setSearchBorderColor] = useState('transparent')
    const [searchCityBorderColor, setSearchCityBorderColor] = useState(COLORS.placeholder) 
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)

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


    return (
        <View style={styles.header}>
            <View style={styles.header__left}>
                <HoverableView style={styles.locationWrapper} hoveredOpacity={0.7}>
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
            <View style={styles.header__right}>
                <HoverableView style={{ ...styles.searchWrapper, borderColor: searchBorderColor, flexGrow: 1, flexShrink: 1 }} hoveredBackgroundColor={COLORS.lightGrey} backgroundColor={COLORS.grey}>
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
                            width: '80%',
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

export default memo(StackHeaderSmall)

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.large,
        backgroundColor: COLORS.lightBlack,
        height: normalize(70),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey
    },
    header__left: {
        flexGrow: 0,
        flexDirection: 'row'
    },
    header__right: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: SPACING.small
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
        alignItems: 'center',
        flexGrow: 1
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
    }
})