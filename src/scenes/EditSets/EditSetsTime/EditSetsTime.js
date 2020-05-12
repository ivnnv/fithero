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
import {
  durationInputStringToSeconds,
  secondsDurationToInputString,
} from '../../../utils/metrics';
import useSelectedId from '../hooks/useSelectedId';
import type { WorkoutExerciseTimeType } from '../../../database/types';
import { addSetFromInput, getLastDuration } from '../utils';
import { useRoute } from '@react-navigation/native';
import type { EditSetsScreenRouteType } from '../EditSetsScreen';
import EditSetsTimeList from './EditSetsTimeList';
import { deleteSet } from '../../../database/services/WorkoutSetService';

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
  const [duration, setDuration] = useState({
    hours: lastSetDuration.hours,
    minutes: lastSetDuration.minutes,
    seconds: lastSetDuration.seconds,
  });
  const { hours, minutes, seconds } = duration;
  const [selectedId, setSelectedId] = useSelectedId(selectedPage);

  const onAddSet = useCallback(() => {
    // If the user presses very fast it can try to create a duplicated primary key
    if (isAddingExercise.current) {
      return;
    }
    isAddingExercise.current = true;

    Keyboard.dismiss();

    const validateNumber = n => (n === '' || isNaN(n) ? '0' : n);

    const duration = durationInputStringToSeconds({
      hours: validateNumber(hours),
      minutes: validateNumber(minutes),
      seconds: validateNumber(seconds),
    });

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

  const onDeleteSet = useCallback(() => {
    Keyboard.dismiss();

    deleteSet(selectedId);
    setSelectedId('');
  }, [selectedId, setSelectedId]);

  const onPressItem = useCallback(
    (setId: string) => {
      if (selectedId === setId) {
        setSelectedId('');
        return;
      }
      if (exercise) {
        const { sets } = exercise;
        const set = sets.find(s => s.id === setId);
        if (set) {
          setSelectedId(setId);
          const { hours, minutes, seconds } = secondsDurationToInputString(
            set.time
          );
          setDuration({ hours, minutes, seconds });
        }
      }
    },
    [exercise, selectedId, setSelectedId]
  );

  useEffect(() => {
    if (isAddingExercise.current) {
      isAddingExercise.current = false;
    }
  }, [exercise]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cardBody}>
          <EditSetsTimeInput
            hours={hours}
            setHours={hours => setDuration({ ...duration, hours })}
            minutes={minutes}
            setMinutes={minutes => setDuration({ ...duration, minutes })}
            seconds={seconds}
            setSeconds={seconds => setDuration({ ...duration, seconds })}
          />
        </View>
        <EditSetActionButtons
          isUpdate={!!selectedId}
          onAddSet={onAddSet}
          onDeleteSet={onDeleteSet}
        />
      </Card>
      <EditSetsTimeList
        exercise={exercise}
        selectedId={selectedId}
        type={exerciseKey}
        onPressItem={onPressItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
