import React, { useState, memo, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, FONTS, FONT_SIZES, SPACING, SMALL_SCREEN_THRESHOLD, MAX_VIDEO_SIZE_MB, MAX_VIDEOS } from '../../constants'
import { ACTIVE, REJECTED, IN_REVIEW } from '../../labels'
import { normalize, generateThumbnailFromLocalURI, encodeImageToBlurhash, getFileSizeInMb, getDataType } from '../../utils'
import { IconButton, Button } from 'react-native-paper'
import { Octicons } from '@expo/vector-icons'
import DropdownSelect from '../../components/DropdownSelect'
import RenderVideoWithActions from '../../components/list/RenderVideoWithActions'
import * as ImagePicker from 'expo-image-picker'
import { connect } from 'react-redux'

const Videos = ({ index, setTabHeight, offsetX = 0, userData, toastRef }) => {
    const [data, setData] = useState({
        active: [],
        inReview: [],
        rejected: []
    })
    const [sectionWidth, setSectionWidth] = useState(0)

    useEffect(() => {
        const active = userData.videos.filter(video => video.status === ACTIVE)
        const inReview = userData.videos.filter(video => video.status === IN_REVIEW)
        const rejected = userData.videos.filter(video => video.status === REJECTED)

        setData({
            active, inReview, rejected
        })
    }, [userData.videos])

    console.log(data.inReview)
    const { width: windowWidth } = useWindowDimensions()
    const isSmallScreen = windowWidth < SMALL_SCREEN_THRESHOLD

    const onLayout = (event) => {
        setTabHeight(event.nativeEvent.layout.height)
        setSectionWidth(event.nativeEvent.layout.width - 2)
    }

    const openImagePicker = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            base64: true,
            quality: 0.8,
        })

        if (!result.canceled) {
            try {
                const fileSizeMb = getFileSizeInMb(result.assets[0].uri)
                if (fileSizeMb > MAX_VIDEO_SIZE_MB) {
                    toastRef.current.show({
                        type: 'error',
                        headerText: 'File Size Error',
                        text:`Maximum file size allowed is ${MAX_VIDEO_SIZE_MB}MB.`
                    })
                    return
                }

                const dataType = getDataType(result.assets[0].uri)
                if (dataType !== 'video') {
                    toastRef.current.show({
                        type: 'error',
                        headerText: 'Invalid File Type',
                        text:`Please upload a supported file type.`
                    })
                    return
                }

                uploadVideo()
            } catch (e) {
                console.error(e)
                toastRef.current.show({
                    type: 'error',
                    text: `Video could not be uploaded.`
                })
            }
        }
    }

    const uploadVideo = async (videoUri) => {
        const thumbnail = await generateThumbnailFromLocalURI(videoUri, 0)
        const blurhash = await encodeImageToBlurhash(thumbnail)

    }

    const onDeleteVideoPress = (videoId) => {
        const toDelete = userData.videos.find(video => video.id === videoId)

    }

    const onAddNewImagePress = () => {

    }

    const onShowRejectedReasonPress = () => {

    }

    const activeActions = [
        {
            label: 'Delete',
            onPress: onDeleteVideoPress
        }
    ]

    const inReviewActions = [
        {
            label: 'Delete',
            onPress: onDeleteVideoPress,
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
            onPress: onDeleteVideoPress
        }
    ]

    const renderVideos = (videos, actions, showActions=true) => {
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
                    <View key={video.id} style={isSmallScreen ? smallImageContainerStyles : largeImageContainerStyles}>
                        <RenderVideoWithActions video={video} actions={actions} offsetX={(windowWidth * index) + offsetX} showActions={showActions} />
                    </View>)}
            </View>
        )

    }

    const Active = useCallback(() => (
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

            {
                data.active.length === 0 ?
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                        No active videos
                    </Text>
                    : renderVideos(data.active, activeActions)
            }
        </View>
    ), [sectionWidth, data.active])

    const InReview = useCallback(() => {
        
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Octicons name="dot-fill" size={20} color="yellow" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        In review
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.inReview.length}
                    </Text>
                </View>

                {
                    data.inReview.length === 0 ?
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                            No videos in review
                        </Text>
                        : renderVideos(data.inReview, inReviewActions, userData.status !== IN_REVIEW)
                }
            </View>
        )
    }, [data.inReview, sectionWidth])

    const Rejected = useCallback(() => {
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
    }, [data.rejected, sectionWidth])

    return (
        <View style={{ paddingBottom: SPACING.large }} onLayout={onLayout}>
            {userData.status !== IN_REVIEW && <Active />}
            <InReview />
            <Rejected />
        </View>
    )
}

const mapStateToProps = (store) => ({
    toastRef: store.appState.toastRef
})

export default connect(mapStateToProps)(memo(Videos))

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