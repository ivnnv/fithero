/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { formatDuration } from '../../../utils/metrics';

type Props = {|
  time: number,
|};

const EditSetsTimeItem = (props: Props) => {
  const { time } = props;
  const { colors } = useTheme();
  const duration = formatDuration(time);
  const placeholderText = duration.length === 2 ? '0:' : '';
  return (
    <>
      <Text style={styles.text}>
        <Text style={[{ color: colors.disabled }, styles.innerText]}>
          {placeholderText}
        </Text>
        <Text style={styles.innerText}>{duration}</Text>
      </Text>
      <View style={styles.space} />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    flex: 0.5,
  },
  innerText: {
    textAlign: 'right',
  },
  space: {
    flex: 0.5,
    paddingLeft: 16,
  },
});

export default EditSetsTimeItem;
