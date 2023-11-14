import React, { useState, useCallback, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, ScrollView, TextInput as NativeTextInput } from 'react-native'
import { TextInput, HelperText, TouchableRipple } from 'react-native-paper'
import { COLORS, FONTS, FONT_SIZES, SPACING} from "../constants"
import {isBrowser } from 'react-device-detect'
import { normalize } from "../utils"
import HoverableView from "./HoverableView"
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'

const { height } = Dimensions.get('window')

const DropdownSelect = ({
    values, 
    label, 
    placeholder, 
    multiselect = false,
    searchable = false,
    searchPlaceholder,
    borderColor,
    hoveredBorderColor, 
    textColor="#FFF",
    backgroundColor="transparent", 
    hoveredBackgroundColor="transparent",
    errorMessage, 
    mode="outlined", 
    labelStyle={},
    text, 
    textStyle={},
    placeholderStyle={},
    containerStyle={},
    setText,
    leftIconName,
    rightIconName
}) => {
    const dropdownRef = useRef()
    const filteredValuesRef = useRef(values)

    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [dropdownDesc, setDropdownDesc] = useState(0)
    const [visible, setVisible] = useState(false)
    const [search, setSearch] = useState('')
    const [searchBorderColor, setSearchBorderColor] = useState(COLORS.placeholder)

    const onValuePress = (value) => {
        setText(value)
    }

    const onDropdownPress = () => {
        dropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
            const hasEnoughSpaceBelow = (height - (py + h + 10)) > 150
            const dropdownHeight = hasEnoughSpaceBelow ? height - (py + h + 10) : 250
            setDropdownDesc({
                y: hasEnoughSpaceBelow ? py + h + 10 : py - 250 + h - 10,
                x: _px,
                width: _w,
                height: dropdownHeight
            })
        })
        setVisible(true)
    }

    const onSearch = useCallback((value) => {
        filteredValuesRef.current = value ? [...values].filter(val => val.toLowerCase().includes(value.toLowerCase())) : [...values]
        setSearch(value)
    }, [filteredValuesRef.current])

    const renderDropdown = useCallback(() => {
        return (
            <Modal visible={visible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setVisible(false)}
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
                            style={[styles.dropdown, { 
                                minHeight: 150,
                                maxHeight: dropdownDesc.height - SPACING.xxx_large,
                                minWidth: dropdownDesc.width, 
                                top: dropdownDesc.y, 
                                left: dropdownDesc.x,
                                borderColor,
                                borderWidth: 1,
                                overflow:'hidden'
                            }]}
                        >
                            {searchable && (
                                <HoverableView style={{ ...styles.searchWrapper, borderRadius: 10, marginVertical: SPACING.xx_small, marginHorizontal: SPACING.xx_small }} hoveredBackgroundColor='#FFF' backgroundColor='#FFF' hoveredBorderColor={COLORS.red} borderColor={searchBorderColor} transitionDuration='0ms'>
                                    <Ionicons name="search" size={normalize(17)} color="black" />
                                    <NativeTextInput
                                        style={styles.citySearch}
                                        onChangeText={onSearch}
                                        value={search}
                                        placeholder={searchPlaceholder}
                                        placeholderTextColor="grey"
                                        onBlur={() => setSearchBorderColor(COLORS.placeholder)}
                                        onFocus={() => setSearchBorderColor(COLORS.red)}
                                    />
                                    <Ionicons onPress={() => onSearch('')} style={{ opacity: search ? '1' : '0' }} name="close" size={normalize(17)} color="black" />
                                </HoverableView>
                            )}

                            <ScrollView>
                                {filteredValuesRef.current.map((value) => {
                                    const selected = multiselect ? text.includes(value) : text === value
                                    return (
                                        <HoverableView key={value} hoveredBackgroundColor={selected ?  "rgba(220, 46, 46, .17)" : COLORS.hoveredWhite} backgroundColor={selected ? "rgba(220, 46, 46, .12)" : '#FFF'}>
                                            <TouchableRipple
                                                onPress={() => onValuePress(value)}
                                                style={{ padding: SPACING.xx_small, paddingHorizontal: SPACING.x_small }}
                                                rippleColor="rgba(220, 46, 46, .22)"
                                            >
                                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                                    {value}
                                                </Text>
                                            </TouchableRipple>
                                        </HoverableView>
                                    )
                                })}
                            </ScrollView>
                        </MotiView>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }, [visible, dropdownDesc, text, search, searchBorderColor])

    return (
        <>
            <TouchableOpacity
                ref={dropdownRef}
                onPress={onDropdownPress}
                style={containerStyle}
                onMouseEnter={isBrowser ? () => setIsHovered(true) : undefined}
                onMouseLeave={isBrowser ? () => setIsHovered(false) : undefined}
            >
                <TextInput
                    pointerEvents="none"
                    label={<View style={{ marginHorizontal: 2, zIndex: 2 }}><Text style={labelStyle}>{label}</Text></View>}
                    placeholder={placeholder}
                    textColor={textColor}
                    outlineColor={isHovered ? hoveredBorderColor : borderColor}
                    activeOutlineColor={errorMessage ? COLORS.error : isHovered || isFocused ? hoveredBorderColor : borderColor}
                    underlineColor="red"
                    activeUnderlineColor="red"
                    error={errorMessage}
                    mode={mode}
                    value={text}
                    onChangeText={text => setText(text)}
                    left={leftIconName && <TextInput.Icon size={normalize(20)} icon={leftIconName} pointerEvents="none"/>}
                    right={rightIconName && <TextInput.Icon size={normalize(20)} icon={rightIconName} pointerEvents="none"/>}
                    contentStyle={[
                        text ? { ...textStyle } : { ...placeholderStyle }
                    ]}
                    outlineStyle={{
                        backgroundColor: isHovered ? hoveredBackgroundColor : backgroundColor
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {errorMessage && <HelperText type="error" visible>
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.small, color: COLORS.error }}>
                        {errorMessage}
                    </Text>
                </HelperText>}
            </TouchableOpacity>
            {renderDropdown()}
        </>
    )
}

export default DropdownSelect

const styles = StyleSheet.create({
    dropdownOverlay: {
        width: '100%',
        height: '100%',
        cursor: 'default',
        alignItems: 'flex-end',
    },
    dropdown: {
        position: 'absolute',
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
    },
    searchWrapper: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        paddingHorizontal: SPACING.x_small,
        overflow: 'hidden'
    },
    citySearch: {
        flex: 1,
        padding: SPACING.xxx_small,
        borderRadius: 20,
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZES.medium,
        outlineStyle: 'none',
        color: '#000'
    },
})