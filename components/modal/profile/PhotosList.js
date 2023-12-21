import React, { memo } from 'react'
import { COLORS, SPACING, FONTS, FONT_SIZES } from '../../../constants'
import { normalize } from '../../../utils'
import { Image } from 'expo-image'
import { ScrollView, View, Text } from 'react-native'
import HoverableView from '../../HoverableView'
import { TouchableRipple } from 'react-native-paper'

const PhotosList = ({ onAssetPress }) => {
    return (
        <View style={{ padding: SPACING.medium, paddingBottom: 0, width: normalize(500), maxWidth: '100%', alignSelf: 'center' }}>
            <HoverableView hoveredOpacity={0.9} style={{ height: 300, width: '100%', marginBottom: SPACING.medium }}>
                <TouchableRipple onPress={() => onAssetPress(0)} style={{ flex: 1 }}>
                    <Image
                        style={{
                            flex: 1
                        }}
                        source={require('../../../assets/dummy_photo.png')}
                        resizeMode="contain"
                        transition={200}
                    />
                </TouchableRipple>
            </HoverableView>
            <HoverableView hoveredOpacity={0.9} style={{ height: 300, width: '100%', marginBottom: SPACING.medium }}>
                <TouchableRipple onPress={() => onAssetPress(1)} style={{ flex: 1 }}>
                    <Image
                        style={{
                            flex: 1
                        }}
                        source="https://picsum.photos/seed/696/3000/2000"
                        resizeMode="contain"
                        transition={200}
                    />
                </TouchableRipple>
            </HoverableView>
        </View>
    )
}

export default memo(PhotosList)