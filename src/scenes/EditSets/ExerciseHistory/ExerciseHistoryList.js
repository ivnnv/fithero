/* @flow */

import * as React from 'react';
import { useCallback } from 'react';
import { VirtualizedList, Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

import useRealmResultsHook from '../../../hooks/useRealmResultsHook';
import { getExercisesByType } from '../../../database/services/WorkoutExerciseService';
import type {
  ExerciseCategoryType,
  WorkoutExerciseSchemaType,
} from '../../../database/types';
import { dateToString } from '../../../utils/date';
import i18n from '../../../utils/i18n';
import { REALM_DEFAULT_DEBOUNCE_VALUE } from '../../../database/constants';
import Card from '../../../components/Card';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    exerciseCategory: ExerciseCategoryType,
  },
};

type Props = {
  // eslint-disable-next-line flowtype/no-weak-types
  ListHeaderComponent: ?(React.ComponentType<any> | React.Element<any>),
  renderItem: (exercise: WorkoutExerciseSchemaType) => React.Node,
};

const ExerciseHistoryList = (props: Props) => {
  const { navigate } = useNavigation();
  const route: RouteType = useRoute();
  const { exerciseKey, exerciseName, exerciseCategory } = route.params;
  const type = route.params.exerciseKey;

  const { data, timestamp } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getExercisesByType(type), [type]),
    // On Android as the tab is always rendered, we gotta do some more optimizations
    debounceTime: Platform.OS === 'android' ? REALM_DEFAULT_DEBOUNCE_VALUE : 0,
  });

  const renderItem = useCallback(
    ({ item }) => {
      if (!item.isValid()) {
        return null;
      }
      return (
        <Card
          style={styles.card}
          onPress={() => {
            navigate('EditSetsModal', {
              isModal: true,
              day: dateToString(item.date),
              exerciseName,
              exerciseKey,
              exerciseCategory,
            });
          }}
        >
          {props.renderItem(item)}
        </Card>
      );
    },
    [exerciseCategory, exerciseKey, exerciseName, navigate, props]
  );

  const getItem = useCallback((data, index) => {
    if (data.isValid()) {
      return data[index].isValid() ? data[index] : null;
    }
    return null;
  }, []);

  const getItemCount = useCallback(data => {
    if (data.isValid()) {
      return data.length;
    }
    return 0;
  }, []);

  return (
    <VirtualizedList
      data={data}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      renderItem={renderItem}
      extraData={timestamp}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      ListEmptyComponent={renderEmptyView}
      ListHeaderComponent={props.ListHeaderComponent}
      getItem={getItem}
      getItemCount={getItemCount}
    />
  );
};

const keyExtractor = exercise => exercise.id;

const renderEmptyView = () => (
  <View style={styles.emptyContainer}>
    <Text>{i18n.t('empty_view__history')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 8 : 0,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : 4,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  emptyContainer: {
    padding: 16,
  },
});

export default ExerciseHistoryList;
