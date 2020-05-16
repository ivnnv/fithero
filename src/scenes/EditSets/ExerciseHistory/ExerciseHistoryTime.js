/* @flow */

import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

import type {
  ExerciseCategoryType,
  WorkoutSetSchemaType,
} from '../../../database/types';
import ExerciseHistoryItem from './ExerciseHistoryItem';
import { getMaxTimeByType } from '../../../database/services/WorkoutSetService';
import { dateToString, getToday } from '../../../utils/date';
import { deserializeWorkoutExercise } from '../../../database/utils';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import ExerciseHistoryList from './ExerciseHistoryList';
import WorkoutTimeSetItem from '../../../components/WorkoutTimeSetItem';

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

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
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

  return (
    // TODO implement ListHeaderComponent with PersonalRecords
    <ExerciseHistoryList renderItem={renderItem} ListHeaderComponent={null} />
  );
};

export default ExerciseHistoryTime;
