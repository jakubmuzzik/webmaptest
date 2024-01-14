import { useState, useEffect, useRef } from 'react'
import * as Font from 'expo-font'
import { StyleSheet, View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import initStore from './redux/store'
const store = initStore()

//import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { COLORS, FONTS, FONT_SIZES, SMALL_SCREEN_THRESHOLD, SPACING, toastConfig } from './constants'

import Toast from 'react-native-toast-message'

import Main from './navigations/Main'

//enableLegacyWebImplementation(true)

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
      <StatusBar
        animated={true}
        backgroundColor="#161616"
        barStyle='dark-content'
        translucent
      />
      <Provider store={store}>
        <SafeAreaProvider style={{ backgroundColor: COLORS.lightBlack,/* overscrollBehavior: 'none'*/ }}>
          <Main />
        </SafeAreaProvider>
      </Provider>

      <View style={{ flex: 1, position: 'fixed', top: 0, left: 0, right: 0 }}>
        <Toast config={toastConfig} />
      </View>
    </>
  )
}
