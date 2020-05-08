/* @flow */

import { Keyboard } from 'react-native';

import {
  addSet,
  getLastSetByType,
  updateSet,
} from '../../database/services/WorkoutSetService';
import type {
  ExerciseCategoryType,
  WorkoutExerciseWeightRepsType,
  WorkoutSetWeightRepsType,
} from '../../database/types';
import { getWeight, toTwoDecimals } from '../../utils/metrics';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import {
  extractSetIndexFromDatabase,
  getExerciseSchemaId,
  getSetSchemaId,
} from '../../database/utils';
import { toDate } from '../../utils/date';
import { addExercise } from '../../database/services/WorkoutExerciseService';

export const getLastSet = (
  exercise: ?WorkoutExerciseWeightRepsType,
  exerciseKey: string
) => {
  if (exercise) {
    return exercise.sets[exercise.sets.length - 1];
  } else {
    const sets = getLastSetByType(exerciseKey || exercise?.type);
    if (sets.length > 0) {
      return sets[0];
    }

    return null;
  }
};

export const getLastWeight = (
  exercise: ?WorkoutExerciseWeightRepsType,
  lastSet: ?WorkoutSetWeightRepsType,
  unit: DefaultUnitSystemType
) => {
  const defaultWeight = unit === 'metric' ? 20 : 45;

  const lastWeight = lastSet
    ? toTwoDecimals(getWeight(lastSet.weight, exercise, unit))
    : defaultWeight;

  return lastWeight.toString();
};

type AddSetFromInputType = {
  day: string,
  exerciseKey: string,
  exercise: ?WorkoutExerciseWeightRepsType,
  category: ExerciseCategoryType,
  partialSet: {
    weight: number,
    reps: number,
  },
  weight_unit: ?DefaultUnitSystemType,
  updateId?: string,
};

export const addSetFromInput = ({
  day,
  exerciseKey,
  exercise,
  category,
  partialSet,
  weight_unit = null,
  updateId,
}: AddSetFromInputType) => {
  Keyboard.dismiss();

  const date = toDate(day);
  const newSet = {
    date,
    type: exerciseKey,
    category,
    ...partialSet,
  };

  if (!exercise) {
    const exerciseIdDb = getExerciseSchemaId(day, exerciseKey);
    const date = toDate(day);
    const newExercise = {
      id: exerciseIdDb,
      sets: [
        {
          ...newSet,
          id: getSetSchemaId(day, exerciseKey, 1),
        },
      ],
      date,
      type: exerciseKey,
      weight_unit,
      category,
    };

    addExercise(newExercise);
  } else if (!updateId) {
    const lastId = exercise.sets[exercise.sets.length - 1].id;
    const lastIndex = extractSetIndexFromDatabase(lastId);

    addSet({
      ...newSet,
      id: getSetSchemaId(day, exerciseKey, lastIndex + 1),
    });
  } else if (updateId) {
    updateSet({
      ...newSet,
      id: updateId,
    });
  }
};
