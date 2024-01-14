import React, { useState, memo } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FONTS, FONT_SIZES, COLORS, SPACING } from '../../constants'
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import { normalize } from '../../utils'
import { Button, Tooltip, IconButton } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import {
    signOut,
    getAuth,
  } from '../../firebase/config'

import PasswordEditor from '../../components/modal/account/PasswordEditor'
import EmailEditor from '../../components/modal/account/EmailEditor'
import DeleteAccount from '../../components/modal/account/DeleteAccount'

const Settings = ({ setTabHeight }) => {
    const [data, setData] = useState({
        name: 'Jakub Muzik',
        email: 'jakub.muzzik@gmail.com'
    })

    const [passwordEditorVisible, setPasswordEditorVisible] = useState(false)
    const [emailEditorVisible, setEmailEditorVisible] = useState(false)
    const [deleteAccountVisible, setDeleteAccountVisible] = useState(false)

    const onLogoutPress = () => {
        signOut(getAuth())
        Toast.show({
            type: 'success',
            text2: 'Successfully logged out.'
        })
    }

    const onNameEditPress = () => {

    }

    const onEmailEditPress = () => {
        setEmailEditorVisible(true)
    }

    const onPasswordEditPress = () => {
        setPasswordEditorVisible(true)
    }

    const onStatusChangePress = () => {

    }

    const onDeleteAccountPress = () => {
        setDeleteAccountVisible(true)
    }

    return (
        <View onLayout={(event) => setTabHeight(event.nativeEvent.layout.height)}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="email-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                            Email
                        </Text>
                    </View>
                    <Text numberOfLines={1} onPress={onEmailEditPress} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                        {data.email}
                    </Text>
                </View>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="lock-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                            Password
                        </Text>
                    </View>
                    <Text onPress={onPasswordEditPress} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                        Change
                    </Text>
                </View>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="account-check-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                            Profile Status
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onStatusChangePress} style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={1}>
                        <Octicons name="dot-fill" size={20} color="green" style={{ marginRight: SPACING.xxx_small }}/>
                        <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}>
                            Active
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="delete-outline" size={FONT_SIZES.medium} color="white" style={{ marginRight: SPACING.xxx_small }} />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF', marginRight: SPACING.x_small }}>
                            Delete account
                        </Text>
                    </View>
                    <Text onPress={onDeleteAccountPress} style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: COLORS.lightRed }}>
                        Delete
                    </Text>
                </View>
                <Button
                    style={{ alignSelf: 'flex-end', marginTop: SPACING.small }}
                    labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                    mode="outlined"
                    icon="logout"
                    onPress={onLogoutPress}
                    rippleColor="rgba(220, 46, 46, .16)"
                >
                    Log out
                </Button>
            </View>

            <PasswordEditor visible={passwordEditorVisible} setVisible={setPasswordEditorVisible} />
            <EmailEditor visible={emailEditorVisible} setVisible={setEmailEditorVisible} />
            <DeleteAccount visible={deleteAccountVisible} setVisible={setDeleteAccountVisible} />
        </View>
    )
}

export default memo(Settings)

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.large,
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
        borderRadius: 20,
        backgroundColor: COLORS.grey
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.small,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey
    }
})