/* @flow */

import * as React from 'react';
import { useCallback, memo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import type { WorkoutSetSchemaType } from '../../../database/types';
import type { ThemeType } from '../../../utils/theme/withTheme';

type Props = {|
  isSelected: boolean,
  trophyColor: ?string,
  color: ?string,
  onPressItem: (setId: string) => void,
  index: number,
  set: WorkoutSetSchemaType,
  children: React.Node,
|};

const EditSetItem = (props: Props) => {
  const { index, isSelected, trophyColor, onPressItem, set, children } = props;

  const theme: ThemeType = useTheme();

  const onPress = useCallback(() => {
    onPressItem(set.id);
  }, [onPressItem, set.id]);

  return (
    <TouchableWithoutFeedback onPress={onPress} testID={`editSetItem-${index}`}>
      <View
        style={[
          styles.item,
          isSelected && { backgroundColor: theme.colors.selected },
        ]}
      >
        <View style={styles.leftContent}>
          <Text style={[styles.text, styles.index]}>{index}.</Text>
          <Icon
            name="trophy"
            size={24}
            color={trophyColor}
            style={[styles.icon, !trophyColor && styles.notMax]}
          />
        </View>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 36,
  },
  text: {
    fontSize: 18,
  },
  leftContent: {
    flexDirection: 'row',
    flex: 0.25,
  },
  index: {
    textAlign: 'left',
  },
  icon: {
    marginHorizontal: 24,
    height: 24,
    width: 24,
  },
  notMax: {
    opacity: 0,
  },
});

// TODO
// $FlowFixMe
export default memo(EditSetItem, (prevProps, nextProps) => {
  if (
    prevProps.isSelected !== nextProps.isSelected ||
    prevProps.trophyColor !== nextProps.trophyColor ||
    // TODO comment out for now because it breaks as selectedId always changes onPressItem.
    //  It seems to not affect the usage (as already we have isSelected prop)
    // prevProps.onPressItem !== nextProps.onPressItem ||
    prevProps.index !== nextProps.index
  ) {
    return false;
  }

  return (
    // Doing it like this because of Realm
    JSON.stringify(prevProps.set) === JSON.stringify(nextProps.set)
  );
});
