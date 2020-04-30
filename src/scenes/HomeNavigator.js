/* @flow */

import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useTheme } from 'react-native-paper';

import i18n from '../utils/i18n';
import HomeScreen from './Home';
import CalendarScreen from './Calendar';
import ExercisesScreen from './Exercises';
import EditSetsScreen from './EditSets';
import WorkoutDayScreen from './Workouts';
import ExerciseDetailsScreen from './ExerciseDetails';
import CommentsScreen from './Comments';
import { getDefaultNavigationOptions } from '../utils/navigation';
import { getDatePrettyFormat, getToday } from '../utils/date';
import HeaderIconButton from '../components/Header/HeaderIconButton';
import HeaderButton from '../components/Header/HeaderButton';
import { getExerciseName } from '../utils/exercises';
import HomeOverflowButton from './Home/HomeOverflowButton';
import WorkoutDayOverflowButton from './Workouts/WorkoutDayOverflowButton';
import type { ThemeType } from '../utils/theme/withTheme';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  const theme: ThemeType = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getDefaultNavigationOptions(theme),
        headerHideShadow: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => {
          const navigateToCalendar = () => {
            navigation.navigate('Calendar', {
              today: getToday().format('YYYY-MM-DD'),
            });
          };
          return {
            headerRight: () => (
              <View style={styles.header}>
                <HeaderIconButton
                  icon={Platform.OS === 'ios' ? 'date-range' : 'calendar-range'}
                  onPress={navigateToCalendar}
                />
                <HomeOverflowButton
                  actions={[
                    i18n.t('comment_workout'),
                    i18n.t('share_workout'),
                    i18n.t('copy_workout'),
                  ]}
                  last
                />
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={() => {
          return {
            title: i18n.t('calendar'),
            // TODO remove from here after using useLayoutEffect in CalendarScreen
            headerRight: () => (
              <HeaderIconButton
                onPress={() => {}}
                icon={Platform.OS === 'ios' ? 'today' : 'calendar-today'}
                last
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={({ navigation }) => {
          return {
            ...Platform.select({
              android: { header: () => null },
            }),
            title: i18n.t('exercises'),
            headerRight: () => (
              <HeaderIconButton
                onPress={() => navigation.navigate('EditExercise')}
                icon="add"
                last
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={() => {
          return {
            title: '',
          };
        }}
      />
      <Stack.Screen
        name="EditSets"
        component={EditSetsScreen}
        options={({ route }) => {
          const { params = {} } = route;
          return {
            headerTitle: Platform.select({
              android: getExerciseName(params.exerciseKey, params.exerciseName),
              ios: '',
            }),
          };
        }}
      />
      <Stack.Screen
        name="Workouts"
        component={WorkoutDayScreen}
        options={({ route }) => {
          const { params = {} } = route;
          return {
            title: getDatePrettyFormat(params.day, getToday(), true),
            headerRight: () => (
              <WorkoutDayOverflowButton
                actions={[
                  i18n.t('comment_workout'),
                  i18n.t('share_workout'),
                  i18n.t('copy_workout'),
                ]}
                last
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={() => ({
          title: '',
          // TODO remove from here after using useLayoutEffect in CommentsScreen
          headerRight: () => (
            <HeaderButton onPress={() => {}}>{i18n.t('save')}</HeaderButton>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
});

export default HomeNavigator;
