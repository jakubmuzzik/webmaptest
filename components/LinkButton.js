import React, { useState } from 'react'
import { View } from 'react-native'
import { useLinkProps } from '@react-navigation/native'

const LinkButton = ({ to, action, children, containerStyle }) => {
  const { onPress, ...props } = useLinkProps({ to, action })

    const [isHovered, setIsHovered] = useState(false)

    return (
        <View
            onClick={onPress}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ transitionDuration: '150ms', opacity: isHovered ? 0.5 : 1, ...containerStyle }}
            {...props}
        >
            {children}
        </View>
    )
}

export default LinkButton