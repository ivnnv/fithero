/* @flow */

import * as React from 'react';
import { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import useKeyboard from '../../../hooks/useKeyboard';
import type { WorkoutSetSchemaType } from '../../../database/types';

type Props<T> = {|
  data: Array<T>,
  renderItem: ({
    item: T,
    index: number,
  }) => React.Node,
|};

export function EditSetsList<T: WorkoutSetSchemaType>(props: Props<T>) {
  const { data, renderItem } = props;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const keyboardCallback = useCallback(height => {
    setKeyboardHeight(height > 0 ? height : 0);
  }, []);

  useKeyboard(keyboardCallback);

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={Divider}
      />
      <View style={{ height: keyboardHeight }} />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 12,
  },
});

export default EditSetsList;
