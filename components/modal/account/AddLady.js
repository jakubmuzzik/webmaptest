import React, { memo } from 'react'
import { View, Modal, StyleSheet, useWindowDimensions, Dimensions } from 'react-native'
import LadySignup from '../../../screens/LadySignup'
import { normalize } from '../../../utils'
import { Ionicons } from '@expo/vector-icons'
import { SPACING, FONTS, FONT_SIZES, COLORS, SMALL_SCREEN_THRESHOLD } from '../../../constants'
import { connect } from 'react-redux'
import { updateScrollDisabled } from '../../../redux/actions'

const { height: initialHeight } = Dimensions.get('window')

const AddLady = ({ visible, setVisible, updateScrollDisabled }) => {
    const { width } = useWindowDimensions()
    const isSmallScreen = width < SMALL_SCREEN_THRESHOLD

    const onClosePress = () => {
        updateScrollDisabled()
        setVisible(false)
    }

    return (
        <Modal visible={visible} animationType="slide" onShow={() => updateScrollDisabled(true)}>
             <View style={isSmallScreen ? styles.headerSmall : styles.headerLarge}>
                <View style={{ flexBasis: 30, flexGrow: 1, flexShrink: 0 }}></View>
                <View style={{ flexShrink: 1, flexGrow: 0 }}>
                    
                </View>
                <View style={{ flexBasis: 30, flexGrow: 1, flexShrink: 0 }}>
                    <Ionicons onPress={onClosePress} name="close" size={25} color="white" style={{ marginRight: SPACING.medium, alignSelf: 'flex-end' }} />
                </View>
            </View>

            <View style={{ height: initialHeight - normalize(70), backgroundColor: COLORS.lightBlack }}>
                <LadySignup/>
            </View>
        </Modal>
    )
}

export default connect(null, { updateScrollDisabled })(memo(AddLady))

const styles = StyleSheet.create({
    headerSmall: {
        //position: 'fixed',
        width: '100%',
        //height: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: normalize(70),
        position: 'fixed', 
        zIndex: 1, 
        backgroundColor: COLORS.grey,
    },
    headerLarge: {
        //position: 'fixed',
        width: '100%',
        //height: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.x_small,
        height: normalize(70),
        position: 'fixed', 
        zIndex: 1, 
        backgroundColor: COLORS.grey
    },

})