/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SetTimeFormat from '../../../components/SetTimeFormat';

type Props = {|
  time: number,
|};

const EditSetsTimeItem = (props: Props) => {
  const { time } = props;
  const { colors } = useTheme();
  return (
    <>
      <SetTimeFormat time={time} color={colors.text} style={styles.text} />
      <View style={styles.space} />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    flex: 0.5,
  },
  space: {
    flex: 0.5,
    paddingLeft: 16,
  },
});

export default EditSetsTimeItem;
