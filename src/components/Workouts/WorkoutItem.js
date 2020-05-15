/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { getExerciseName } from '../../utils/exercises';
import type {
  ExerciseCategoryType,
  ExerciseSchemaType,
  WorkoutExerciseSchemaType,
} from '../../database/types';
import { extractExerciseKeyFromDatabase } from '../../database/utils';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import {
  getExerciseById,
  isCustomExercise,
} from '../../database/services/ExerciseService';
import { useCallback } from 'react';
import Card from '../Card';
import WorkoutItemWeightReps from './WorkoutItemWeightReps';
import WorkoutItemTime from './WorkoutItemTime';

type Props = {|
  exercise: WorkoutExerciseSchemaType,
  onPressItem: (
    exerciseKey: string,
    customExerciseName: ?string,
    exerciseCategory: ExerciseCategoryType
  ) => void,
|};

const WorkoutItem = (props: Props) => {
  const { exercise, onPressItem } = props;

  const { data: customExercises } = useRealmResultsHook<ExerciseSchemaType>({
    query: useCallback(() => {
      if (isCustomExercise(exercise.id)) {
        return getExerciseById(extractExerciseKeyFromDatabase(exercise.id));
      }
    }, [exercise.id]),
  });

  const customExerciseName =
    customExercises.length > 0 ? customExercises[0].name : '';

  const onPress = useCallback(() => {
    onPressItem(
      extractExerciseKeyFromDatabase(exercise.id),
      customExerciseName,
      exercise.category
    );
  }, [customExerciseName, exercise.category, exercise.id, onPressItem]);

  const renderItem = useCallback(() => {
    if (exercise.category === 'time') {
      return <WorkoutItemTime exercise={exercise} />;
    }
    return <WorkoutItemWeightReps exercise={exercise} />;
  }, [exercise]);

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
          <View style={styles.setsContainer}>{renderItem()}</View>
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
