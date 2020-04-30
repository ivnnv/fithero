/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'react-native-paper';

import tabBarIcon from './components/tabBarIcon';
import i18n from './utils/i18n';
import HomeNavigator from './scenes/HomeNavigator';
import SettingsNavigator from './scenes/SettingsNavigator';
import StatisticsNavigator from './scenes/StatisticsNavigator';
import EditExerciseScreen from './scenes/EditExercise/EditExerciseScreen';
import HeaderButton from './components/Header/HeaderButton';
import HeaderIconButton from './components/Header/HeaderIconButton';
import { getDefaultNavigationOptions } from './utils/navigation';
import CopyWorkoutScreen from './scenes/CopyWorkout';
import CopyWorkoutButton from './scenes/CopyWorkout/CopyWorkoutButton';
import EditSetsScreen from './scenes/EditSets/EditSetsScreen';
import { dateToString, getDatePrettyFormat, getToday } from './utils/date';
import type { ThemeType } from './utils/theme/withTheme';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainNavigator = () => {
  const theme: ThemeType = useTheme();

  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.background,
          border: theme.colors.toolbar,
          text: theme.colors.text,
        },
      }}
    >
      <Stack.Navigator
        mode="modal"
        screenOptions={{ gestureEnabled: false, headerShown: false }}
      >
        <Stack.Screen name="Main" options={{ header: () => null }}>
          {() => (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="FitHero" options={{ header: () => null }}>
                {() => (
                  <Tab.Navigator
                    initialRouteName="Home"
                    backBehavior="initialRoute"
                    shifting={false}
                    keyboardHidesNavigationBar={false}
                    barStyle={{
                      borderColor: theme.colors.borderColor,
                      borderTopWidth: StyleSheet.hairlineWidth,
                    }}
                  >
                    <Tab.Screen
                      name="Home"
                      options={{
                        tabBarIcon: tabBarIcon('home'),
                        title: i18n.t('menu__home'),
                      }}
                      component={HomeNavigator}
                    />
                    <Tab.Screen
                      name="Statistics"
                      options={{
                        tabBarIcon: tabBarIcon('show-chart'),
                        title: i18n.t('menu__statistics'),
                      }}
                      component={StatisticsNavigator}
                    />
                    <Tab.Screen
                      name="Settings"
                      options={{
                        tabBarIcon: tabBarIcon('settings'),
                        title: i18n.t('menu__settings'),
                      }}
                      component={SettingsNavigator}
                    />
                  </Tab.Navigator>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="CopyWorkout"
                component={CopyWorkoutScreen}
                options={() => {
                  return {
                    ...getDefaultNavigationOptions(theme),
                    title: '',
                    headerRight: () => <CopyWorkoutButton />,
                  };
                }}
              />
            </Stack.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="EditExercise"
          component={EditExerciseScreen}
          options={({ route, navigation }) => {
            const { params = {} } = route;
            return {
              ...getDefaultNavigationOptions(theme),
              title: params.id
                ? i18n.t('edit_exercise')
                : i18n.t('new_exercise'),
              headerLeft: () => (
                <HeaderIconButton
                  icon="close"
                  onPress={() => navigation.goBack(null)}
                />
              ),
              headerRight: () => (
                // TODO remove from here after using useLayoutEffect in EditExerciseScreen
                <HeaderButton onPress={() => {}}>{i18n.t('save')}</HeaderButton>
              ),
            };
          }}
        />
        <Stack.Screen
          name="EditSetsModal"
          component={EditSetsScreen}
          options={({ navigation, route }) => {
            const { params = {} } = route;
            return {
              ...getDefaultNavigationOptions(theme),
              headerLeft: () => (
                <HeaderIconButton icon="close" onPress={navigation.goBack} />
              ),
              headerTitle: getDatePrettyFormat(
                params.day,
                dateToString(getToday())
              ),
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
