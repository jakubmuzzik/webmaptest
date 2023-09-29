import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { COLORS, FONTS, FONT_SIZES, SPACING } from "../constants"

const Profile = ({ route, client }) => {


    return (
        <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightBlack}}>
            <Text>Profile</Text>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({

})