import React, { useState, memo } from 'react'
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, FONTS, FONT_SIZES, SPACING, MAX_PHOTO_SIZE_MB, MAX_VIDEO_SIZE_MB, MAX_VIDEOS, MAX_PHOTOS } from '../../constants'
import { normalize } from '../../utils'
import { IconButton, Button, TouchableRipple } from 'react-native-paper'
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons'
import DropdownSelect from '../../components/DropdownSelect'
import RenderImageWithActions from '../../components/list/RenderImageWithActions'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const Photos = ({ index, setTabHeight, offsetX = 0 }) => {
    const [data, setData] = useState({
        active: [require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png')],
        pending: [require('../../assets/CATEGORY1.png'), require('../../assets/CATEGORY2.png'), require('../../assets/CATEGORY3.png'),],
        rejected: [require('../../assets/dummy_photo.png')]
    })
    const [sectionWidth, setSectionWidth] = useState(0)

    const { width: windowWidth } = useWindowDimensions()

    const onLayout = (event) => {
       setTabHeight(event.nativeEvent.layout.height )
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

    const activeImageActions = [
        {
            label: 'Edit',
            onPress: onEditImagePress
        },
        {
            label: 'Delete',
            onPress: onDeleteImagePress
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

    const renderPhotosGrid = () => {

        return (
            <View style={{ flexDirection: 'row', marginHorizontal: SPACING.small, marginBottom: SPACING.small }}>
                <View style={{ width: '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                    {data.active[0] ? <><Image
                        style={{
                            aspectRatio: 3 / 4,
                            width: 'auto',
                            borderRadius: 10
                        }}
                        source={{ uri: data.active[0] }}
                        placeholder={blurhash}
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
                            <Image
                                style={{
                                    flex: 1,
                                    aspectRatio: 3 / 4,
                                    borderRadius: 10
                                }}
                                source={{ uri: data.active[1] }}
                                placeholder={blurhash}
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
                        </View>


                        <View style={{ flex: 1 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    borderRadius: 10,
                                    aspectRatio: 3 / 4
                                }}
                                source={{ uri: data.active[2] }}
                                placeholder={blurhash}
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
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexGrow: 1 }}>

                        <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                            <Image
                                style={{
                                    flex: 1,
                                    aspectRatio: 3 / 4,
                                    borderRadius: 10
                                }}
                                source={{ uri: data.active[3] }}
                                placeholder={blurhash}
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
                        </View>

                        <View style={{ flex: 1 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    borderRadius: 10,
                                    aspectRatio: 3 / 4
                                }}
                                source={{ uri: data.active[4] }}
                                placeholder={blurhash}
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
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderPhotos = (images, actions, showAddMoreButton = false) => {

        return (
            <View style={{ flexDirection: 'row', marginLeft: SPACING.small, marginRight: SPACING.small - SPACING.small, marginBottom: SPACING.small, flexWrap: 'wrap' }}>
                {images.map((image) =>
                    <View key={image ?? Math.random()} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 10, overflow: 'hidden', width: ((sectionWidth - (SPACING.small * 2) - (SPACING.small * 2)) / 3), marginRight: SPACING.small, marginBottom: SPACING.small }}>
                        <RenderImageWithActions image={image} actions={actions} offsetX={(windowWidth * index) + offsetX}/>
                    </View>)}

                {showAddMoreButton &&
                    <TouchableRipple
                        rippleColor={'rgba(255,255,255,.08)'}
                        onPress={onAddNewImagePress}
                        style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', borderRadius: 10, overflow: 'hidden', width: ((sectionWidth - (SPACING.small * 2) - (SPACING.small * 2)) / 3), marginRight: SPACING.small, marginBottom: SPACING.small, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <>
                            <AntDesign name="plus" size={normalize(30)} color="white" />
                            <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: '#FFF' }}>Add more</Text>
                        </>
                    </TouchableRipple>}
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

                    {((data.active.length + data.pending.length) < MAX_PHOTOS) && <Button
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

                {renderPhotosGrid()}
                {renderPhotos(data.active.slice(5), activeImageActions)}
            </View>
        )
    }

    const renderPending = () => {
        
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Octicons name="dot-fill" size={20} color="yellow" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        In review
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.pending.length}
                    </Text>
                </View>

                {
                    data.pending.length === 0 ?
                        <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                            No photos under review
                        </Text>
                        : renderPhotos(data.pending, pendingImageActions)
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

                {renderPhotos(data.rejected, rejectedImageActions)}
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

export default memo(Photos)

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