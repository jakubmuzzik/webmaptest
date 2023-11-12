import React, { useState, useCallback, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { COLORS, FONTS, FONT_SIZES, SPACING} from "../constants"
import {isBrowser } from 'react-device-detect'
import { normalize } from "../utils"
import HoverableView from "./HoverableView"

const Dropdown = ({
    values, 
    label, 
    placeholder, 
    searchable = false,
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

    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [dropdownDesc, setDropdownDesc] = useState(0)
    const [visible, setVisible] = useState(false)

    const onValuePress = (value) => {
        console.log(value)
    }

    const onDropdownPress = () => {
        dropdownRef.current.measure((_fx, _fy, _w, h, _px, py) => {
            console.log(_w)
            setDropdownDesc({
                y: py + h + 10,
                x: _px,
                width: _w
            })
        })
        setVisible(true)
    }

    const renderDropdown = useCallback(() => {
        return (
            <Modal visible={visible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    onPress={() => setVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.dropdown, { width: dropdownDesc.width, top: dropdownDesc.y, left: dropdownDesc.x }]}>
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite}>
                                <TouchableOpacity style={{ padding: SPACING.xx_small }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                        Val 1
                                    </Text>
                                </TouchableOpacity>
                            </HoverableView>
                            <HoverableView hoveredBackgroundColor={COLORS.hoveredWhite}>
                                <TouchableOpacity style={{ padding: SPACING.xx_small }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium }}>
                                        Val 2
                                    </Text>
                                </TouchableOpacity>
                            </HoverableView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }, [visible, dropdownDesc])

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
                    left={leftIconName && <TextInput.Icon size={normalize(20)} icon={leftIconName} />}
                    right={rightIconName && <TextInput.Icon size={normalize(20)} icon={rightIconName} />}
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

export default Dropdown

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
    }
})