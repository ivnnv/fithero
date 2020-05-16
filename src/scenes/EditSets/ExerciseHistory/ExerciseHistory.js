/* @flow */

import React from 'react';

import ExerciseHistoryWeightReps from './ExerciseHistoryWeightReps';
import { useRoute } from '@react-navigation/native';
import type { ExerciseCategoryType } from '../../../database/types';
import ExerciseHistoryTime from './ExerciseHistoryTime';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    exerciseCategory: ExerciseCategoryType,
  },
};

const ExerciseHistory = () => {
  const route: RouteType = useRoute();
  const { exerciseCategory } = route.params;
  if (exerciseCategory === 'time') {
    return <ExerciseHistoryTime />;
  }
  return <ExerciseHistoryWeightReps />;
};

export default ExerciseHistory;
