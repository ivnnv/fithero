/* @flow */

import * as React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useTheme } from 'react-native-paper';

import i18n from '../utils/i18n';
import SettingsScreen from './Settings';
import { getDefaultNavigationOptions } from '../utils/navigation';
import type { ThemeType } from '../utils/theme/withTheme';

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
  const theme: ThemeType = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getDefaultNavigationOptions(theme),
        headerHideShadow: true,
      }}
    >
      <Stack.Screen
        name="Settings"
        options={{ title: i18n.t('menu__settings') }}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
