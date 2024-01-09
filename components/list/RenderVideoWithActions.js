import React, { useEffect, useState, memo, useRef } from 'react'
import { View, Image as RNImage, ImageBackground, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import DropdownSelect from '../DropdownSelect'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import { COLORS, SPACING } from '../../constants'
import { normalize, generateThumbnailFromLocalURI } from '../../utils'
import { Video, ResizeMode } from 'expo-av'
import { isBrowser } from 'react-device-detect'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const RenderVideoWithActions = ({ video, actions, offsetX = 0 }) => {
    const actionsDropdownRef = useRef()

    const [aspectRatio, setAspectRatio] = useState()
    const [showPoster, setShowPoster] = useState(true)

    const videoRef = useRef()

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (!showPoster && videoRef.current) {
            videoRef.current.playAsync()
        }
    }, [showPoster, videoRef.current])

    const init = async () => {
        try {
            //todo - get and save thumbnail aspect ratio when uploading video instead
            const thumbnailUrl = await generateThumbnailFromLocalURI(require('../../assets/big_buck_bunny.mp4'), 0)
            //setThumbnail(thumbnailUrl)
            RNImage.getSize(thumbnailUrl, (width, height) => { 
                setAspectRatio(width / height)
            })
        } catch(e) {
            console.error(e)
        }
    }

    if (!aspectRatio) {
        return (
            <ActivityIndicator style={{ margin: SPACING.large, alignSelf: 'center' }} animating color={COLORS.red} />
        )
    }

    return (
        <>
            {!showPoster && <Video
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
            />}
            {showPoster && (
                <ImageBackground
                    source={require('../../assets/dummy_photo.png')}
                    style={{
                        width: '100%',
                        height: undefined,
                        aspectRatio: aspectRatio,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} >
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPoster(false)}>
                        <Ionicons name="ios-play-circle-sharp" size={normalize(70)} color='rgba(0,0,0,.7)' />
                    </TouchableOpacity>
                </ImageBackground>
            )}
            {actions.length === 1 ? <IconButton
                style={{ position: 'absolute', top: 2, right: 2, }}
                containerColor={COLORS.grey + 'B3'}
                icon={actions[0].iconName}
                iconColor='white'
                size={normalize(20)}
                onPress={() => actions[0].onPress(image)}
            />
                : <View style={{
                    position: 'absolute',
                    right: 2,
                    top: 2,
                }}>
                    <DropdownSelect
                        ref={actionsDropdownRef}
                        offsetX={offsetX}
                        values={actions.map(action => action.label)}
                        setText={(text) => actions.find(action => action.label === text).onPress(image)}
                    >
                        <IconButton
                            icon="dots-horizontal"
                            iconColor="#FFF"
                            containerColor={COLORS.grey + 'B3'}
                            size={18}
                            onPress={() => actionsDropdownRef.current?.onDropdownPress()}
                        />
                    </DropdownSelect>
                </View>}
        </>
    )
}

export default memo(RenderVideoWithActions)