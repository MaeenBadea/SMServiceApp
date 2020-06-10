import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  ReactNative from 'react-native';
import { getStoredInfo} from './src/functions/Storage';
import {Provider} from 'react-redux'

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import Home from './src/screens/Home';
import Welcome from './src/screens/Welcome';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PasswordRecovery from './src/screens/PasswordRecovery';
import ChangePassword from './src/screens/ChangePassword';

import CouponScreen from './src/screens/CouponScreen';
import ServicesPage from './src/screens/ServicesPage'
import RentActivation from './src/components/RentActivation'
import store from './src/reducers/store';


const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [info, setInfo] = React.useState();
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        const info = await getStoredInfo();
        setInfo(info);
        ReactNative.I18nManager.forceRTL(true);
 
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <Provider store= {store}>
        <View style={styles.container}>
           {Platform.OS === 'ios'?
            <StatusBar barStyle="default" />:
            <MyStatusBar  barStyle="default" />
           }
            <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
              <Stack.Navigator screenOptions={{headerShown: false }}>

                <Stack.Screen name="Root" initialParams={info} component={Welcome} />
                <Stack.Screen name="Sign" component={Sign} />
                <Stack.Screen name="Main" component={BottomTabNavigator} />

              </Stack.Navigator>
            </NavigationContainer>
        </View>
      </Provider>
    );
  }
}

function Sign(){
  return (

  <Stack.Navigator screenOptions={{headerShown: false }}>
  
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} />


    </Stack.Navigator>
  );
}

function Main() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false }}>
              <Stack.Screen name="Home" component={Welcome} />
         


    </Stack.Navigator>
  );
}

const STATUSBAR_HEIGHT =  StatusBar.currentHeight;
const MyStatusBar = ({ ...props}) => (
  <View style={[styles.statusBar]}>
    <StatusBar translucent  {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
      height: STATUSBAR_HEIGHT,
    },
});
