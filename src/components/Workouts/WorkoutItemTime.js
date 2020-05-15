/* @flow */

import * as React from 'react';

import type {
  WorkoutExerciseTimeType,
  WorkoutSetSchemaType,
  WorkoutSetTimeType,
} from '../../database/types';
import { useCallback } from 'react';
import useMaxSetHook from '../../hooks/useMaxSetHook';
import { getMaxTimeByType } from '../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../database/constants';
import WorkoutTimeSetItem from '../WorkoutTimeSetItem';

type Props = {|
  exercise: WorkoutExerciseTimeType,
|};

const WorkoutItemTime = (props: Props) => {
  const { exercise } = props;

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    exercise.type,
    getMaxTimeByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;

  const renderSet = useCallback(
    (set: WorkoutSetTimeType, index: number) => {
      return (
        <WorkoutTimeSetItem
          key={set.id}
          set={set}
          index={index}
          maxSetId={maxSetId}
        />
      );
    },
    [maxSetId]
  );

  return <>{exercise.sets.map((set, index) => renderSet(set, index))}</>;
};

export default WorkoutItemTime;
