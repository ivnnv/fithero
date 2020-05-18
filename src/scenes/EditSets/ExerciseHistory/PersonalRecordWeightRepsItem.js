/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import i18n from '../../../utils/i18n';
import { toLb, toTwoDecimals } from '../../../utils/metrics';
import type { WorkoutSetWeightRepsType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';
import type { DefaultUnitSystemType } from '../../../redux/modules/settings';

type Props = {|
  set: WorkoutSetWeightRepsType,
  unit: DefaultUnitSystemType,
|};

const PersonalRecordWeightRepsItem = ({ set, unit }: Props) => {
  const { colors }: ThemeType = useTheme();

  const unitText =
    unit === 'metric'
      ? i18n.t('kg.unit', { count: Math.floor(set.weight) })
      : i18n.t('lb');
  const repsText = i18n.t('reps.unit', { count: set.reps });

  return (
    <>
      {toTwoDecimals(unit === 'metric' ? set.weight : toLb(set.weight))}
      <Text style={[styles.unit, { color: colors.secondaryText }]}>
        {` ${unitText} x `}
      </Text>
      <Text style={{ color: colors.text }}>
        {`${set.reps} `}
        <Text style={[styles.unit, { color: colors.secondaryText }]}>
          {repsText}
        </Text>
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  unit: {
    fontSize: 14,
  },
});

export default PersonalRecordWeightRepsItem;
