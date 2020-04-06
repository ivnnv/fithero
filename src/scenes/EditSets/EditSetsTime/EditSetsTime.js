/* @flow */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import EditSetActionButtons from '../EditSetActionButtons';
import EditSetsTimeInput from './EditSetsTimeInput';

// TODO include hook to handle back button on Android
// TODO extract functions with useCallback

const EditSetsTime = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.cardBody}>
        <EditSetsTimeInput />
      </View>
      <EditSetActionButtons
        isUpdate={false}
        onAddSet={() => {}}
        onDeleteSet={() => {}}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
});

export default EditSetsTime;
