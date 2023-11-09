import React, { useState } from 'react'
import { View } from 'react-native'
import { useLinkProps } from '@react-navigation/native'
import { isBrowser } from 'react-device-detect'

const LinkButton = ({ to, action, children, containerStyle }) => {
  const { onPress, ...props } = useLinkProps({ to, action })

    const [isHovered, setIsHovered] = useState(false)

    return (
        <View
            onClick={onPress}
            onMouseEnter={isBrowser ? () => setIsHovered(true) : undefined}
            onMouseLeave={isBrowser ? () => setIsHovered(false) : undefined}
            style={{ transitionDuration: '150ms', opacity: isHovered ? 0.5 : 1, ...containerStyle }}
            {...props}
        >
            {children}
        </View>
    )
}

export default LinkButton