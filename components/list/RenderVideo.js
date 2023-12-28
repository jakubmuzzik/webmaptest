import React, { useEffect, useState, memo, useRef } from 'react'
import { Image as RNImage, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { MotiView } from 'moti'
import { Video, ResizeMode } from 'expo-av'
import { generateThumbnailFromLocalURI } from '../../utils'
import { isBrowser } from 'react-device-detect'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { IconButton } from 'react-native-paper'
import { COLORS } from '../../constants'

const RenderVideo = ({ video }) => {
    const [thumbnail, setThumbnail] = useState()
    const [aspectRatio, setAspectRatio] = useState()
    const [showPoster, setShowPoster] = useState(true)

    const videoRef = useRef()

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        try {
            //todo - get and save thumbnail aspect ratio when uploading video instead
            const thumbnailUrl = await generateThumbnailFromLocalURI(require('../../assets/big_buck_bunny.mp4'), 0)
            setThumbnail(thumbnailUrl)
            RNImage.getSize(thumbnailUrl, (width, height) => { 
                setAspectRatio(width / height)
            })
        } catch(e) {
            console.error(e)
        }
    }

    const onPlayPress = () => {
        videoRef.current.playAsync()
        setShowPoster(false)
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
                ref={videoRef}
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
                usePoster={showPoster && !isBrowser}
                PosterComponent={() => (
                    <ImageBackground
                        source={thumbnail}
                        style={{
                            width: '100%',
                            height: undefined,
                            aspectRatio: aspectRatio,
                            top: 0,
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} >
                            <TouchableOpacity activeOpacity={0.8} onPress={onPlayPress}>
                                <Ionicons name="ios-play-circle-sharp" size={75} color="black" />
                            </TouchableOpacity>
                    </ImageBackground>
                )}
            />
            {/* {!isBrowser && showPoster && (
                <ImageBackground
                    source={thumbnail}
                    style={{
                        width: '100%',
                        height: undefined,
                        aspectRatio: aspectRatio,
                        top: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >
                        <TouchableOpacity activeOpacity={0.8} onPress={onPlayPress}>
                            <Ionicons name="ios-play-circle-sharp" size={70} color="black" />
                        </TouchableOpacity>
                </ImageBackground>
            )} */}
        </MotiView>
    )
}

export default memo(RenderVideo)