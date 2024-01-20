import React, { useState, memo } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, FONTS, FONT_SIZES, SPACING, SMALL_SCREEN_THRESHOLD } from '../../constants'
import { normalize } from '../../utils'
import { IconButton, Button } from 'react-native-paper'
import { Octicons } from '@expo/vector-icons'
import DropdownSelect from '../../components/DropdownSelect'
import RenderVideoWithActions from '../../components/list/RenderVideoWithActions'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const Videos = ({ index, setTabHeight, offsetX = 0 }) => {
    const [data, setData] = useState({
        active: [require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png')],
        pending: [require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'),],
        rejected: [require('../../assets/dummy_photo.png')]
    })
    const [sectionWidth, setSectionWidth] = useState(0)

    const { width: windowWidth } = useWindowDimensions()
    const isSmallScreen = windowWidth < SMALL_SCREEN_THRESHOLD


    console.log(offsetX)
    console.log(index + ' | ' + windowWidth)
    console.log(windowWidth * index)
    console.log((windowWidth * index) + offsetX)

    const onLayout = (event) => {
        setTabHeight(event.nativeEvent.layout.height)
        setSectionWidth(event.nativeEvent.layout.width - 2)
    }

    const onEditImagePress = (image) => {

    }

    const onDeleteImagePress = (image) => {

    }

    const onAddNewImagePress = () => {

    }

    const onShowRejectedReasonPress = () => {

    }

    const activeActions = [
        {
            label: 'Edit',
            onPress: onEditImagePress
        },
        {
            label: 'Delete',
            onPress: onDeleteImagePress
        }
    ]

    const pendingActions = [
        {
            label: 'Delete',
            onPress: onDeleteImagePress,
            iconName: 'delete-outline'
        }
    ]

    const rejectedActions = [
        {
            label: 'Show rejection reason',
            onPress: onShowRejectedReasonPress
        },
        {
            label: 'Delete',
            onPress: onDeleteImagePress
        }
    ]

    const renderVideos = (videos, actions) => {
        const largeContainerStyles = {
            flexDirection: 'row', 
            marginLeft: SPACING.small, 
            marginRight: SPACING.small - SPACING.small, 
            flexWrap: 'wrap'
        }
        const smallContainerStyles = {
            flexDirection: 'row', marginHorizontal: SPACING.small,  marginBottom: SPACING.small, flexWrap: 'wrap'
        }
        const largeImageContainerStyles = {
            borderRadius: 10, overflow: 'hidden', width: ((sectionWidth - (SPACING.small * 2) - (SPACING.small )) / 2), marginRight: SPACING.small, marginBottom: SPACING.small
        }
        const smallImageContainerStyles = {
            borderRadius: 10, overflow: 'hidden', width: '100%', marginBottom: SPACING.small
        }

        return (
            <View style={isSmallScreen ? smallContainerStyles : largeContainerStyles}>
                {videos.map((video) =>
                    <View key={videos ?? Math.random()} style={isSmallScreen ? smallImageContainerStyles : largeImageContainerStyles}>
                        <RenderVideoWithActions video={video} actions={actions} offsetX={(windowWidth * index) + offsetX} />
                    </View>)}
            </View>
        )

    }

    const renderActive = () => {

        return (
            <View style={styles.section}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', flexShrink: 1 }}>
                        <Octicons name="dot-fill" size={20} color="green" style={{ marginRight: SPACING.xx_small }} />
                        <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                            Active
                        </Text>
                        <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                            • {data.active.length}
                        </Text>
                    </View>

                    <Button
                        labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                        style={{ height: 'auto' }}
                        mode="outlined"
                        icon="plus"
                        onPress={onAddNewImagePress}
                        rippleColor="rgba(220, 46, 46, .16)"
                    >
                        Add video
                    </Button>
                </View>

                {renderVideos(data.active, activeActions)}
            </View>
        )
    }

    const renderPending = () => {
        
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Octicons name="dot-fill" size={20} color="yellow" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        Under review
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.pending.length}
                    </Text>
                </View>

                {
                    data.pending.length === 0 ?
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                            No videos under review
                        </Text>
                        : renderVideos(data.pending, pendingActions)
                }
            </View>
        )
    }

    const renderRejected = () => {
        if (data.rejected.length === 0) {
            return null
        }

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Octicons name="dot-fill" size={20} color="red" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        Rejected
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.rejected.length}
                    </Text>
                </View>

                {renderVideos(data.rejected, rejectedActions)}
            </View>
        )
    }

    return (
        <View style={{ paddingBottom: SPACING.large }} onLayout={onLayout}>
            {renderActive()}
            {renderPending()}
            {renderRejected()}
        </View>
    )
}

export default memo(Videos)

const styles = StyleSheet.create({
    section: {
        marginTop: SPACING.large,
        borderRadius: 20,
        backgroundColor: COLORS.grey,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.08)',
    },
    sectionHeader: {
        flexDirection: 'row',
        margin: SPACING.small,
        alignItems: 'center'
    },
    sectionHeaderText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.h3
    },
    largeContainerStyles: {
        flexDirection: 'row', 
        marginLeft: SPACING.small, 
        marginRight: SPACING.small - SPACING.xxx_small, 
        marginBottom: SPACING.small, 
        flexWrap: 'wrap'
    }, 
    smallContainerStyles: {
        flexDirection: 'row', marginHorizontal: SPACING.small,  marginBottom: SPACING.small, flexWrap: 'wrap'
    },
    largeImageContainerStyles: {

    }, 
    smallImageContainerStyles: {
        
    }
})