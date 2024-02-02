import React, { useState, memo, useCallback, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, Modal } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, FONTS, FONT_SIZES, SPACING, MAX_PHOTO_SIZE_MB, MAX_PHOTOS } from '../../constants'
import { ACTIVE, REJECTED, IN_REVIEW } from '../../labels'
import { normalize, getFileSizeInMb, getDataType, encodeImageToBlurhash } from '../../utils'
import { IconButton, Button, TouchableRipple } from 'react-native-paper'
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons'
import DropdownSelect from '../../components/DropdownSelect'
import RenderImageWithActions from '../../components/list/RenderImageWithActions'
import * as ImagePicker from 'expo-image-picker'

import { connect } from 'react-redux'

const Photos = ({ index, setTabHeight, offsetX = 0, userData, toastRef }) => {
    const [data, setData] = useState({
        active: [],
        inReview: [],
        rejected: []
    })

    useEffect(() => {
        const active = userData.images.filter(image => image.status === ACTIVE)
        const inReview = userData.images.filter(image => image.status === IN_REVIEW)
        const rejected = userData.images.filter(image => image.status === REJECTED)

        setData({
            active, inReview, rejected
        })
    }, [userData.images])

    const [sectionWidth, setSectionWidth] = useState(0)

    const { width: windowWidth } = useWindowDimensions()

    const onLayout = (event) => {
        setTabHeight(event.nativeEvent.layout.height)
        setSectionWidth(event.nativeEvent.layout.width - 2)
    }

    const openImagePicker = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            //aspect: [4, 3],
            quality: 0.8,
        })

        if (!result.canceled) {
            try {
                const fileSizeMb = getFileSizeInMb(result.assets[0].uri)
                if (fileSizeMb > MAX_PHOTO_SIZE_MB) {
                    toastRef.current.show({
                        type: 'error',
                        headerText: 'File Size Error',
                        text: `Maximum file size allowed is ${MAX_PHOTO_SIZE_MB}MB.`
                    })
                    return
                }

                const dataType = getDataType(result.assets[0].uri)
                if (dataType !== 'image') {
                    toastRef.current.show({
                        type: 'error',
                        headerText: 'Invalid File Type',
                        text: `Please upload a supported file type.`
                    })
                    return
                }

                uploadImage(result.assets[0].uri, index)

                /*setData(d => {
                    d.images[index] = {image: result.assets[0].uri, id: uuid.v4(), status: ACTIVE, blurhash}
                    if (index > 0 && d.images.length < MAX_PHOTOS) {
                        d.images.push(null)
                    }
                    return { ...d }
                })*/
            } catch (e) {
                console.error(e)
                toastRef.current.show({
                    type: 'error',
                    text: `Image could not be uploaded.`
                })
            }
        }
    }

    const uploadImage = async (imageUri, index) => {
        //if index = undefined -> it's a new image -> assign next index
        //if index = number -> assign the image selected index (when photo will be approved, it will replace the current cover image)
        //if there's already existing in review image for selected cover photo -> display a confirmation window saying it will replace the current in review image

        const blurhash = await encodeImageToBlurhash(imageUri)

    }

    //only cover photos can be edited
    const onEditImagePress = (imageId) => {
        //check if image on
    }

    const onDeleteImagePress = (imageId) => {
        const toDelete = userData.images.find(image => image.id === imageId)
        //deleting image in review when profile is in review
        if (toDelete.status === IN_REVIEW && userData.status === IN_REVIEW) {
            toastRef.current.show({
                type: 'warning',
                headerText: 'Profile is in review',
                text: 'You can not delete this photo, your profile is currently in review.'
            })
        }
    }

    const onAddNewImagePress = () => {

    }

    const onShowRejectedReasonPress = () => {

    }

    //active cover image => display edit icon
    //active additional image -> display delete icon
    const activeImageActions = [
        {
            label: 'Edit',
            onPress: onEditImagePress
        }
    ]

    const pendingImageActions = [
        {
            label: 'Delete',
            onPress: onDeleteImagePress,
            iconName: 'delete-outline'
        }
    ]

    const rejectedImageActions = [
        {
            label: 'Show rejection reason',
            onPress: onShowRejectedReasonPress
        },
        {
            label: 'Delete',
            onPress: onDeleteImagePress
        }
    ]

    const PhotosGrid = () => (
        <View style={{ flexDirection: 'row', marginHorizontal: SPACING.small, marginBottom: SPACING.small }}>
            <View style={{ width: '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                {data.active[0] ? <><Image
                    style={{
                        aspectRatio: 3 / 4,
                        width: 'auto',
                        borderRadius: 10
                    }}
                    source={{ uri: data.active[0].downloadUrl }}
                    placeholder={data.active[0].blurhash}
                    resizeMode="cover"
                    transition={200}
                />
                    <IconButton
                        style={{ position: 'absolute', top: 2, right: 2, }}
                        containerColor={COLORS.grey + 'B3'}
                        icon="pencil-outline"
                        iconColor='white'
                        size={normalize(20)}
                        onPress={() => onEditImagePress(0)}
                    />
                </>
                    :
                    <TouchableRipple
                        rippleColor={'rgba(255,255,255,.08)'}
                        onPress={() => onEditImagePress(0)}
                        style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                    >
                        <>
                            <AntDesign name="plus" size={normalize(30)} color="white" />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                        </>
                    </TouchableRipple>}
            </View>
            <View style={{ flexDirection: 'column', width: '50%', flexShrink: 1 }}>
                <View style={{ flexDirection: 'row', marginBottom: SPACING.xxx_small, flexGrow: 1 }}>

                    <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                        {data.active[1] ? (
                            <>
                                <Image
                                    style={{
                                        flex: 1,
                                        aspectRatio: 3 / 4,
                                        borderRadius: 10
                                    }}
                                    source={{ uri: data.active[1].downloadUrl }}
                                    placeholder={data.active[1].blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <IconButton
                                    style={{ position: 'absolute', top: 2, right: 2, }}
                                    containerColor={COLORS.grey + 'B3'}
                                    icon="pencil-outline"
                                    iconColor='white'
                                    size={normalize(20)}
                                    onPress={() => onEditImagePress(1)}
                                />
                            </>
                        ) : <TouchableRipple
                            rippleColor={'rgba(255,255,255,.08)'}
                            onPress={() => onEditImagePress(1)}
                            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                        >
                            <>
                                <AntDesign name="plus" size={normalize(30)} color="white" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                            </>
                        </TouchableRipple>}
                    </View>


                    <View style={{ flex: 1 }}>
                        {data.active[2] ? (
                            <>
                                <Image
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                        aspectRatio: 3 / 4
                                    }}
                                    source={{ uri: data.active[2].downloadUrl }}
                                    placeholder={data.active[2].blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <IconButton
                                    style={{ position: 'absolute', top: 2, right: 2, }}
                                    containerColor={COLORS.grey + 'B3'}
                                    icon="pencil-outline"
                                    iconColor='white'
                                    size={normalize(20)}
                                    onPress={() => onEditImagePress(2)}
                                />
                            </>
                        ) : <TouchableRipple
                            rippleColor={'rgba(255,255,255,.08)'}
                            onPress={() => onEditImagePress(2)}
                            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                        >
                            <>
                                <AntDesign name="plus" size={normalize(30)} color="white" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                            </>
                        </TouchableRipple>}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', flexGrow: 1 }}>

                    <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                        {data.active[3] ? (
                            <>
                                <Image
                                    style={{
                                        flex: 1,
                                        aspectRatio: 3 / 4,
                                        borderRadius: 10
                                    }}
                                    source={{ uri: data.active[3].downloadUrl }}
                                    placeholder={data.active[3].blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />
                                <IconButton
                                    style={{ position: 'absolute', top: 2, right: 2, }}
                                    containerColor={COLORS.grey + 'B3'}
                                    icon="pencil-outline"
                                    iconColor='white'
                                    size={normalize(20)}
                                    onPress={() => onEditImagePress(3)}
                                />
                            </>
                        ) : <TouchableRipple
                            rippleColor={'rgba(255,255,255,.08)'}
                            onPress={() => onEditImagePress(3)}
                            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                        >
                            <>
                                <AntDesign name="plus" size={normalize(30)} color="white" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                            </>
                        </TouchableRipple>}
                    </View>

                    <View style={{ flex: 1 }}>
                        {data.active[4] ? (
                            <>
                                <Image
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                        aspectRatio: 3 / 4
                                    }}
                                    source={{ uri: data.active[4].downloadUrl }}
                                    placeholder={data.active[4].blurhash}
                                    resizeMode="cover"
                                    transition={200}
                                />

                                <IconButton
                                    style={{ position: 'absolute', top: 2, right: 2, }}
                                    containerColor={COLORS.grey + 'B3'}
                                    icon="pencil-outline"
                                    iconColor='white'
                                    size={normalize(20)}
                                    onPress={() => onEditImagePress(4)}
                                />
                            </>
                        ) : <TouchableRipple
                            rippleColor={'rgba(255,255,255,.08)'}
                            onPress={() => onEditImagePress(4)}
                            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                        >
                            <>
                                <AntDesign name="plus" size={normalize(30)} color="white" />
                                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                            </>
                        </TouchableRipple>}
                    </View>
                </View>
            </View>
        </View>
    )

    const CoverPhoto = () => (
        <View style={{ flexDirection: 'row', marginHorizontal: SPACING.small, marginBottom: SPACING.small }}>
            {userData.images[0] ?
                <React.Fragment>
                    <Image
                        style={{
                            flex: 1,
                            borderRadius: 10,
                            aspectRatio: 16 / 9,
                        }}
                        source={{ uri: userData.images[0].downloadUrl }}
                        placeholder={userData.images[0].blurhash}
                        resizeMode="cover"
                        transition={200}
                    />
                    <IconButton
                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: COLORS.grey + 'B3' }}
                        icon="pencil-outline"
                        iconColor='white'
                        size={normalize(20)}
                        onPress={() => onEditImagePress(0)}
                    />
                </React.Fragment> :
                <TouchableRipple
                    rippleColor={'rgba(255,255,255,.08)'}
                    onPress={() => onEditImagePress(0)}
                    style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderRadius: 10 }}
                >
                    <>
                        <AntDesign name="plus" size={normalize(30)} color="white" />
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add</Text>
                    </>
                </TouchableRipple>
            }
        </View>
    )

    const AdditionalPhotos = ({ images, actions, showActions = true }) => {
        if (!images?.length) {
            return null
        }

        return (
            <View style={{ flexDirection: 'row', marginLeft: SPACING.small, marginRight: SPACING.small - SPACING.small, marginBottom: SPACING.small, flexWrap: 'wrap' }}>
                {images.map((image) =>
                    <View key={image.id} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 10, overflow: 'hidden', width: ((sectionWidth - (SPACING.small * 2) - (SPACING.small * 2)) / 3), marginRight: SPACING.small, marginBottom: SPACING.small }}>
                        <RenderImageWithActions image={image} actions={actions} offsetX={(windowWidth * index) + offsetX} showActions={showActions} />
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

                {((data.active.length + data.inReview.length) < MAX_PHOTOS) && <Button
                    labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.medium, color: '#FFF' }}
                    style={{ height: 'auto' }}
                    mode="outlined"
                    icon="plus"
                    onPress={onAddNewImagePress}
                    rippleColor="rgba(220, 46, 46, .16)"
                >
                    Add photo
                </Button>}
            </View>

            {userData.accountType === 'establishment' && <CoverPhoto />}
            {userData.accountType === 'lady' && <PhotosGrid />}
            <AdditionalPhotos images={data.active.slice(5)} actions={activeImageActions} />
        </View>
    ), [data.active, sectionWidth])

    const InReview = useCallback(() => {
        if (data.inReview.length === 0) {
            return null
        }

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
                            No photos in review
                        </Text>
                        : <AdditionalPhotos images={data.inReview} actions={pendingImageActions} showActions={userData.status !== IN_REVIEW} />
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

                <AdditionalPhotos images={data.rejected} actions={rejectedImageActions} />
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

export default connect(mapStateToProps)(memo(Photos))

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
    }
})