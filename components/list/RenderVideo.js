import React, { useEffect, useState, memo } from 'react'
import { Image as RNImage } from 'react-native'
import { Image } from 'expo-image'
import { MotiView } from 'moti'
import { Video, ResizeMode } from 'expo-av'
import { generateThumbnailFromLocalURI } from '../../utils'

const RenderVideo = ({ video }) => {
    const [aspectRatio, setAspectRatio] = useState()

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        try {
            //todo - get and save thumbnail aspect ratio when uploading video instead
            const thumbnailUrl = await generateThumbnailFromLocalURI(require('../../assets/big_buck_bunny.mp4'), 0)
            RNImage.getSize(thumbnailUrl, (width, height) => { 
                setAspectRatio(width /height)
            })
        } catch(e) {
            console.error(e)
        }
    }

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
            <Video
                style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: aspectRatio
                }}
                videoStyle={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: aspectRatio
                }}
                source={{
                    uri: require('../../assets/big_buck_bunny.mp4'),
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
            />
        </MotiView>
    )
}

export default memo(RenderVideo)