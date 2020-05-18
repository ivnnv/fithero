/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import i18n from '../../../utils/i18n';

type Props = {
  children: React.Node,
};

const PersonalRecords = ({ children }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('personal_records')}</Text>
      <View style={styles.recordsContainer}>{children}</View>
      <Text>{i18n.t('history')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 8 : 12,
  },
  title: {
    paddingBottom: 12,
  },
  recordsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 16,
  },
});

export default PersonalRecords;
