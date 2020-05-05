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

export type ExerciseCategoryType =
  | 'weight_reps'
  | 'reps'
  | 'time'
  | 'time_distance';

type BaseWorkoutExerciseSchemaType = {
  id: string,
  date: Date,
  type: string,
  category: ExerciseCategoryType,
};

export type AddWorkoutExerciseWeightRepsType = BaseWorkoutExerciseSchemaType & {
  sets: Array<WorkoutSetWeightRepsType>,
};

export type WorkoutExerciseWeightRepsType = RealmObject &
  BaseWorkoutExerciseSchemaType & {
    weight_unit: 'metric' | 'imperial',
    sets: Array<WorkoutSetWeightRepsType>,
    sort: number,
  };

export type WorkoutExerciseTimeType = RealmObject &
  BaseWorkoutExerciseSchemaType & {
    sets: Array<WorkoutSetTimeType>,
    sort: number,
  };

export type WorkoutExerciseSchemaType = WorkoutExerciseWeightRepsType &
  WorkoutExerciseTimeType;

export type WorkoutSetSchemaType = {
  id: string,
  date: Date,
  type: string,
};

export type WorkoutSetWeightRepsType = WorkoutSetSchemaType & {
  reps: number,
  weight: number,
};

export type WorkoutSetTimeType = WorkoutSetSchemaType & {
  time: number,
};

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
