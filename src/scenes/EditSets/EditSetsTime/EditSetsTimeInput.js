/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';

import i18n from '../../../utils/i18n';
import TimeInput from '../components/TimeInput';

type Props = {
  hours: string,
  setHours: (time: string) => void,
  minutes: string,
  setMinutes: (time: string) => void,
  seconds: string,
  setSeconds: (time: string) => void,
};

const EditSetsTimeInput = (props: Props) => {
  const { hours, setHours, minutes, setMinutes, seconds, setSeconds } = props;

  return (
    <>
      <TimeInput
        time={hours}
        setTime={setHours}
        label={i18n.t('hours_label')}
        style={styles.inputContainer}
      />
      <TimeInput
        time={minutes}
        setTime={setMinutes}
        label={i18n.t('minutes_label')}
        style={styles.inputContainer}
      />
      <TimeInput
        time={seconds}
        setTime={setSeconds}
        label={i18n.t('seconds_label')}
        style={styles.inputContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 0.3,
  },
});

export default EditSetsTimeInput;
