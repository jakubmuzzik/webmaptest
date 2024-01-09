import React, { useEffect, useState, memo, useRef } from 'react'
import { View, ImageBackground } from 'react-native'
import { Image } from 'expo-image'
import DropdownSelect from '../DropdownSelect'
import { IconButton } from 'react-native-paper'
import { COLORS } from '../../constants'
import { normalize } from '../../utils'
import { BlurView } from 'expo-blur'

const RenderImageWithActions = ({ image, transition = 200, resizeMode = 'contain', actions, offsetX = 0 }) => {
    const actionsDropdownRef = useRef()

    return (
        <ImageBackground
            source={{ uri: image }}
            style={StyleSheet.absoluteFillObject}
            imageStyle={{ opacity: 0.7 }}
            resizeMode='cover'
        >
            <BlurView intensity={50}>
                <Image
                    style={{
                        flex: 1,
                        aspectRatio: 1 / 1,
                    }}
                    source={{ uri: image }}
                    resizeMode={resizeMode}
                    transition={transition}
                />
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
            </BlurView>
        </ImageBackground>
    )
}

export default memo(RenderImageWithActions)