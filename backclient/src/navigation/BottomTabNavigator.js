import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';


import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/Home';
import Profile from '../screens/Profile';
import CouponScreen from '../screens/CouponScreen';
import ServicesPage from '../screens/ServicesPage';
import ChangePassword from '../screens/ChangePassword';

import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'HomeStack';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerShown: false });

  return (
      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <BottomTab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            title: 'الرئيسية',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
          }}
        />
        <BottomTab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            title: 'الصفحه الشخصية',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
          }}
        />
      </BottomTab.Navigator>
  );
}

function HomeStack(){
  return (
  <Stack.Navigator screenOptions={{headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ServicesPage" component={ServicesPage} />
    </Stack.Navigator>
  );
}
function ProfileStack(){
  return (
  <Stack.Navigator screenOptions={{headerShown: false }}>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Coupon" component={CouponScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />

    </Stack.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Links to learn more';
  }
}
