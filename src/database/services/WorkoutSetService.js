/* @flow */

import type {
  ExerciseCategoryType,
  WorkoutSetSchemaType,
  WorkoutSetWeightRepsType,
} from '../types';
import realm from '../index';
import { getExerciseSchemaIdFromSet } from '../utils';
import { deleteWorkoutExercise } from './WorkoutExerciseService';
import { getFirstAndLastWeekday, getToday } from '../../utils/date';
import { WORKOUT_SET_SCHEMA_NAME } from '../schemas/WorkoutSetSchema';
import { WORKOUT_EXERCISE_SCHEMA_NAME } from '../schemas/WorkoutExerciseSchema';

export const getMaxWeightByType = (type: string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['weight', true], ['reps', true], 'date', 'id']);

export const getMaxRepByType = (type: string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['reps', true], ['weight', true], 'date', 'id']);

export const getMaxTimeByType = (type: string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['time', true], 'date', 'id']);

export const addSet = (set: WorkoutSetSchemaType) => {
  realm.write(() => {
    const exerciseId = getExerciseSchemaIdFromSet(set.id);
    const exercise = realm.objectForPrimaryKey(
      WORKOUT_EXERCISE_SCHEMA_NAME,
      exerciseId
    );
    exercise.sets.push(set);
  });
};

export const updateSet = (updatedSet: WorkoutSetWeightRepsType) => {
  realm.write(() => {
    const { id, ...restUpdateSet } = updatedSet;
    const set = realm.objectForPrimaryKey(WORKOUT_SET_SCHEMA_NAME, id);
    Object.keys(restUpdateSet).forEach(k => {
      set[k] = restUpdateSet[k];
    });
  });
};

export const deleteSet = (setId: string) => {
  // Database, if last set, delete exercise, if last exercise, delete workout
  realm.write(() => {
    const setToDelete = realm.objectForPrimaryKey(
      WORKOUT_SET_SCHEMA_NAME,
      setId
    );
    realm.delete(setToDelete);
    // After deleting set, check if we need to delete the whole exercise
    const exerciseId = getExerciseSchemaIdFromSet(setId);
    const exercise = realm.objectForPrimaryKey(
      WORKOUT_EXERCISE_SCHEMA_NAME,
      exerciseId
    );
    if (exercise.sets.length === 0) {
      deleteWorkoutExercise(exercise);
    }
  });
};

export const getLastSetByType = (type: ?string) =>
  realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered('type = $0', type)
    .sorted([['date', true], ['id', true]]);

export const getSetsThisWeek = (category: ExerciseCategoryType) => {
  const [start, end] = getFirstAndLastWeekday(getToday());
  return realm
    .objects(WORKOUT_SET_SCHEMA_NAME)
    .filtered(
      `category = $0 AND date >= $1 AND date <= $2`,
      category,
      start,
      end
    );
};
