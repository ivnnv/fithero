/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getExerciseName } from '../../utils/exercises';
import type {
  ExerciseCategoryType,
  ExerciseSchemaType,
  WorkoutExerciseWeightRepsType,
  WorkoutSetSchemaType,
} from '../../database/types';
import { extractExerciseKeyFromDatabase } from '../../database/utils';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import SetItem from '../WorkoutWeightRepsSetItem';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import {
  getExerciseById,
  isCustomExercise,
} from '../../database/services/ExerciseService';
import { useCallback } from 'react';
import useMaxSetHook from '../../hooks/useMaxSetHook';
import {
  getMaxRepByType,
  getMaxWeightByType,
} from '../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../database/constants';
import Card from '../Card';

type Props = {|
  exercise: WorkoutExerciseWeightRepsType,
  onPressItem: (
    exerciseKey: string,
    customExerciseName: ?string,
    exerciseCategory: ExerciseCategoryType
  ) => void,
|};

const WorkoutItem = (props: Props) => {
  const { exercise, onPressItem } = props;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    exercise.type,
    getMaxWeightByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxRep: ?WorkoutSetSchemaType = useMaxSetHook(
    exercise.type,
    getMaxRepByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;
  const maxRepId = maxRep ? maxRep.id : null;

  const { data: customExercises } = useRealmResultsHook<ExerciseSchemaType>({
    query: useCallback(() => {
      if (isCustomExercise(exercise.id)) {
        return getExerciseById(extractExerciseKeyFromDatabase(exercise.id));
      }
    }, [exercise.id]),
  });

  const customExerciseName =
    customExercises.length > 0 ? customExercises[0].name : '';

  const _renderSet = useCallback(
    (set: WorkoutSetSchemaType, index: number) => {
      return (
        <SetItem
          key={set.id}
          set={set}
          maxSetId={maxSetId}
          maxRepId={maxRepId}
          index={index}
          unit={exercise.weight_unit || defaultUnitSystem}
        />
      );
    },
    [defaultUnitSystem, exercise.weight_unit, maxRepId, maxSetId]
  );

  const onPress = useCallback(() => {
    onPressItem(
      extractExerciseKeyFromDatabase(exercise.id),
      customExerciseName,
      exercise.category
    );
  }, [customExerciseName, exercise.category, exercise.id, onPressItem]);

  return (
    <Card style={styles.card} onPress={onPress}>
      <View>
        <Text>
          {getExerciseName(
            extractExerciseKeyFromDatabase(exercise.id),
            customExerciseName
          )}
        </Text>
        {exercise.sets.length > 0 && (
          <View style={styles.setsContainer}>
            {exercise.sets.map((set, index) => _renderSet(set, index))}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  setsContainer: {
    paddingTop: 12,
  },
});

export default React.memo<Props>(WorkoutItem, (prevProps, nextProps) => {
  if (prevProps.onPressItem !== nextProps.onPressItem) {
    return false;
  }

  return (
    // Doing it like this because of Realm
    JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
  );
});
