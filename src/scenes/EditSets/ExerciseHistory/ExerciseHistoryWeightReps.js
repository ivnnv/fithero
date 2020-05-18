/* @flow */

import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

import { getWorkoutExerciseById } from '../../../database/services/WorkoutExerciseService';
import type {
  ExerciseCategoryType,
  WorkoutSetWeightRepsType,
} from '../../../database/types';
import ExerciseHistoryItem from './ExerciseHistoryItem';
import {
  getMaxRepByType,
  getMaxWeightByType,
} from '../../../database/services/WorkoutSetService';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import { dateToString, getToday } from '../../../utils/date';
import PersonalRecords from './PersonalRecords';
import {
  deserializeWorkoutExercise,
  getExerciseSchemaIdFromSet,
} from '../../../database/utils';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import ExerciseHistoryList from './ExerciseHistoryList';
import WorkoutWeightRepsSetItem from '../../../components/WorkoutWeightRepsSetItem';
import PersonalRecordItem from './PersonalRecordItem';
import type { ThemeType } from '../../../utils/theme/withTheme';
import { useTheme } from 'react-native-paper';
import PersonalRecordWeightRepsItem from './PersonalRecordWeightRepsItem';

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

const ExerciseHistoryWeightReps = () => {
  const route: RouteType = useRoute();
  const type = route.params.exerciseKey;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );
  const { colors }: ThemeType = useTheme();

  const [maxSetUnit, setMaxSetUnit] = useState(defaultUnitSystem);
  const [maxRepUnit, setMaxRepUnit] = useState(defaultUnitSystem);

  // $FlowFixMe type it better
  const maxSet: ?WorkoutSetWeightRepsType = useMaxSetHook(
    type,
    getMaxWeightByType,
    debounceTime
  );
  // $FlowFixMe type it better
  const maxRep: ?WorkoutSetWeightRepsType = useMaxSetHook(
    type,
    getMaxRepByType,
    debounceTime
  );

  const todayString = dateToString(getToday());
  // $FlowFixMe type it better
  const maxSetId = maxSet && maxSet.isValid() ? maxSet.id : null;
  // $FlowFixMe type it better
  const maxRepId = maxRep && maxRep.isValid() ? maxRep.id : null;

  const updateWeightUnit = useCallback((setId, setWeightUnit) => {
    if (!setId) {
      return;
    }
    const data = getWorkoutExerciseById(getExerciseSchemaIdFromSet(setId));
    if (data.length > 0) {
      setWeightUnit(data[0].weight_unit);
    }
  }, []);

  // TODO This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    updateWeightUnit(maxSetId, setMaxSetUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxSetId, defaultUnitSystem]);

  // TODO This might not be necessary in the future if we add weight_unit to each Set
  useEffect(() => {
    updateWeightUnit(maxRepId, setMaxRepUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxRepId, defaultUnitSystem]);

  const renderItem = useCallback(
    item => {
      // Deserialize so memo works
      const exercise = deserializeWorkoutExercise(item);

      return (
        <ExerciseHistoryItem
          todayString={todayString}
          exercise={exercise}
          renderSets={() =>
            exercise.sets.map((set, index) => (
              <WorkoutWeightRepsSetItem
                key={set.id}
                set={set}
                index={index}
                unit={exercise.weight_unit}
                maxSetId={maxSetId}
                maxRepId={maxRepId}
              />
            ))
          }
        />
      );
    },
    [maxRepId, maxSetId, todayString]
  );

  const renderHeader = useCallback(() => {
    // $FlowFixMe type it better
    if (maxSet && maxSet.isValid() && maxRep && maxRep.isValid()) {
      return (
        <PersonalRecords>
          <PersonalRecordItem date={maxSet.date} trophyColor={colors.trophy}>
            <PersonalRecordWeightRepsItem set={maxSet} unit={maxSetUnit} />
          </PersonalRecordItem>
          <PersonalRecordItem
            date={maxRep.date}
            trophyColor={colors.trophyReps}
            last
          >
            <PersonalRecordWeightRepsItem set={maxRep} unit={maxRepUnit} />
          </PersonalRecordItem>
        </PersonalRecords>
      );
    }

    return null;
  }, [colors, maxRep, maxRepUnit, maxSet, maxSetUnit]);

  return (
    <ExerciseHistoryList
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
    />
  );
};

export default ExerciseHistoryWeightReps;
