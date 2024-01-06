import React, { useState, useCallback, useRef, useMemo, memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Image } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { SPACING, FONTS, FONT_SIZES, COLORS, SUPPORTED_LANGUAGES } from '../../constants'
import { Button } from 'react-native-paper'
import { MaterialCommunityIcons, Ionicons, Octicons } from '@expo/vector-icons'
import { stripEmptyParams, getParam } from '../../utils'
import AddLady from '../../components/modal/account/AddLady'
import RenderAccountLady from '../../components/list/RenderAccountLady'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { MOCK_DATA } from '../../constants'

const Ladies = ({ route, setTabHeight, index }) => {
    const [searchParams] = useSearchParams()

    const params = useMemo(() => ({
        language: getParam(SUPPORTED_LANGUAGES, searchParams.get('language'), '')
    }), [searchParams])

    const [data, setData] = useState({
        active: [MOCK_DATA.slice(25)],
        inactive: [],
        pending: [null],
        rejected: []
    })
    const [addLadyModalVisible, setAddLadyModalVisible] = useState(false)
    const [sectionWidth, setSectionWidth] = useState(0)

    const navigate = useNavigate()

    const onAddNewLadyPress = () => {
        setAddLadyModalVisible(true)
    }

    const { width: windowWidth } = useWindowDimensions()

    const onLayout = (event) => {
        setTabHeight(event.nativeEvent.layout.height)
        setSectionWidth(event.nativeEvent.layout.width)
    }

    const cardWidth = useMemo(() => {
        const isXSmallScreen = sectionWidth < 300
        const isSmallScreen = sectionWidth >= 300 && sectionWidth < 550
        const isMediumScreen = sectionWidth >= 550 && sectionWidth < 750
        const isXMediumScreen = sectionWidth >= 750 && sectionWidth < 960
        const isLargeScreen = sectionWidth >= 960 && sectionWidth < 1300

        return isXSmallScreen ? ((sectionWidth - SPACING.small - SPACING.small)) 
            : isSmallScreen ? ((sectionWidth - SPACING.small - SPACING.small) / 2) - (SPACING.small) / 2
                : isMediumScreen ? ((sectionWidth - SPACING.small - SPACING.small) / 3) - (SPACING.small * 2) / 3
                    : isXMediumScreen ? ((sectionWidth - SPACING.small - SPACING.small) / 4) - (SPACING.small * 3) / 4
                        : isLargeScreen ? ((sectionWidth - SPACING.small - SPACING.small) / 5) - (SPACING.small * 4) / 5 : ((sectionWidth - SPACING.small - SPACING.small) / 6) - (SPACING.small * 5) / 6
    }, [sectionWidth])

    const onOpenProfilePress = (ladyId) => {
        navigate({
            pathname: '/profile/' + ladyId, 
            search: new URLSearchParams(stripEmptyParams(params)).toString()
        })
    }

    const onDeletePress = () => {

    }

    const onDeactivatePress = () => {

    }

    const onActivatePress = () => {

    }

    const onShowRejectedReasonPress = () => {

    }

    const onEditLadyPress = (ladyId) => {
        navigate({
            pathname: '/account/edit-lady/' + ladyId,
            search: new URLSearchParams(stripEmptyParams(params)).toString()
        })
    }

    const activeActions = useRef([
        {
            label: 'Edit',
            onPress: onEditLadyPress
        },
        {
            label: 'Deactivate',
            onPress: onDeactivatePress
        },
        {
            label: 'Show profile',
            onPress: onOpenProfilePress
        },
        {
            label: 'Delete',
            onPress: onDeletePress
        }
    ])

    const inactiveActions = useRef([
        {
            label: 'Edit',
            onPress: onEditLadyPress
        },
        {
            label: 'Activate',
            onPress: onActivatePress
        },
        {
            label: 'Delete',
            onPress: onDeletePress
        }
    ])

    const pendingActions = useRef([
        {
            label: 'Delete',
            onPress: onDeletePress
        }
    ])

    const rejectedActions = useRef([
        {
            label: 'Show rejection reason',
            onPress: onShowRejectedReasonPress
        },
        {
            label: 'Delete',
            onPress: onDeletePress
        }
    ])

    const renderActive = () => (
        <View style={styles.section}>
            <View style={[styles.sectionHeader, { justifyContent: 'space-between', marginBottom: SPACING.small, }]}>
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
                    onPress={onAddNewLadyPress}
                    rippleColor="rgba(220, 46, 46, .16)"
                >
                    Add lady
                </Button>
            </View>

            {
                data.active.length === 0 ? <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                    No active profiles
                </Text> : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: SPACING.small }}>
                        {MOCK_DATA.slice(25).map(lady => (
                            <View key={lady.id} style={{ width: cardWidth, marginBottom: SPACING.medium, }}>
                                <RenderAccountLady lady={lady} width={cardWidth} actions={activeActions.current} offsetX={windowWidth * index} />
                            </View>
                        ))}
                    </View>
                )
            }
        </View>
    )

    const renderInactive = () => (
        <View style={[styles.section, { marginBottom: SPACING.large }]}>
            <View style={[styles.sectionHeader, { alignItems: 'center', }]}>
                <Octicons name="dot-fill" size={20} color="grey" style={{ marginRight: SPACING.xx_small }} />
                <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                    Inactive
                </Text>
                <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                    • {data.inactive.length}
                </Text>
            </View>

            {
                data.inactive.length === 0 ? (
                    <Text style={{ fontFamily: FONTS.medium, fontSize: FONT_SIZES.medium, color: COLORS.greyText, textAlign: 'center', margin: SPACING.small }}>
                        No inactive profiles
                    </Text>
                ) : (
                    <View>

                    </View>
                )
            }
        </View>
    )

    const renderPending = () => (
        data.pending.length === 0 ? null :
            <View style={styles.section}>
                <View style={[styles.sectionHeader, { alignItems: 'center' }]}>
                    <Octicons name="dot-fill" size={20} color="yellow" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        Under review
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.pending.length}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: SPACING.small }}>
                    {MOCK_DATA.slice(25).map(lady => (
                        <View key={lady.id} style={{ width: cardWidth, marginRight: SPACING.small, marginBottom: SPACING.medium, }}>
                            <RenderAccountLady lady={lady} width={cardWidth} actions={pendingActions.current} offsetX={windowWidth * index} />
                        </View>
                    ))}
                </View>
            </View>
    )

    const renderRejected = () => (
        data.rejected.length === 0 ? null :
            <View style={styles.section}>
                <View style={[styles.sectionHeader, { alignItems: 'center' }]}>
                    <Octicons name="dot-fill" size={20} color="red" style={{ marginRight: SPACING.xx_small }} />
                    <Text numberOfLines={1} style={[styles.sectionHeaderText, { marginBottom: 0, marginRight: 5 }]}>
                        Under review
                    </Text>
                    <Text style={[styles.sectionHeaderText, { color: COLORS.greyText, fontFamily: FONTS.medium }]}>
                        • {data.rejected.length}
                    </Text>
                </View>


            </View>
    )

    return (
        <View onLayout={onLayout}>
            {renderActive()}
            {renderPending()}
            {renderInactive()}
            {renderRejected()}

            <AddLady visible={addLadyModalVisible} setVisible={setAddLadyModalVisible} />
        </View>
    )
}

export default memo(Ladies)

const styles = StyleSheet.create({
    section: {
        marginTop: SPACING.large,
        //padding: SPACING.small, 
        borderRadius: 20,
        backgroundColor: COLORS.grey,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,.08)',
    },
    sectionHeader: {
        flexDirection: 'row',
        margin: SPACING.small,
        //padding: SPACING.small
    },
    sectionHeaderText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZES.h3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.small,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGrey
    }
})