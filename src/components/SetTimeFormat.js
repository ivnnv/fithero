/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { formatDuration } from '../utils/metrics';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
  time: number,
  color: string,
  style: TextStyleProp,
};

const SetTimeFormat = (props: Props) => {
  const { time, color, style } = props;
  const { colors } = useTheme();

  const duration = formatDuration(time);
  const placeholderText = duration.length === 2 ? '0:' : '';

  return (
    <Text style={[styles.time, style]}>
      <Text style={[{ color: colors.disabled }, styles.innerText]}>
        {placeholderText}
      </Text>
      <Text style={[{ color }, styles.innerText]}>{formatDuration(time)}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  time: {
    textAlign: 'right', // Android needs it here
  },
  innerText: {
    textAlign: 'right', // iOS needs it here
  },
});

export default SetTimeFormat;
