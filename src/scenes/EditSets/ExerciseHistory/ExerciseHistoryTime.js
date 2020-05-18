/* @flow */

import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

import type {
  ExerciseCategoryType,
  WorkoutSetTimeType,
} from '../../../database/types';
import ExerciseHistoryItem from './ExerciseHistoryItem';
import { getMaxTimeByType } from '../../../database/services/WorkoutSetService';
import { dateToString, getToday } from '../../../utils/date';
import { deserializeWorkoutExercise } from '../../../database/utils';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import ExerciseHistoryList from './ExerciseHistoryList';
import WorkoutTimeSetItem from '../../../components/WorkoutTimeSetItem';
import PersonalRecords from './PersonalRecords';
import PersonalRecordItem from './PersonalRecordItem';
import type { ThemeType } from '../../../utils/theme/withTheme';
import { useTheme } from 'react-native-paper';
import SetTimeFormat from '../../../components/SetTimeFormat';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    exerciseCategory: ExerciseCategoryType,
  },
};

// On Android as the tab is always rendered, we gotta do some more optimizations
const debounceTime =
  Platform.OS === 'android' ? REALM_DEFAULT_DEBOUNCE_VALUE : 0;

const ExerciseHistoryTime = () => {
  const route: RouteType = useRoute();
  const type = route.params.exerciseKey;
  const { colors }: ThemeType = useTheme();

  // $FlowFixMe type it better
  const maxSet: ?WorkoutSetTimeType = useMaxSetHook(
    type,
    getMaxTimeByType,
    debounceTime
  );

  const todayString = dateToString(getToday());
  // $FlowFixMe type it better
  const maxSetId = maxSet && maxSet.isValid() ? maxSet.id : null;

  const renderItem = useCallback(
    item => {
      // Deserialize so memo works
      const exercise = deserializeWorkoutExercise(item);
      return (
        <ExerciseHistoryItem
          exercise={exercise}
          todayString={todayString}
          renderSets={() =>
            exercise.sets.map((set, index) => (
              // $FlowFixMe
              <WorkoutTimeSetItem
                key={set.id}
                set={set}
                index={index}
                maxSetId={maxSetId}
              />
            ))
          }
        />
      );
    },
    [maxSetId, todayString]
  );

  const renderHeader = useCallback(() => {
    // $FlowFixMe type it better
    if (maxSet && maxSet.isValid()) {
      return (
        <PersonalRecords>
          <PersonalRecordItem date={maxSet.date} trophyColor={colors.trophy}>
            <SetTimeFormat
              time={maxSet.time}
              color={colors.text}
              textAlign="left"
            />
          </PersonalRecordItem>
        </PersonalRecords>
      );
    }

    return null;
  }, [colors.text, colors.trophy, maxSet]);

  return (
    // TODO implement ListHeaderComponent with PersonalRecords
    <ExerciseHistoryList
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
    />
  );
};

export default ExerciseHistoryTime;
