/* @flow */

import React, { useCallback, memo } from 'react';

import type {
  WorkoutExerciseTimeType,
  WorkoutSetSchemaType,
} from '../../../database/types';
import EditSetItem from '../components/EditSetItem';
import EditSetsList from '../components/EditSetsList';
import EditSetsTimeItem from './EditSetsTimeItem';
import useMaxSetHook from '../../../hooks/useMaxSetHook';
import { getMaxTimeByType } from '../../../database/services/WorkoutSetService';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import type { ThemeType } from '../../../utils/theme/withTheme';
import { useTheme } from 'react-native-paper';

type Props = {|
  exercise: ?WorkoutExerciseTimeType,
  selectedId: string,
  onPressItem: (setId: string) => void,
  type: string,
|};

const EditSetsTimeList = (props: Props) => {
  const { exercise, onPressItem, selectedId, type } = props;
  const data = exercise ? exercise.sets : [];
  const { colors }: ThemeType = useTheme();

  const maxSet: ?WorkoutSetSchemaType = useMaxSetHook(
    type,
    getMaxTimeByType,
    REALM_DEFAULT_DEBOUNCE_VALUE
  );

  const maxSetId = maxSet ? maxSet.id : null;

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <EditSetItem
          set={item}
          index={index + 1}
          isSelected={selectedId === item.id}
          onPressItem={onPressItem}
          trophyColor={maxSetId === item.id ? colors.trophy : null}
        >
          <EditSetsTimeItem time={item.time} />
        </EditSetItem>
      );
    },
    [colors.trophy, maxSetId, onPressItem, selectedId]
  );

  return <EditSetsList data={data} renderItem={renderItem} />;
};

export default memo<Props>(EditSetsTimeList, (prevProps, nextProps) => {
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
