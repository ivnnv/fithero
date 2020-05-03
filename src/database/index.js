/* @flow */

import Realm from 'realm';

import {
  WorkoutExerciseSchema,
  WorkoutSetSchema,
  WorkoutSchema,
  ExerciseSchema,
} from './schemas';

const realm = new Realm({
  schema: [
    WorkoutExerciseSchema,
    WorkoutSetSchema,
    WorkoutSchema,
    ExerciseSchema,
  ],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const workoutExercises = newRealm.objects('WorkoutExercise');
      const workoutSets = newRealm.objects('WorkoutSet');
      const exercises = newRealm.objects('Exercise');

      workoutExercises.forEach(e => {
        e.category = 'weight_reps';
      });
      workoutSets.forEach(s => {
        s.category = 'weight_reps';
      });
      exercises.forEach(e => {
        e.category = 'weight_reps';
      });
    }
  },
});

export default realm;
