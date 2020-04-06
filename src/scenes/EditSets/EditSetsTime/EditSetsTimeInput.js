/* @flow */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import i18n from '../../../utils/i18n';
import TimeInput from '../components/TimeInput';

const EditSetsTimeInput = () => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

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
