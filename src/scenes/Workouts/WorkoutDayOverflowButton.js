/* @flow */

import React, { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import type { HeaderOverflowButtonProps } from '../../components/Header/HeaderOverflowButton';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import { toggleSnackbar } from '../../redux/modules/workoutDay';
import { handleWorkoutToolbarMenu } from '../../utils/overflowActions';
import { dateToWorkoutId } from '../../utils/date';

const WorkoutDayOverflowButton = (props: HeaderOverflowButtonProps) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const workoutId = dateToWorkoutId(route.params.day);

  const handleToolbarMenu = useCallback(
    (index: number) => {
      handleWorkoutToolbarMenu({
        index,
        selectedDay: workoutId,
        navigate,
        showSnackbar: () => dispatch(toggleSnackbar(true)),
      });
    },
    [dispatch, navigate, workoutId]
  );

  return <HeaderOverflowButton {...props} onPress={handleToolbarMenu} />;
};

export default WorkoutDayOverflowButton;
