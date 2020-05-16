/* @flow */

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import ExerciseHistory from './ExerciseHistory';

const ExerciseHistoryAndroid = () => {
  const [showHistory, setShowHistory] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !showHistory) {
      // We just need this once, not when we re-focus
      setShowHistory(true);
    }
  }, [isFocused, showHistory]);

  if (!showHistory) return null;

  return <ExerciseHistory />;
};

export default ExerciseHistoryAndroid;
