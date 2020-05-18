/* @flow */

import * as React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { formatDuration } from '../utils/metrics';
import type { TextStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = {
  time: number,
  color: string,
  textAlign?: string,
  style?: TextStyleProp,
};

const SetTimeFormat = (props: Props) => {
  const { time, color, style, textAlign = 'right' } = props;
  const { colors } = useTheme();

  const duration = formatDuration(time);
  const placeholderText = duration.length === 2 ? '0:' : '';

  return (
    <Text style={[style, { textAlign }]}>
      <Text style={[{ color: colors.disabled }, { textAlign }]}>
        {placeholderText}
      </Text>
      <Text style={[{ color }, { textAlign }]}>{formatDuration(time)}</Text>
    </Text>
  );
};

export default SetTimeFormat;
