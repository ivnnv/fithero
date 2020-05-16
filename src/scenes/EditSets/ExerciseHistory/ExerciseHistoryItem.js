/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { getDatePrettyFormat } from '../../../utils/date';
import type { WorkoutExerciseSchemaType } from '../../../database/types';

type Props = {|
  exercise: WorkoutExerciseSchemaType,
  todayString: string,
  renderSets: () => React.Node,
|};

const ExerciseHistoryItem = (props: Props) => {
  const { exercise, todayString, renderSets } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {getDatePrettyFormat(exercise.date, todayString)}
      </Text>
      {renderSets()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  date: {
    paddingBottom: 12,
  },
});

export default React.memo<Props>(
  ExerciseHistoryItem,
  (prevProps, nextProps) => {
    if (
      prevProps.renderSets !== nextProps.renderSets ||
      prevProps.todayString !== nextProps.todayString
    ) {
      return false;
    }

    return (
      // Doing it like this because of Realm
      JSON.stringify(prevProps.exercise) === JSON.stringify(nextProps.exercise)
    );
  }
);
