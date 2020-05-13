/* @flow */

import React, { useCallback, memo } from 'react';

import type {
  WorkoutExerciseWeightRepsType,
  WorkoutSetSchemaType,
} from '../../../database/types';
import EditSetItem from '../components/EditSetItem';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import {
  getMaxRepByType,
  getMaxWeightByType,
} from '../../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import { useSelector } from 'react-redux';
import { getWeightUnit } from '../../../utils/metrics';
import EditSetsList from '../components/EditSetsList';
import EditSetsWeightRepsItem from './EditSetsWeightRepsItem';
import type { ThemeType } from '../../../utils/theme/withTheme';
import { useTheme } from 'react-native-paper';

type Props = {|
  exercise: ?WorkoutExerciseWeightRepsType,
  selectedId: string,
  onPressItem: (setId: string) => void,
  type: string,
|};

const EditSetsWeightRepsList = (props: Props) => {
  const { exercise, onPressItem, selectedId, type } = props;
  const data = exercise ? exercise.sets : [];

  const { colors }: ThemeType = useTheme();
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const unit = getWeightUnit(exercise, defaultUnitSystem);

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxWeightByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );
  const maxRep: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxRepByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;
  const maxRepId = maxRep ? maxRep.id : null;

  const renderItem = useCallback(
    ({ item, index }) => {
      const trophyColor =
        maxSetId === item.id
          ? colors.trophy
          : maxRepId === item.id
          ? colors.trophyReps
          : null;
      return (
        <EditSetItem
          set={item}
          index={index + 1}
          isSelected={selectedId === item.id}
          trophyColor={trophyColor}
          onPressItem={onPressItem}
        >
          <EditSetsWeightRepsItem set={item} unit={unit} />
        </EditSetItem>
      );
    },
    [
      colors.trophy,
      colors.trophyReps,
      maxRepId,
      maxSetId,
      onPressItem,
      selectedId,
      unit,
    ]
  );

  return <EditSetsList data={data} renderItem={renderItem} />;
};

export default memo<Props>(EditSetsWeightRepsList, (prevProps, nextProps) => {
  if (
    prevProps.selectedId !== nextProps.selectedId ||
    prevProps.onPressItem !== nextProps.onPressItem ||
    prevProps.type !== nextProps.type
  ) {
    return false;
  }

  return (
    // Doing it like this because of Realm
    JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
  );
});
