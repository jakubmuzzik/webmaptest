import React, { useEffect, useState, memo } from 'react'
import { Image as RNImage } from 'react-native'
import { Image } from 'expo-image'
import { MotiView } from 'moti'

const RenderImage = ({ image, transition=200, resizeMode='contain' }) => {
    const [aspectRatio, setAspectRatio] = useState()

    useEffect(() => {
        RNImage.getSize(image, (width, height) => { 
            setAspectRatio(width /height)
        })
    }, [])

    if (!aspectRatio) {
        return (
            null
        )
    }

    return (
        <MotiView
            from={{
                opacity: 0,
                transform: [{ translateY: 40 }],
            }}
            animate={{
                opacity: 1,
                transform: [{ translateY: 0 }],
            }}
            transition={{
                type: 'timing',
                duration: 200,
            }}
        >
            <Image
                style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: aspectRatio
                }}
                source={image}
                resizeMode={resizeMode}
                transition={transition}
            />
        </MotiView>
    )
}

export default memo(RenderImage)