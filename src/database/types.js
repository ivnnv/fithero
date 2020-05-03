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

type AddWorkoutExerciseSchemaType = {
  id: string,
  date: Date,
  type: string,
  weight_unit: 'metric' | 'imperial',
  category: ExerciseCategoryType,
  sets: Array<WorkoutSetWeightRepsType>,
};

export type AddWorkoutExerciseWeightRepsType = AddWorkoutExerciseSchemaType & {
  sets: Array<WorkoutSetWeightRepsType>,
};

export type WorkoutExerciseWeightRepsType = RealmObject &
  AddWorkoutExerciseSchemaType & {
    sets: Array<WorkoutSetWeightRepsType>,
    sort: number,
  };

export type WorkoutExerciseTimeType = RealmObject &
  AddWorkoutExerciseSchemaType & {
    sets: Array<WorkoutSetTimeType>,
    sort: number,
  };

export type WorkoutExerciseSchemaType =
  | WorkoutExerciseWeightRepsType
  | WorkoutExerciseTimeType;

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
  time: string,
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
