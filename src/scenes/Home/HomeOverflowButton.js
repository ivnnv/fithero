/* @flow */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import type { HeaderOverflowButtonProps } from '../../components/Header/HeaderOverflowButton';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import { toggleSnackbar } from '../../redux/modules/home';
import { handleWorkoutToolbarMenu } from '../../utils/overflowActions';

const HomeOverflowButton = (props: HeaderOverflowButtonProps) => {
  const { navigate } = useNavigation();
  const selectedDay = useSelector(state => state.home.selectedDay);
  const dispatch = useDispatch();

  const handleToolbarMenu = useCallback(
    (index: number) =>
      handleWorkoutToolbarMenu({
        index,
        selectedDay,
        navigate,
        showSnackbar: () => dispatch(toggleSnackbar(true)),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDay]
  );

  return <HeaderOverflowButton {...props} onPress={handleToolbarMenu} />;
};

export default HomeOverflowButton;
