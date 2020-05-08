/* @flow */

import {
  addExercise,
  deleteExercise,
  userExerciseIdPrefix,
} from '../ExerciseService';
import realm from '../../index';
import { EXERCISE_SCHEMA_NAME } from '../../schemas/ExerciseSchema';
import { WORKOUT_EXERCISE_SCHEMA_NAME } from '../../schemas/WorkoutExerciseSchema';
import { mockWorkouts } from './helpers/databaseMocks';
import { WORKOUT_SET_SCHEMA_NAME } from '../../schemas/WorkoutSetSchema';
import { WORKOUT_SCHEMA_NAME } from '../../schemas/WorkoutSchema';

describe('addExercise', () => {
  let current = 0;
  realm.objects = jest.fn(() => ({
    sorted: jest.fn(() => {
      const exercise = [
        {
          id: `${userExerciseIdPrefix}${current.toString().padStart(6, '0')}`,
          name: 'Existing exercise',
        },
      ];
      current++;
      return exercise;
    }),
  }));

  it('calls addExercise with correct data and generated id', () => {
    const exercise = {
      name: 'TestExercise',
      notes: 'Very hard!',
      primary: ['Chest'],
      category: 'weight_reps',
    };

    const generated = [...Array(102)].map((_, i) =>
      (i + 1).toString().padStart(6, '0')
    );
    generated.forEach(g => {
      addExercise(exercise);
      expect(realm.create).toHaveBeenCalledWith(EXERCISE_SCHEMA_NAME, {
        id: `${userExerciseIdPrefix}${g}`,
        ...exercise,
      });
    });
  });
});

describe('deleteExercise', () => {
  it('calls the necessary deletes operation in order', () => {
    const mockWorkout = mockWorkouts[0];
    const mockWorkoutExercise = mockWorkout.exercises[0];
    const mockExercise = {
      id: mockWorkoutExercise.type,
      name: 'Some name',
      primary: ['Abs'],
      secondary: [],
      category: 'weight_reps',
    };

    realm.objects = jest.fn((schemaName: string) => ({
      filtered: jest.fn(() => {
        if (schemaName === WORKOUT_EXERCISE_SCHEMA_NAME) {
          return [mockWorkoutExercise];
        } else if (schemaName === WORKOUT_SET_SCHEMA_NAME) {
          return mockWorkoutExercise.sets;
        } else if (schemaName === WORKOUT_SCHEMA_NAME) {
          return [mockWorkout];
        }
        return [];
      }),
    }));

    realm.objectForPrimaryKey = jest.fn(() => mockExercise);

    deleteExercise(mockExercise.id);

    expect(realm.delete).toHaveBeenCalledTimes(3);
    expect(realm.delete.mock.calls[0][0]).toEqual([
      ...mockWorkoutExercise.sets,
      mockWorkoutExercise,
    ]);
    expect(realm.delete.mock.calls[1][0]).toEqual([mockWorkout]);
    expect(realm.delete.mock.calls[2][0]).toEqual(mockExercise);
  });
});
