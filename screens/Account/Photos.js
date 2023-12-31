import React, {useState, memo} from 'react'
import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../constants'
import { normalize } from '../../utils'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const Photos = ({ navigation, route, setTabHeight }) => {
    const [data, setData] = useState({
        images: [require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png'), require('../../assets/dummy_photo.png')]
    })

    const onEditImagePress = (index) => {

    }

    const onSelectImagePress = (index) => {

    }

    return (
        <View onLayout={(event) => setTabHeight(event.nativeEvent.layout.height )} style={{ paddingVertical: SPACING.large, }}>
            <Text style={{ color: '#FFF', fontFamily: FONTS.bold, fontSize: FONT_SIZES.h3, marginBottom: SPACING.small }}>
                Cover photos
            </Text>

            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', flexShrink: 1, marginRight: SPACING.xxx_small, }}>
                    {data.images[0] ?
                        <>
                            <Image
                                style={{
                                    aspectRatio: 3 / 4,
                                    width: 'auto',
                                    borderRadius: 10
                                }}
                                source={{ uri: data.images[0] }}
                                placeholder={blurhash}
                                resizeMode="cover"
                                transition={200}
                            />
                            <IconButton
                                style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                icon="pencil-outline"
                                iconColor='white'
                                size={normalize(20)}
                                onPress={() => onEditImagePress(0)}
                            />
                        </> :

                        <TouchableRipple
                            onPress={() => onSelectImagePress(0)}
                            style={{ backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', width: 'auto', aspectRatio: 3 / 4, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
                        >
                            <Ionicons name="image-outline" size={normalize(30)} color="black" />
                        </TouchableRipple>
                    }
                </View>
                <View style={{ flexDirection: 'column', width: '50%', flexShrink: 1 }}>
                    <View style={{ flexDirection: 'row', marginBottom: SPACING.xxx_small, flexGrow: 1 }}>

                        <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                            {data.images[1] ?
                                <>
                                    <Image
                                        style={{
                                            flex: 1,
                                            aspectRatio: 3 / 4,
                                            borderRadius: 10
                                        }}
                                        source={{ uri: data.images[1] }}
                                        placeholder={blurhash}
                                        resizeMode="cover"
                                        transition={200}
                                    />
                                    <IconButton
                                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                        icon="pencil-outline"
                                        iconColor='white'
                                        size={normalize(20)}
                                        onPress={() => onEditImagePress(1)}
                                    />
                                </> :

                                <TouchableRipple
                                    onPress={() => onSelectImagePress(1)}
                                    style={{ backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, flex: 1 }}
                                >
                                    <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                </TouchableRipple>

                            }
                        </View>


                        <View style={{ flex: 1 }}>
                            {data.images[2] ?
                                <>
                                    <Image
                                        style={{
                                            flex: 1,
                                            borderRadius: 10,
                                            aspectRatio: 3 / 4
                                        }}
                                        source={{ uri: data.images[2] }}
                                        placeholder={blurhash}
                                        resizeMode="cover"
                                        transition={200}
                                    />
                                    <IconButton
                                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                        icon="pencil-outline"
                                        iconColor='white'
                                        size={normalize(20)}
                                        onPress={() => onEditImagePress(2)}
                                    />
                                </> :

                                <TouchableRipple
                                    onPress={() => onSelectImagePress(2)}
                                    style={{ backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, borderTopRightRadius: 20, flex: 1, }}
                                >
                                    <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                </TouchableRipple>

                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexGrow: 1 }}>

                        <View style={{ flex: 1, marginRight: SPACING.xxx_small }}>
                            {data.images[3] ?
                                <>
                                    <Image
                                        style={{
                                            flex: 1,
                                            aspectRatio: 3 / 4,
                                            borderRadius: 10
                                        }}
                                        source={{ uri: data.images[3] }}
                                        placeholder={blurhash}
                                        resizeMode="cover"
                                        transition={200}
                                    />
                                    <IconButton
                                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                        icon="pencil-outline"
                                        iconColor='white'
                                        size={normalize(20)}
                                        onPress={() => onEditImagePress(3)}
                                    />
                                </>
                                :
                                <TouchableRipple
                                    onPress={() => onSelectImagePress(3)}
                                    style={{ backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, flex: 1, }}
                                >
                                    <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                </TouchableRipple>
                            }
                        </View>

                        <View style={{ flex: 1 }}>
                            {data.images[4] ?
                                <>
                                    <Image
                                        style={{
                                            flex: 1,
                                            borderRadius: 10,
                                            aspectRatio: 3 / 4
                                        }}
                                        source={{ uri: data.images[4] }}
                                        placeholder={blurhash}
                                        resizeMode="cover"
                                        transition={200}
                                    />
                                    <IconButton
                                        style={{ position: 'absolute', top: normalize(10) - SPACING.xxx_small, right: normalize(10) - SPACING.xxx_small, backgroundColor: 'rgba(40,40,40,0.9)' }}
                                        icon="pencil-outline"
                                        iconColor='white'
                                        size={normalize(20)}
                                        onPress={() => onEditImagePress(4)}
                                    />
                                </> :
                                <TouchableRipple
                                    onPress={() => onSelectImagePress(4)}
                                    style={{ backgroundColor: COLORS.lightGrey, alignItems: 'center', justifyContent: 'center', aspectRatio: 3 / 4, borderBottomRightRadius: 20, flex: 1, }}
                                >
                                    <Ionicons name="image-outline" size={normalize(30)} color="black" />
                                </TouchableRipple>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default memo(Photos)