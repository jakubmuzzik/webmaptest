import React, { useState, createRef, useMemo, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, SUPPORTED_LANGUAGES } from '../../constants'
import { normalize, encodeImageToBlurhash, getParam, stripEmptyParams } from '../../utils'
import { ProgressBar, Button } from 'react-native-paper'

import LoginInformation from './steps/LoginInformation'
import PersonalDetails from './steps/PersonalDetails'
import ServicesAndPricing from './steps/ServicesAndPricing'
import LocationAndAvailability from './steps/LocationAndAvailability'
import UploadPhotos from './steps/UploadPhotos'
import LadyRegistrationCompleted from './steps/LadyRegistrationCompleted'

import { TabView } from 'react-native-tab-view'
import { MotiView } from 'moti'
import LottieView from 'lottie-react-native'
import { BlurView } from 'expo-blur'

import { connect } from 'react-redux'
import { showToast, updateCurrentUserInRedux, updateLadyInRedux } from '../../redux/actions'
import { IN_REVIEW } from '../../labels'
import { useSearchParams, useNavigate } from 'react-router-dom'
import uuid from 'react-native-uuid'

import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, setDoc, doc, db, ref, uploadBytes, storage, getDownloadURL, uploadBytesResumable } from '../../firebase/config'

const LadySignup = ({ independent=false, showHeaderText = true, offsetX = 0, showToast, updateCurrentUserInRedux, updateLadyInRedux}) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])


    const [nextButtonIsLoading, setNextButtonIsLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [index, setIndex] = useState(0)
    const [contentWidth, setContentWidth] = useState(normalize(800))

    const [routes] = useState(
        [
            { key: 'login_information' },
            { key: 'personal_details' },
            { key: 'services_and_pricing' },
            { key: 'address_and_availability' },
            { key: 'photos_and_videos' },
            { key: 'registration_completed' }
        ]
        .filter(r => r.key === 'login_information' ? independent : true)
        .map((r, index) => ({...r, ref: createRef(), index}))
    )

    const paginageNext = () => {
        setIndex(index => index + 1)
    }

    const paginateBack = () => {
        setIndex(index => index - 1)
    }

    const onNextPress = async () => {
        if (nextButtonIsLoading) {
            return
        }

        setNextButtonIsLoading(true)
        try {
            const isValid = await routes[index].ref.current.validate()
            if (!isValid) {
                return
            }

            if (index === Object.keys(routes).length - 2) {
                setUploading(true)
                await uploadUser()
            }

            paginageNext()
        } catch(e) {
            console.error(e)
            showToast({
                type: 'error',
                text: 'Data could not be processed.'
            })
        } finally {
            setNextButtonIsLoading(false)
            setUploading(false)
        }
    }

    const uploadUser = async () => {
        let data = {}
        routes.slice(0, routes.length - 1).forEach(route => data = { ...data, ...route.ref.current.data })
        data.status = IN_REVIEW

        if (!independent) {
            const response = await createUserWithEmailAndPassword(getAuth(), data.email, data.password)

            delete data.password
    
            await sendEmailVerification(response.user)
        }

        let urls = await Promise.all([
            ...data.images.map(image => uploadAssetToFirestore(image.image, 'photos/' + getAuth().currentUser.uid + '/' + image.id)),
            ...data.videos.map(video => uploadAssetToFirestore(video.video, 'videos/' + getAuth().currentUser.uid + '/' + video.id + '/video')),
            ...data.videos.map(video => uploadAssetToFirestore(video.thumbnail, 'videos/' + getAuth().currentUser.uid + '/' + video.id + '/thumbnail')),
        ])

        const imageURLs = urls.splice(0, data.images.length)
        const videoURLs = urls.splice(0, data.videos.length)
        const thumbanilURLs = urls.splice(0, data.videos.length)

        data.images.forEach((image, index) => {
            delete image.image
            image.videoURLs = videoURLs[index]
        })

        data.videos.forEach((video, index) => {
            delete video.video
            delete video.thumbnail

            video.downloadUrl = imageURLs[index]
            video.thumbnailDownloadUrl = thumbanilURLs[index]
        })

        /*const imageBlurhashes = await Promise.all([
            ...data.images.map(image => encodeImageToBlurhash(image.image))
        ])

        for (let i = 0; i < data.images.length; i++) {
            data.images[i] = {...data.images[i], blurhash: imageBlurhashes[i]}
        }

        const videoThumbnailsBlurhashes = await Promise.all([
            ...data.videos.map(video => encodeImageToBlurhash(video.thumbnail))
        ])

        for (let i = 0; i < data.videos.length; i++) {
            data.videos[i] = {...data.videos[i], blurhash: videoThumbnailsBlurhashes[i]}
        }*/

        data = {
            ...data,
            id: independent ? getAuth().currentUser.uid : uuid.v4(),
            nameLowerCase: data.name.toLowerCase(),
            createdDate: new Date(),
            accountType: 'lady',
            independent
        }

        if (!independent) {
            data.establishmentId = getAuth().currentUser.uid
        }

        await setDoc(doc(db, 'users', data.id), data)

        if (independent) {
            updateCurrentUserInRedux(data)
        } else {
            updateLadyInRedux(data)
        }
    }

    const uploadAssetToFirestore = async (assetUri, assetPath) => {
        const imageRef = ref(storage, assetPath)
    
        const response = await fetch(assetUri)
        const blob = await response.blob()

        /*const uploadTask = uploadBytesResumable(imageRef, blob)

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.error('upload error: ', error)
            },
            () => {
                console.log('upload finished')
            }
        );

        await uploadTask
        
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        */

        const result = await uploadBytes(imageRef, blob)

        const downloadURL = await getDownloadURL(result.ref)

        
    
        return downloadURL
    }

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'login_information':
                return <LoginInformation ref={route.ref} i={route.index} contentWidth={contentWidth} showToast={showToast} />
            case 'personal_details':
                return <PersonalDetails ref={route.ref} i={route.index} contentWidth={contentWidth} offsetX={offsetX} />
            case 'services_and_pricing':
                return <ServicesAndPricing ref={route.ref} i={route.index} contentWidth={contentWidth} offsetX={offsetX} />
            case 'address_and_availability':
                return <LocationAndAvailability ref={route.ref} i={route.index} contentWidth={contentWidth} />
            case 'photos_and_videos':
                return <UploadPhotos ref={route.ref} i={route.index} showToast={showToast} />
            case 'registration_completed':
                return <LadyRegistrationCompleted independent={independent} visible={index === routes.length - 1} email={''} />
        }
    }

    const progress = (index) / (Object.keys(routes).length - 1)

    return (
        <View style={{ height: '100%', backgroundColor: COLORS.lightBlack }}>
            <View style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', }}>
                {showHeaderText && <Text style={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.h1, marginHorizontal: SPACING.medium, marginVertical: SPACING.small, color: '#FFF' }}>
                    {independent ? 'Lady sign up' : 'Add Lady'}
                </Text>}
                <ProgressBar style={{ marginHorizontal: SPACING.medium, borderRadius: 10 }} progress={progress == 0 ? 0.01 : progress} color={COLORS.error} />
            </View>
            <MotiView
                from={{
                    opacity: 0,
                    transform: [{ translateY: 40 }],
                }}
                animate={{
                    opacity: 1,
                    transform: [{ translateY: 0 }],
                }}
                transition={{
                    type: 'timing',
                    duration: 400,
                }}
                style={{ width: normalize(800), maxWidth: '100%', alignSelf: 'center', flex: 1, backgroundColor: COLORS.lightBlack, alignItems: 'center', justifyContent: 'center', padding: SPACING.medium }}>
                <View
                    style={{ flex: 1, maxWidth: '100%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' }}
                    onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
                >
                    {/* <View style={{ marginBottom: SPACING.small, marginTop: SPACING.large, marginHorizontal: SPACING.x_large, }}>
                        <ProgressBar progress={(index) / Object.keys(routes).length} color={COLORS.error} />
                    </View> */}

                    <TabView
                        renderTabBar={props => null}
                        swipeEnabled={false}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: contentWidth }}
                    />

                    {index !== routes.length - 1 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: SPACING.x_large, marginVertical: SPACING.small, }}>
                        {index === 0 ? <View /> : <Button
                            labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#000' }}
                            style={{ flexShrink: 1, borderRadius: 10, borderWidth: 0 }}
                            rippleColor="rgba(0,0,0,.1)"
                            mode="outlined"
                            onPress={paginateBack}
                        >
                            Back
                        </Button>}

                        <Button
                            labelStyle={{ fontFamily: FONTS.bold, fontSize: FONT_SIZES.large, color: '#FFF' }}
                            style={{ flexShrink: 1, borderRadius: 10 }}
                            buttonColor={index === Object.keys(routes).length - 2 ? COLORS.red : COLORS.lightBlack}
                            rippleColor="rgba(220, 46, 46, .16)"
                            mode="contained"
                            onPress={onNextPress}
                            loading={nextButtonIsLoading}
                        >
                            {index === Object.keys(routes).length - 2 ? 'Sign up' : 'Next'}
                        </Button>
                    </View>}

                    {uploading && (
                        <MotiView 
                            style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(80,80,80,0.6)' }}
                            from={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1
                            }}
                        >
                            <BlurView intensity={20} style={{ height: '100%', width: '100%' }}>
                                <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.6)', alignItems: "center", justifyContent: 'center' }}>
                                    <LottieView
                                        style={{ width: '50%', minWidth: 250, maxWidth: '90%' }}
                                        autoPlay
                                        loop
                                        source={require('../../assets/loading.json')}
                                    />
                                </View>
                            </BlurView>
                        </MotiView>
                    )}
                </View>
            </MotiView>
        </View>
    )
}

export default connect(null, { showToast, updateCurrentUserInRedux, updateLadyInRedux })(LadySignup)