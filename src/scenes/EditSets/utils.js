/* @flow */

import { getLastSetByType } from '../../database/services/WorkoutSetService';
import type {
  WorkoutExerciseWeightRepsType,
  WorkoutSetWeightRepsType,
} from '../../database/types';
import { getWeight, toTwoDecimals } from '../../utils/metrics';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

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
