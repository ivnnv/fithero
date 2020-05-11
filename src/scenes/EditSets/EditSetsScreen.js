/* @flow */

import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

import Screen from '../../components/Screen';
import {
  deserializeWorkoutExercise,
  getExerciseSchemaId,
} from '../../database/utils';
import EditSetsWeightReps from './EditSetsWeightReps';
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type {
  ExerciseCategoryType,
  WorkoutExerciseSchemaType,
} from '../../database/types';
import { getExerciseName } from '../../utils/exercises';
import EditSetsTime from './EditSetsTime';

export type EditSetsScreenRouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    exerciseCategory: ExerciseCategoryType,
    isModal?: boolean,
  },
};

type Props = {
  selectedPage?: number,
};

const EditSetsScreen = (props: Props) => {
  const route: EditSetsScreenRouteType = useRoute();
  const {
    day,
    exerciseKey,
    exerciseName,
    exerciseCategory,
    isModal,
  } = route.params;
  const { selectedPage } = props;

  const id = getExerciseSchemaId(day, exerciseKey);
  const { data, timestamp } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getWorkoutExerciseById(id), [id]),
  });
  const realmExercise = data.length > 0 ? data[0] : null;
  // It's possible that we delete the whole exercise so this access to .sets would be invalid
  const exercise = useMemo(
    () =>
      realmExercise && realmExercise.isValid()
        ? deserializeWorkoutExercise(realmExercise)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timestamp]
  );
  const renderControls = useCallback(() => {
    if (exerciseCategory === 'time') {
      return <EditSetsTime exercise={exercise} selectedPage={selectedPage} />;
    }
    return (
      <EditSetsWeightReps
        testID="edit-sets-with-controls"
        exercise={exercise}
        selectedPage={selectedPage}
      />
    );
  }, [exercise, exerciseCategory, selectedPage]);

  return (
    <Screen style={styles.container}>
      {isModal && (
        <Text style={styles.title}>
          {getExerciseName(exerciseKey, exerciseName)}
        </Text>
      )}
      {renderControls()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default EditSetsScreen;
