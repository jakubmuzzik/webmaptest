import React, { useMemo, useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { COLORS, SPACING, SUPPORTED_LANGUAGES } from '../constants'
import { stripEmptyParams } from '../utils'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import HoverableView from '../components/HoverableView'
import { Link } from '@react-navigation/native'
import { useNavigationState } from '@react-navigation/native'

const images = [require('../assets/dummy_photo.png'), require('../assets/dummy_photo.png'), require('../assets/dummy_photo.png')]

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const ProfilePhotosList = ({ navigation, route }) => {
    const params = useMemo(() => ({
        language: SUPPORTED_LANGUAGES.includes(decodeURIComponent(route.params.language)) ? decodeURIComponent(route.params.language) : '',
        id: route.params.id
    }), [route.params])

    const [photos, setPhotos] = useState(route.params.photos)

    const routes = useNavigationState(state => state.routes)

    useEffect(() => {
        if (!photos) {
            //TODO - load photos from database
            setPhotos(images)
        }
    }, [photos])
    
    const onGoBackPress = () => {
        if(navigation.canGoBack() && routes?.length > 1 && routes[1].name === 'Profile') {
            navigation.goBack()
        } else {
            navigation.replace('Profile', { ...stripEmptyParams(params) })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
            <View style={{ height: 60, backgroundColor: COLORS.grey, justifyContent: 'center' }}>
                <Ionicons onPress={onGoBackPress} name="arrow-back" size={25} color="white" style={{ marginLeft: SPACING.medium }} />
            </View>

            <ScrollView contentContainerStyle={{ flexDirection: 'column', alignItems: 'center', paddingHorizontal: SPACING.large, paddingTop: SPACING.large }}>
                {!!photos && photos.map((photo, index) => (
                    <Link key={photo + index} to={{ screen: 'Gallery', params: { ...stripEmptyParams(params), photos, index } }} style={{ width: '20%', marginBottom: SPACING.medium, }}>
                        <HoverableView style={{ width: '100%' }} hoveredOpacity={0.8}>
                            <Image
                                style={{
                                    aspectRatio: 3 / 4,
                                    marginBottom: SPACING.medium
                                }}
                                source={photo}
                                placeholder={blurhash}
                                resizeMode="contain"
                                transition={200}
                            />
                        </HoverableView>
                    </Link>
                ))}
            </ScrollView>
        </View>
    )
}

export default ProfilePhotosList