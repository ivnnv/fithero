/* @flow */

import React, { useCallback, memo } from 'react';

import type { WorkoutExerciseTimeType } from '../../../database/types';
import EditSetItem from '../components/EditSetItem';
import EditSetsList from '../components/EditSetsList';
import EditSetsTimeItem from './EditSetsTimeItem';

type Props = {|
  exercise: ?WorkoutExerciseTimeType,
  selectedId: string,
  onPressItem: (setId: string) => void,
  type: string,
|};

const EditSetsTimeList = (props: Props) => {
  const { exercise, onPressItem, selectedId } = props;
  const data = exercise ? exercise.sets : [];

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <EditSetItem
          set={item}
          index={index + 1}
          isSelected={selectedId === item.id}
          onPressItem={onPressItem}
        >
          <EditSetsTimeItem time={item.time} />
        </EditSetItem>
      );
    },
    [onPressItem, selectedId]
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
