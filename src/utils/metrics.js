/* @flow */

import * as RNLocalize from 'react-native-localize';

import type { WorkoutExerciseWeightRepsType } from '../database/types';
import type { DefaultUnitSystemType } from '../redux/modules/settings';

const oneKgToLb = 2.204622622;

export const toLb = (value: number) => value * oneKgToLb;
export const toKg = (value: number) => value / oneKgToLb;
export const toTwoDecimals = (value: number) => Math.round(value * 100) / 100;

export const getWeight = (
  value: number,
  exercise: ?WorkoutExerciseWeightRepsType,
  defaultUnitSystem: DefaultUnitSystemType
) => {
  const unit =
    exercise &&
    ((exercise.isValid && exercise.isValid()) || !exercise.isValid) &&
    exercise.weight_unit
      ? exercise.weight_unit
      : defaultUnitSystem;
  if (unit !== 'metric') {
    return toLb(value);
  }
  return value;
};

export const getWeightUnit = (
  exercise: ?WorkoutExerciseWeightRepsType,
  defaultUnitSystem: DefaultUnitSystemType
): DefaultUnitSystemType =>
  exercise &&
  ((exercise.isValid && exercise.isValid()) || !exercise.isValid) &&
  exercise.weight_unit
    ? exercise.weight_unit
    : defaultUnitSystem;

export const getDefaultUnitSystemByCountry = (): DefaultUnitSystemType => {
  const country = RNLocalize.getCountry();
  if (
    country === 'US' ||
    country === 'UK' ||
    country === 'MM' ||
    country === 'LR'
  ) {
    return 'imperial';
  }
  return 'metric';
};

type DurationInputStringType = {
  hours: string,
  minutes: string,
  seconds: string,
};

export const durationInputStringToSeconds = ({
  hours,
  minutes,
  seconds,
}: DurationInputStringType) =>
  parseInt(hours, 10) * 3600 +
  parseInt(minutes, 10) * 60 +
  parseInt(seconds, 10);

export const secondsDurationToInputString = (secondsDuration: number) => {
  const hours = Math.floor(secondsDuration / 3600);
  const minutes = Math.floor((secondsDuration - hours * 3600) / 60);
  const seconds = secondsDuration - hours * 3600 - minutes * 60;

  return {
    hours: hours.toString(),
    minutes: minutes.toString(),
    seconds: seconds.toString(),
  };
};
