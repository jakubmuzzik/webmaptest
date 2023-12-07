import { useState, useEffect, useRef } from 'react'
import * as Font from 'expo-font'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Provider } from 'react-redux'
import initStore from './redux/store'
const store = initStore()

import { SafeAreaProvider } from 'react-native-safe-area-context'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING } from './constants'

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

import Main from './components/navigation/Main'

//enableLegacyWebImplementation(true)

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'rgb(31,199,10)',/*width: 'fit-content', maxWidth: '80%'*/ }} // this width setup didn't work on mobile
      //contentContainerStyle={{ paddingVertical: 15 }}
      text1Style={{
        fontSize: FONT_SIZES.large,
        fontStyle: FONTS.bold,
      }}
      text2Style={{
        fontSize: FONT_SIZES.medium,
        fontStyle: FONTS.bold,
        color: '#000',
      }}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: COLORS.error }}
      text1Style={{
        fontSize: FONT_SIZES.medium,
        fontStyle: FONTS.bold
      }}
      text2Style={{
        fontSize: FONT_SIZES.small,
        fontStyle: FONTS.bold,
        color: '#000'
      }}
      text2NumberOfLines={2}
    />
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      await Promise.all([
        Font.loadAsync({
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf')
        })
      ])
    } catch (e) {
      // handle errors
      console.log('error during init', e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightBlack }}>

      </View>
    )
  }

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </Provider>

      <View style={{ flex: 1, position: 'fixed', top: 0, left: 0, right: 0 }}>
        <Toast config={toastConfig} />
      </View>
    </>
  )
}
