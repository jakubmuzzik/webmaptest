import React, { useState } from 'react'
import { View } from 'react-native'
import { Button } from '@rneui/themed'

/**
    <HoverableButton
        title="Select"
        onPress={onConfirmCityPicker}
        buttonStyle={{
            backgroundColor: '#E0191A',
            borderRadius: 12
        }}
        titleStyle={{
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZES.large
        }}
    />
*/

const HoverableButton = ({ title, onPress, buttonStyle, titleStyle }) => {
    const [isHovered, setIsHovered] = useState(false)

    //TODO - maybe implement responder when rendered on mobile? https://stackoverflow.com/questions/70573259/how-to-style-hover-in-react-native
    return (
        <View style={{ transitionDuration: '150ms', opacity: isHovered ? 0.8 : 1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Button
                title={title}
                onPress={onPress}
                buttonStyle={{...buttonStyle}}
                titleStyle={{...titleStyle}}
            />
        </View>
    )
}

export default HoverableButton