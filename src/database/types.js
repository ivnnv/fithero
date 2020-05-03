/* @flow */

interface RealmObject {
  isValid: () => boolean;
}

export type AddWorkoutSchemaType = {|
  id: string,
  date: Date,
  comments?: string,
  exercises: Array<WorkoutExerciseSchemaType>,
|};

export type WorkoutSchemaType = {|
  ...AddWorkoutSchemaType,
  isValid: () => boolean,
|};

type ExerciseCategoryType = 'weight_reps' | 'reps' | 'time' | 'time_distance';

export type AddWorkoutExerciseSchemaType = {
  id: string,
  date: Date,
  type: string,
  sets: Array<WorkoutSetSchemaType>,
  weight_unit: 'metric' | 'imperial',
  category: ExerciseCategoryType,
};

export type WorkoutExerciseSchemaType = RealmObject &
  AddWorkoutExerciseSchemaType & {
    sort: number,
  };

export type WorkoutSetSchemaType = {|
  id: string,
  date: Date,
  type: string,
  reps: number,
  weight: number,
|};

export type AddExerciseType = {|
  name: string,
  notes?: ?string,
  primary: Array<string>,
  secondary?: Array<string>,
  category: ExerciseCategoryType,
|};

export type ExerciseSchemaType = {|
  id: string,
  name: string,
  notes: ?string,
  primary: Array<string>,
  secondary: Array<string>,
  category: ExerciseCategoryType,
|};
