/* @flow */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import EditSetActionButtons from '../components/EditSetActionButtons';
import EditSetsTimeInput from './EditSetsTimeInput';
import { durationInputStringToSeconds } from '../../../utils/metrics';
import useSelectedId from '../hooks/useSelectedId';
import type { WorkoutExerciseTimeType } from '../../../database/types';
import { addSetFromInput, getLastDuration } from '../utils';
import { useRoute } from '@react-navigation/native';
import type { EditSetsScreenRouteType } from '../EditSetsScreen';

type Props = {
  exercise: ?WorkoutExerciseTimeType,
  selectedPage?: number,
};

const EditSetsTime = (props: Props) => {
  const { exercise, selectedPage } = props;
  const route: EditSetsScreenRouteType = useRoute();
  const { day, exerciseKey } = route.params;
  const isAddingExercise = useRef(false);
  const lastSetDuration = useMemo(
    () => getLastDuration(exercise, exerciseKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exerciseKey]
  );
  const [hours, setHours] = useState(lastSetDuration.hours);
  const [minutes, setMinutes] = useState(lastSetDuration.minutes);
  const [seconds, setSeconds] = useState(lastSetDuration.seconds);
  const [selectedId, setSelectedId] = useSelectedId(selectedPage);

  const onAddSet = useCallback(() => {
    // If the user presses very fast it can try to create a duplicated primary key
    if (isAddingExercise.current) {
      return;
    }
    isAddingExercise.current = true;

    Keyboard.dismiss();

    const duration = durationInputStringToSeconds({ hours, minutes, seconds });

    addSetFromInput({
      day,
      exerciseKey,
      exercise,
      category: 'time',
      partialSet: {
        time: duration,
      },
      updateId: selectedId,
    });

    if (selectedId) {
      setSelectedId('');
    }
  }, [
    day,
    exercise,
    exerciseKey,
    hours,
    minutes,
    seconds,
    selectedId,
    setSelectedId,
  ]);

  useEffect(() => {
    if (isAddingExercise.current) {
      isAddingExercise.current = false;
    }
  }, [exercise]);

  return (
    <Card style={styles.card}>
      <View style={styles.cardBody}>
        <EditSetsTimeInput
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
        />
      </View>
      <EditSetActionButtons
        isUpdate={false}
        onAddSet={onAddSet}
        onDeleteSet={() => {}}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
});

export default EditSetsTime;
