import React, { useCallback, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import MapView from '../components/MapView'
//import { ClusterProps, MarkerClusterer } from '@teovilla/react-native-web-maps';

const MapScreen = () => {

    const [region, setRegion] = useState(null)

  const mapRef = useRef(null);

  const loadingFallback = useMemo(() => {
    return (
      <View style={{...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading</Text>
      </View>
    );
  }, []);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider="google"
                style={{ flex: 1 }}
                onRegionChange={setRegion}
                loadingFallback={loadingFallback}
                //googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
            >
                
            </MapView>
        </View>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cluster: {
        backgroundColor: 'salmon',
        width: 20,
        height: 20,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clusterText: {
        fontWeight: '700',
    },
});