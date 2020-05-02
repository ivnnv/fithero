/* @flow */

import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

import Screen from '../../components/Screen';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWeightReps from './EditSetsWeightReps';
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import { getExerciseName } from '../../utils/exercises';
import useBackButton from '../../hooks/useBackButton';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    isModal?: boolean,
  },
};

type Props = {
  selectedPage?: number,
};

const EditSetsScreen = (props: Props) => {
  const route: RouteType = useRoute();
  const { day, exerciseKey, exerciseName, isModal } = route.params;
  const { selectedPage } = props;
  const [selectedId, setSelectedId] = useState('');

  const id = getExerciseSchemaId(day, exerciseKey);
  const { data } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getWorkoutExerciseById(id), [id]),
  });
  const exercise = data.length > 0 ? data[0] : null;

  const onBackButton = useCallback(() => {
    setSelectedId('');
  }, []);
  const shouldTriggerBackButton = !!(selectedId && selectedPage === 0);
  useBackButton(shouldTriggerBackButton, onBackButton);

  return (
    <Screen style={styles.container}>
      {isModal && (
        <Text style={styles.title}>
          {getExerciseName(exerciseKey, exerciseName)}
        </Text>
      )}
      <EditSetsWeightReps
        testID="edit-sets-with-controls"
        day={day}
        exerciseKey={exerciseKey}
        exercise={exercise}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
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
