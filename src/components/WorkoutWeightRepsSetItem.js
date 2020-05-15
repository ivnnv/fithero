/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import i18n from '../utils/i18n';
import { toLb, toTwoDecimals } from '../utils/metrics';
import type { WorkoutSetWeightRepsType } from '../database/types';
import type { DefaultUnitSystemType } from '../redux/modules/settings';

type Props = {
  set: WorkoutSetWeightRepsType,
  maxSetId: ?string,
  maxRepId: ?string,
  index: number,
  unit: DefaultUnitSystemType,
};

const WorkoutWeightRepsSetItem = (props: Props) => {
  const { set, maxSetId, maxRepId, index, unit } = props;
  const { colors } = useTheme();

  const isMaxSet = maxSetId === set.id;
  const isMaxRep = maxRepId === set.id;
  const color = isMaxSet
    ? colors.trophy
    : isMaxRep
    ? colors.trophyReps
    : colors.text;

  return (
    <View style={styles.row}>
      <Text style={[styles.index, { color }]}>{`${index + 1}.`}</Text>
      <Text style={[styles.weight, { color }]}>
        {unit === 'metric'
          ? `${i18n.t('kg.value', {
              count: toTwoDecimals(set.weight),
            })}`
          : `${toTwoDecimals(toLb(set.weight))} ${i18n.t('lb')}`}
      </Text>
      <Text style={[styles.reps, { color }]}>{`${i18n.t('reps.value', {
        count: set.reps,
      })}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  index: {
    flex: 0.08,
    paddingRight: 8,
  },
  weight: {
    flex: 0.25,
    textAlign: 'right',
    paddingRight: 8,
  },
  reps: {
    flex: 0.25,
    textAlign: 'right',
  },
});

export default WorkoutWeightRepsSetItem;
