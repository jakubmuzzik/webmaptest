import React, { useEffect, useState } from 'react'
import { View, Modal, ScrollView, Text, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { connect } from 'react-redux'
import { updateScrollDisabled } from "../../../redux/actions"
import { normalize } from '../../../utils'
import { COLORS, SPACING, FONTS, FONT_SIZES } from '../../../constants'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import PhotosList from './PhotosList'
import { ActivityIndicator } from 'react-native-paper'
import AssetsGallery from './AssetsGallery'

const { width, height } = Dimensions.get('window')

const AssetsTabView = ({ photos = [], videos = [], visible, updateScrollDisabled, closeModal }) => {
    const [pagesIndex, setPagesIndex] = useState(0)
    const [assetsIndex, setAssetsIndex] = useState(0)
    const [pressedAssetIndex, setPressedAssetIndex] = useState()
    const [pagesRoutes] = useState([
        { key: 'Assets', title: 'Assets' },
        { key: 'Gallery', title: 'Gallery' },
    ])
    const [assetRoutes] = useState([
        { key: 'Photos', title: 'Photos', length: photos.length },
        { key: 'Videos', title: 'Videos', length: videos.length },
    ].filter(r => r.length))

    useEffect(() => {
        if (isNaN(pressedAssetIndex)) {
            setPagesIndex(0)
        } else {
            setPagesIndex(1)
        }
    }, [pressedAssetIndex])

    const onClosePress = () => {
        updateScrollDisabled()
        closeModal()
        setPagesIndex(0)
        setAssetsIndex(0)
        setPressedAssetIndex(undefined)
    }

    const renderLazyPlaceholder = () => (
        <View style={{ width, justifyContent: 'center', alignItems: 'center', marginTop: height / 4 }}>
            <ActivityIndicator animating color={COLORS.red} />
        </View>
    )

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'red' }}
            style={{ backgroundColor: 'transparent', maxWidth: '100%', alignSelf: 'center', alignItems: 'center', width: 'auto' }}
            tabStyle={{ width: 'auto' }}
            scrollEnabled={true}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.large, color: focused ? '#FFF' : 'rgba(255,255,255,0.7)' }}>
                    {route.title} <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: focused ? '#FFF' : 'rgba(255,255,255,0.7)' }}>({route.length})</Text>
                </Text>
            )}
            gap={SPACING.medium}
        />
    )

    const renderAssetsPage = () => (
        <>
            <View style={{ height: 60, backgroundColor: COLORS.grey, justifyContent: 'center' }}>
                <Ionicons onPress={onClosePress} name="close" size={25} color="white" style={{ marginRight: SPACING.medium, alignSelf: 'flex-end' }} />
            </View>

            <TabView
                renderTabBar={renderTabBar}
                swipeEnabled={false}
                navigationState={{ index: assetsIndex, routes: assetRoutes }}
                renderScene={renderAssetsScene}
                onIndexChange={setAssetsIndex}
                lazy
                renderLazyPlaceholder={renderLazyPlaceholder}
            />
        </>
    )

    const renderPagesScene = ({ route }) => {
        switch (route.key) {
            case 'Assets':
                return renderAssetsPage()
            case 'Gallery':
                return <AssetsGallery pressedAssetIndex={pressedAssetIndex} setPressedAssetIndex={setPressedAssetIndex} onClosePress={onClosePress} assets={[]} />
            default:
                return null
        }
    }

    const renderAssetsScene = ({ route }) => {
        switch (route.key) {
            case 'Photos':
                return <PhotosList onAssetPress={setPressedAssetIndex} />
            case 'Videos':
                return null
            default:
                return null
        }
    }

    return (
        <Modal visible={visible} animationType="slide" onShow={() => updateScrollDisabled(true)}>
            <View style={{ flex: 1, backgroundColor: COLORS.lightBlack }}>
                <TabView
                    renderTabBar={props => null}
                    swipeEnabled={false}
                    navigationState={{ index: pagesIndex, routes: pagesRoutes }}
                    renderScene={renderPagesScene}
                    onIndexChange={setPagesIndex}
                    lazy
                    renderLazyPlaceholder={renderLazyPlaceholder}
                />
            </View>
        </Modal>
    )
}

export default connect(null, { updateScrollDisabled })(AssetsTabView)