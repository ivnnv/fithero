/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

import i18n from '../../../utils/i18n';
import type { ThemeType } from '../../../utils/theme/withTheme';

type Props = {
  isUpdate: boolean,
  onAddSet: () => void,
  onDeleteSet: () => void,
};

const EditSetActionButtons = ({ isUpdate, onAddSet, onDeleteSet }: Props) => {
  const theme: ThemeType = useTheme();

  return (
    <View style={styles.controls}>
      <Button
        onPress={onAddSet}
        color={theme.colors.text}
        style={[styles.button, styles.confirm]}
        testID="addSetButton"
      >
        {i18n.t(isUpdate ? 'update' : 'add')}
      </Button>
      <Button
        onPress={onDeleteSet}
        color={theme.colors.text}
        disabled={!isUpdate}
        style={[styles.button, styles.delete]}
        testID="deleteSetButton"
      >
        {i18n.t('delete')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
  },
  button: {
    margin: 8,
  },
  confirm: {
    flex: 0.7,
  },
  delete: {
    flex: 0.3,
  },
});

export default EditSetActionButtons;
