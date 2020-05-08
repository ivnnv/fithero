/* @flow */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import type { WorkoutExerciseWeightRepsType } from '../../../database/types';
import EditSetsInputControls from '../components/EditSetsInputControls';
import i18n from '../../../utils/i18n';
import EditSetActionButtons from '../components/EditSetActionButtons';
import { deleteSet } from '../../../database/services/WorkoutSetService';
import {
  getWeight,
  getWeightUnit,
  toKg,
  toTwoDecimals,
} from '../../../utils/metrics';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import Card from '../../../components/Card';
import { useSelector } from 'react-redux';
import { addSetFromInput, getLastSet, getLastWeight } from '../utils';
import usePrevious from '../../../hooks/usePrevious';
import useSelectedId from '../hooks/useSelectedId';
import EditSetsWeightRepsList from './EditSetsWeightRepsList';

type Props = {
  day: string,
  exerciseKey: string,
  exercise: ?WorkoutExerciseWeightRepsType,
  selectedPage?: number,
};

const EditSetsWeightReps = (props: Props) => {
  const { day, exercise, exerciseKey, selectedPage } = props;
  const [selectedId, setSelectedId] = useSelectedId(selectedPage);
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );
  const previousDefaultUnitSystem = usePrevious<DefaultUnitSystemType>(
    defaultUnitSystem
  );
  const isAddingExercise = useRef(false);
  const unit = getWeightUnit(exercise, defaultUnitSystem);
  const lastSet = getLastSet(exercise, exerciseKey);
  const lastWeight = getLastWeight(exercise, lastSet, unit);
  const lastReps = lastSet ? lastSet.reps.toString() : '8';

  const [weight, setWeight] = useState(lastWeight);
  const [reps, setReps] = useState(lastReps);

  const handleIncDec = useCallback(
    (value, setValue, property, increment: number) => {
      const currentValue = value >= '0' ? value : '0';
      const parsedValue =
        property === 'weight'
          ? parseFloat(currentValue)
          : parseInt(currentValue, 10);
      const newValue = (parsedValue + increment).toString();
      setValue(newValue > '0' ? newValue : '0');
    },
    []
  );

  const handleWeightInc = useCallback(() => {
    handleIncDec(weight, setWeight, 'weight', +1);
  }, [handleIncDec, weight]);

  const handleWeightDec = useCallback(() => {
    handleIncDec(weight, setWeight, 'weight', -1);
  }, [handleIncDec, weight]);

  const handleRepsInc = useCallback(() => {
    handleIncDec(reps, setReps, 'reps', +1);
  }, [handleIncDec, reps]);

  const handleRepsDec = useCallback(() => {
    handleIncDec(reps, setReps, 'reps', -1);
  }, [handleIncDec, reps]);

  const onChangeWeightInput = useCallback((value: string) => {
    const parsedValue = value.replace(',', '.');
    // TODO handle comma correctly depending on the locale (save it using dot but showing it using comma)
    if (value === '-' || !isNaN(parsedValue)) {
      setWeight(parsedValue);
    }
  }, []);

  const onChangeRepsInput = useCallback((value: string) => {
    setReps(value === '' || parseInt(value, 10) >= 0 ? value : '0');
  }, []);

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
          setWeight(
            toTwoDecimals(getWeight(set.weight, exercise, unit)).toString()
          );
          setReps(set.reps.toString());
        }
      }
    },
    [exercise, selectedId, setSelectedId, unit]
  );

  const onAddSet = useCallback(() => {
    // If the user presses very fast it can try to create a duplicated primary key
    if (isAddingExercise.current) {
      return;
    }
    isAddingExercise.current = true;

    Keyboard.dismiss();

    let newWeight = 0;
    if (weight !== '' && !isNaN(weight)) {
      newWeight =
        unit === 'metric' ? parseFloat(weight) : toKg(parseFloat(weight));
    }

    const newReps = reps ? parseInt(reps, 10) : 0;

    addSetFromInput({
      day,
      exerciseKey,
      exercise,
      category: 'weight_reps',
      partialSet: {
        weight: newWeight,
        reps: newReps,
      },
      weight_unit: unit,
      updateId: selectedId,
    });

    if (selectedId) {
      setSelectedId('');
    }
  }, [
    day,
    exercise,
    exerciseKey,
    reps,
    selectedId,
    setSelectedId,
    unit,
    weight,
  ]);

  const onDeleteSet = useCallback(() => {
    Keyboard.dismiss();

    deleteSet(selectedId);
    setSelectedId('');
  }, [selectedId, setSelectedId]);

  useEffect(() => {
    if (previousDefaultUnitSystem !== defaultUnitSystem && !exercise) {
      const unit = getWeightUnit(exercise, defaultUnitSystem);
      const lastSet = getLastSet(exercise, exerciseKey);
      const lastWeight = getLastWeight(exercise, lastSet, unit);
      setWeight(lastWeight);
    }
  }, [defaultUnitSystem, exercise, exerciseKey, previousDefaultUnitSystem]);

  useEffect(() => {
    if (isAddingExercise.current) {
      isAddingExercise.current = false;
    }
  }, [exercise]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <EditSetsInputControls
            value={weight}
            label={i18n.t('weight_label', {
              w:
                unit === 'metric'
                  ? i18n.t('kg.unit', { count: 10 })
                  : i18n.t('lb'),
            })}
            onChangeText={onChangeWeightInput}
            controls={[
              { icon: 'minus', action: handleWeightDec },
              { icon: 'plus', action: handleWeightInc },
            ]}
            keyboardType="numeric"
            containerStyle={[styles.weightContainer, styles.weightSeparation]}
            labelStyle={styles.weightSeparation}
            testID="weightInput"
          />
          <EditSetsInputControls
            value={reps}
            label={i18n.t('reps.title')}
            onChangeText={onChangeRepsInput}
            controls={[
              { icon: 'minus', action: handleRepsDec },
              { icon: 'plus', action: handleRepsInc },
            ]}
            keyboardType="number-pad"
            containerStyle={[styles.repsContainer, styles.repsSeparation]}
            labelStyle={styles.repsSeparation}
            testID="repsInput"
          />
        </View>
        <EditSetActionButtons
          isUpdate={!!selectedId}
          onAddSet={onAddSet}
          onDeleteSet={onDeleteSet}
        />
      </Card>
      <EditSetsWeightRepsList
        exercise={exercise}
        onPressItem={onPressItem}
        selectedId={selectedId}
        type={exerciseKey}
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  weightContainer: {
    flex: 1,
  },
  repsContainer: {
    flex: 0.9,
  },
  weightSeparation: {
    paddingRight: 8,
  },
  repsSeparation: {
    paddingLeft: 8,
  },
});

export default EditSetsWeightReps;
