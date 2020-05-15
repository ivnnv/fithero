/* @flow */

import * as React from 'react';
import { useSelector } from 'react-redux';

import type {
  WorkoutExerciseWeightRepsType,
  WorkoutSetSchemaType,
  WorkoutSetWeightRepsType,
} from '../../database/types';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import WorkoutWeightRepsSetItem from '../WorkoutWeightRepsSetItem';
import { useCallback } from 'react';
import useMaxSetHook from '../../hooks/useMaxSetHook';
import {
  getMaxRepByType,
  getMaxWeightByType,
} from '../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../database/constants';
import { getWeightUnit } from '../../utils/metrics';

type Props = {|
  exercise: WorkoutExerciseWeightRepsType,
|};

const WorkoutItemWeightReps = (props: Props) => {
  const { exercise } = props;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );
  const unit = getWeightUnit(exercise, defaultUnitSystem);

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    exercise.type,
    getMaxWeightByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxRep: ?WorkoutSetSchemaType = useMaxSetHook(
    exercise.type,
    getMaxRepByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;
  const maxRepId = maxRep ? maxRep.id : null;

  const renderSet = useCallback(
    (set: WorkoutSetWeightRepsType, index: number) => {
      return (
        <WorkoutWeightRepsSetItem
          key={set.id}
          set={set}
          maxSetId={maxSetId}
          maxRepId={maxRepId}
          index={index}
          unit={unit}
        />
      );
    },
    [maxRepId, maxSetId, unit]
  );

  return <>{exercise.sets.map((set, index) => renderSet(set, index))}</>;
};

export default WorkoutItemWeightReps;
