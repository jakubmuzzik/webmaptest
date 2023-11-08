import React, { useState } from "react"
import { View, Text } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'
import { COLORS, FONTS, FONT_SIZES } from "../constants"

const HoverableInput = ({ 
    borderColor,
    hoveredBorderColor, 
    textColor="#FFF",
    backgroundColor="transparent", 
    hoveredBackgroundColor="transparent",
    errorMessage, 
    mode="outlined", 
    placeholder,
    label, 
    labelStyle={},
    text, 
    textStyle={},
    placeholderStyle={},
    containerStyle={},
    setText,
    left,
    right,
    secureTextEntry=false
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return (
        <View
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <TextInput
                label={<View style={{ marginHorizontal: 2, zIndex: 2 }}><Text style={labelStyle}>{label}</Text></View>}
                placeholder={placeholder}
                textColor={textColor}
                outlineColor={isHovered ? hoveredBorderColor : borderColor}
                activeOutlineColor={errorMessage ? COLORS.error : isHovered || isFocused ? hoveredBorderColor: borderColor}
                underlineColor="red"
                activeUnderlineColor="red"
                error={errorMessage}
                mode={mode}
                value={text}
                onChangeText={text => setText(text)}
                left={left ? <TextInput.Icon icon={left}/> : null}
                right={right ? <TextInput.Icon icon={right}/> : null}
                contentStyle={[
                    text ? {...textStyle} : {...placeholderStyle}
                ]}
                outlineStyle={{ 
                    backgroundColor: isHovered ? hoveredBackgroundColor: backgroundColor
                }}
                style={containerStyle}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={secureTextEntry}
            />
            {errorMessage && <HelperText type="error" visible>
                <Text style={{ fontFamily: FONTS.light, fontSize: FONT_SIZES.small, color: COLORS.error }}>
                    {errorMessage}
                </Text>
            </HelperText>}
        </View>
    )
}

export default HoverableInput