/* @flow */

import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import EditSetsInputControls from '../EditSetsInputControls';

type Props = {
  label: string,
  time: string,
  setTime: string => void,
  style?: ViewStyleProp,
};

const TimeInput = ({ label, time, setTime, style }: Props) => {
  const _onKeyPress = useCallback(
    nativeEvent => {
      // It does not work on Android (only iOS) https://github.com/facebook/react-native/issues/19507
      if (Platform.OS === 'ios') {
        if (!isNaN(nativeEvent.key)) {
          const newValue = time + nativeEvent.key;
          if (newValue.length === 3) {
            setTime(newValue.substring(1));
            return;
          }
          setTime(newValue);
        } else if (nativeEvent.key === 'Backspace') {
          return setTime(time.substring(0, time.length - 1));
        }
      }
    },
    [setTime, time]
  );

  const onSetTimeIOS = useCallback(
    ({ nativeEvent }) => {
      _onKeyPress(nativeEvent);
    },
    [_onKeyPress]
  );

  const onSetTimeAndroid = useCallback(
    value => {
      const parsedValue = value.replace(/[^0-9]/g, '');
      if (value.length === 3) {
        setTime(parsedValue.substring(1));
        return;
      }
      setTime(parsedValue);
    },
    [setTime]
  );

  return (
    <EditSetsInputControls
      label={label}
      input={time}
      containerStyle={style}
      keyboardType="number-pad"
      onKeyPress={Platform.OS === 'ios' ? onSetTimeIOS : null}
      onChangeText={onSetTimeAndroid}
      maxLength={2}
      testID="timeInput"
    />
  );
};

export default TimeInput;
