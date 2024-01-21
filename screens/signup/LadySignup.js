import React, { useState, createRef } from 'react'
import { View, Text } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../constants'
import { normalize } from '../../utils'
import { ProgressBar, Button } from 'react-native-paper'

import LoginInformation from './steps/LoginInformation'
import PersonalDetails from './steps/PersonalDetails'
import ServicesAndPricing from './steps/ServicesAndPricing'
import LocationAndAvailability from './steps/LocationAndAvailability'
import UploadPhotos from './steps/UploadPhotos'
import LadyRegistrationCompleted from './steps/LadyRegistrationCompleted'

import { TabView } from 'react-native-tab-view'
import { MotiView } from 'moti'

import { connect } from 'react-redux'
import { showToast } from '../../redux/actions'
import { IN_REVIEW } from '../../labels'

import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, setDoc, doc, db } from '../../firebase/config'

const LadySignup = ({ independent, showHeaderText = true, offsetX = 0, showToast }) => {
    const [nextButtonIsLoading, setNextButtonIsLoading] = useState(false)
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
                //setNextButtonIsLoading(false)
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
        }
    }

    const uploadUser = async () => {
        let data = {}
        routes.slice(0, routes.length - 1).forEach(route => data = { ...data, ...route.ref.current.data })
        data.status = IN_REVIEW

        const response = await createUserWithEmailAndPassword(getAuth(), data.email, data.password)

        delete data.password

        await setDoc(doc(db, 'ladies', response.user.uid), {
            id: response.user.uid,
            ...data,
            nameLowerCase: data.name.toLowerCase(),
            createdDate: new Date()
        })

        await sendEmailVerification(response.user)
        

        //create auth user
        //upload data
        //upload photos
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
                return <UploadPhotos ref={route.ref} i={route.index} showToast={showToast} contentWidth={contentWidth}/>
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
                </View>
            </MotiView>
        </View>
    )
}

export default connect(null, { showToast })(LadySignup)