import React, { useState, useRef } from "react"
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { COLORS, FONTS, FONT_SIZES, SPACING } from "../constants"
import Gallery from 'react-native-awesome-gallery'
import { Image } from 'expo-image'

const images = [require('../assets/dummy_photo.png'), require('../assets/dummy_photo.png'), require('../assets/dummy_photo.png')]

const renderItem = ({
    item,
    setImageDimensions,
  }) => {
    return (
      <Image
        source={item}
        style={StyleSheet.absoluteFillObject}
        contentFit="contain"
        onLoad={(e) => {
          const { width, height } = e.source;
          setImageDimensions({ width, height });
        }}
      />
    );
  };

const Profile = ({ route, client }) => {
    const [isOpen, setIsOpen] = useState(false);
    const openGallery = () => setIsOpen(true);
    const closeGallery = () => setIsOpen(false);

    const gallery = useRef()

    const [infoVisible, setInfoVisible] = useState(true);
    const [index, setIndex] = useState(0);

    const onTap = () => {
        setInfoVisible(!infoVisible);
      };

    return (
        <View style={styles.container}>
            {infoVisible && (
                <View
                    style={[
                        styles.toolbar,
                        {
                            height: 60,
                            //paddingTop: top,
                        },
                    ]}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.headerText}>
                            {index + 1} of {images.length}
                        </Text>
                    </View>
                </View>
            )}
            <Gallery
                ref={gallery}
                data={images}
                //keyExtractor={(item) => item.uri}
                renderItem={renderItem}
                initialIndex={0}
                numToRender={3}
                doubleTapInterval={150}
                onIndexChange={(index) => setIndex(index)}
                //onSwipeToClose={goBack}
                onTap={onTap}
                loop
                onScaleEnd={(scale) => {
                    if (scale < 0.8) {
                        //goBack();
                    }
                }}
            />
            {infoVisible && (
                <View
                    style={[
                        styles.toolbar,
                        styles.bottomToolBar,
                        {
                            height: 100,
                            //paddingBottom: bottom,
                        },
                    ]}
                >
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.textContainer}
                            onPress={() =>
                                gallery.current?.setIndex(
                                    index === 0
                                        ? images.length - 1
                                        : index - 1
                                )
                            }
                        >
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.textContainer}
                            onPress={() =>
                                gallery.current?.setIndex(
                                    index === images.length - 1
                                        ? 0
                                        : index + 1,
                                    true
                                )
                            }
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )

    return (
        <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightBlack }}>
            <TouchableOpacity onPress={openGallery}><Text style={{ color: '#FFF' }}>Open</Text></TouchableOpacity>
            <Gallery
                data={images}
                onIndexChange={(newIndex) => {
                    console.log(newIndex);
                }}
            />
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
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