/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { WorkoutSetTimeType } from '../database/types';
import SetTimeFormat from './SetTimeFormat';

type Props = {
  set: WorkoutSetTimeType,
  maxSetId: ?string,
  index: number,
};

const WorkoutTimeSetItem = (props: Props) => {
  const { set, maxSetId, index } = props;
  const { colors } = useTheme();

  const color = maxSetId === set.id ? colors.trophy : colors.text;

  return (
    <View style={styles.row}>
      <Text style={[styles.index, { color }]}>{`${index + 1}.`}</Text>
      <SetTimeFormat time={set.time} color={color} style={styles.time} />
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
  time: {
    flex: 0.25,
  },
});

export default WorkoutTimeSetItem;
