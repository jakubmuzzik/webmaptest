import React, { memo } from 'react'
import { SPACING } from '../../../constants'
import { normalize } from '../../../utils'
import { ScrollView, View } from 'react-native'
import HoverableView from '../../HoverableView'
import { TouchableRipple } from 'react-native-paper'
import RenderImage from '../../list/RenderImage'

const PhotosList = ({ onImagePress, photos }) => {

    return (
        <ScrollView contentContainerStyle={{ padding: SPACING.medium, paddingBottom: 0, width: normalize(400), maxWidth: '100%', alignSelf: 'center' }}>
            {photos.map((photo, index) => (
                <HoverableView key={photo} hoveredOpacity={0.8} style={{ width: '100%', marginBottom: SPACING.medium }}>
                    <TouchableRipple onPress={() => onImagePress(index)} style={{ flex: 1 }}>
                        <RenderImage image={photo} />
                    </TouchableRipple>
                </HoverableView>
            ))}
        </ScrollView>
    )
}

export default memo(PhotosList)