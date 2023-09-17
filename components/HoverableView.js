import React, { useState } from 'react'
import { View } from 'react-native'

const HoverableView = ({ children, style, hoveredBackgroundColor, backgroundColor, hoveredOpacity = 1, hoveredBorderColor, borderColor, transitionDuration = '150ms', ...props }) => {
    const [isHovered, setIsHovered] = useState(false)

    //TODO - maybe implement responder when rendered on mobile? https://stackoverflow.com/questions/70573259/how-to-style-hover-in-react-native
    return (
        <View style={{
            transitionDuration: { transitionDuration },
            backgroundColor: isHovered ? hoveredBackgroundColor : backgroundColor,
            opacity: isHovered ? hoveredOpacity : 1,
            borderColor: isHovered ? hoveredBorderColor : borderColor,
            ...style
        }}
            {...props}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </View>
    )
}

export default HoverableView