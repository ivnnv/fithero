/* @flow */

export const WORKOUT_SET_SCHEMA_NAME = 'WorkoutSet';

const WorkoutSetSchema = {
  name: WORKOUT_SET_SCHEMA_NAME,
  primaryKey: 'id',
  properties: {
    id: 'string',
    date: 'date',
    type: 'string',
    category: { type: 'string', default: 'weight_reps' },
    reps: { type: 'int', optional: true },
    weight: { type: 'float', optional: true },
    time: { type: 'string', optional: true },
    distance: { type: 'float', optional: true },
  },
};

export default WorkoutSetSchema;
