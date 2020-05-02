/* @flow */

import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// eslint-disable-next-line flowtype/no-weak-types
const useBackButton = (condition: boolean, callback: Function) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (condition) {
          callback();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [callback, condition])
  );
};

export default useBackButton;
