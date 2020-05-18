/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../../../utils/i18n';
import { formatDate, isSameYear, isToday } from '../../../utils/date';
import type { ThemeType } from '../../../utils/theme/withTheme';
import Card from '../../../components/Card';

type Props = {|
  date: Date,
  trophyColor: string,
  children: React.Node,
  last?: boolean,
|};

const PersonalRecordItem = ({ date, children, trophyColor, last }: Props) => {
  const { colors }: ThemeType = useTheme();

  return (
    <Card style={[styles.card, !last && styles.cardSeparator]}>
      <View>
        <View style={styles.row}>
          <Text style={styles.recordDate}>
            {isToday(date)
              ? i18n.t('today')
              : formatDate(date, isSameYear(date) ? 'MMM D' : 'YYYY')}
          </Text>
          <Icon name="trophy" size={24} color={trophyColor} />
        </View>
        <Text style={[styles.singleNumber, { color: colors.text }]}>
          {children}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.5,
    padding: 16,
  },
  cardSeparator: {
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordDate: {
    marginBottom: 12,
  },
  singleNumber: {
    fontSize: 18,
  },
});

export default PersonalRecordItem;
