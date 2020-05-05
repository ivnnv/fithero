/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import i18n from '../../../utils/i18n';
import type { WorkoutSetWeightRepsType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';
import { toLb, toTwoDecimals } from '../../../utils/metrics';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';

type Props = {|
  set: WorkoutSetWeightRepsType,
  unit: DefaultUnitSystemType,
|};

const EditSetsWeightRepsItem = (props: Props) => {
  const { set, unit } = props;

  const theme: ThemeType = useTheme();

  return (
    <>
      <Text style={[styles.text, styles.weight]}>
        {unit === 'metric'
          ? toTwoDecimals(set.weight)
          : toTwoDecimals(toLb(set.weight))}{' '}
        <Text style={[styles.unit, { color: theme.colors.secondaryText }]}>
          {unit === 'metric'
            ? i18n.t('kg.unit', { count: set.weight })
            : i18n.t('lb')}{' '}
        </Text>
      </Text>
      <Text style={[styles.text, styles.reps]}>
        {set.reps}{' '}
        <Text style={[styles.unit, { color: theme.colors.secondaryText }]}>
          {i18n.t('reps.unit', { count: set.reps })}{' '}
        </Text>
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  weight: {
    flex: 0.5,
    textAlign: 'right',
  },
  reps: {
    flex: 0.5,
    paddingLeft: 16,
    textAlign: 'right',
  },
  unit: {
    fontSize: 14,
  },
});

export default EditSetsWeightRepsItem;
