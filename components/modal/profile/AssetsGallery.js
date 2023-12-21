import React, { useMemo, useState, useEffect, useRef, memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import { COLORS, SPACING, SUPPORTED_LANGUAGES } from '../../../constants'
import { stripEmptyParams } from '../../../utils'
import Gallery from 'react-native-awesome-gallery'
import { Image } from 'expo-image'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const images = [require('../../../assets/dummy_photo.png'), require('../../../assets/dummy_photo.png'), require('../../../assets/dummy_photo.png')]

const renderItem = ({
    item,
    setImageDimensions,
}) => {
    return (
        <Image
            source={item}
            style={StyleSheet.absoluteFillObject}
            resizeMode="contain"
            onLoad={(e) => {
                const { width, height } = e.source
                setImageDimensions({ width, height })
            }}
        />
    );
}

const AssetsGallery = ({ assets, pressedAssetIndex, setPressedAssetIndex, onClosePress }) => {
    // const params = useMemo(() => ({
    //     language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
    //     id: route.params.id
    // }), [route.params])

    const { width, height } = useWindowDimensions()

    const gallery = useRef()

    const [index, setIndex] = useState(pressedAssetIndex)

    useEffect(() => {        
        if (!isNaN(pressedAssetIndex)) {
            gallery.current?.setIndex(pressedAssetIndex)
        }
    }, [pressedAssetIndex])

    const goBack = () => {
        setPressedAssetIndex(undefined)
    }

    const onNextPress = () => {
        gallery.current?.setIndex(
            index === images.length - 1
                ? 0
                : index + 1,
            true
        )
    }

    const onPrevPress = () => {
        gallery.current?.setIndex(
            index === 0
                ? images.length - 1
                : index - 1,
            true
        )
    }

    return (
        <View style={{ flex: 1, overflow: 'hidden', backgroundColor: COLORS.lightBlack }}>
            <View style={{
                height: 60,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 3
            }}>
                <Ionicons name="arrow-back" size={25} color='#FFF' onPress={goBack} style={{ marginLeft: SPACING.medium }} />
                <View>
                    {assets && <Text style={styles.headerText}>
                        {index + 1} of {images.length}
                    </Text>}
                </View>
                <Ionicons name="close" size={25} color='#FFF' style={{ marginRight: SPACING.medium }} onPress={onClosePress} />
            </View>

            {assets && (
                <>
                    <Gallery
                        style={{ backgroundColor: COLORS.lightBlack, marginTop: 40 }}
                        containerDimensions={{ width, height: height - 60 * 2 - 40 * 2 }}
                        ref={gallery}
                        data={images}
                        keyExtractor={(item, index) => item + index}
                        renderItem={renderItem}
                        initialIndex={index}
                        numToRender={3}
                        doubleTapInterval={150}
                        onIndexChange={(index) => setIndex(index)}
                        onSwipeToClose={goBack}
                        loop
                        onScaleEnd={(scale) => {
                            if (scale < 0.8) {
                                goBack()
                            }
                        }}
                    />

                    <View style={{
                        position: 'absolute',
                        opacity: 0.7,
                        left: SPACING.xx_large,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MaterialIcons onPress={onPrevPress}
                            style={{
                                borderRadius: 35,
                                backgroundColor: '#FFF',
                                padding: 3,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,
                                elevation: 9,
                            }}
                            name="keyboard-arrow-left"
                            size={35}
                            color={COLORS.lightBlack}
                        />
                    </View>

                    <View style={{
                        position: 'absolute',
                        opacity: 0.7,
                        right: SPACING.xx_large,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MaterialIcons onPress={onNextPress}
                            style={{
                                borderRadius: 35,
                                backgroundColor: '#FFF',
                                padding: 3,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.32,
                                shadowRadius: 5.46,
                                elevation: 9,
                            }}
                            name="keyboard-arrow-right"
                            size={35}
                            color={COLORS.lightBlack}
                        />
                    </View>
                </>
            )}
        </View>
    )
}

export default memo(AssetsGallery)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden'
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toolbar: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    bottomToolBar: {
        bottom: 0,
    },
    headerText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
})