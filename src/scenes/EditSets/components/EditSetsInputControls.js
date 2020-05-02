/* @flow */

import React, { useCallback } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { Caption, IconButton, useTheme } from 'react-native-paper';
import type {
  TextStyleProp,
  ViewStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

import type { ThemeType } from '../../../utils/theme/withTheme';

type Props = {
  controls?: Array<{
    icon: 'minus' | 'plus',
    action: (property: string, value: number) => void,
  }>,
  value: string,
  label: string,
  onChangeText: (value: string) => void,
  containerStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  testID: string,
};

const increaseButtonSize = Platform.OS === 'ios' ? 36 : 28;

const EditSetsInputControls = (props: Props) => {
  const {
    controls,
    value,
    label,
    onChangeText,
    containerStyle,
    labelStyle,
    testID,
    ...rest
  } = props;

  const theme: ThemeType = useTheme();

  const renderInput = useCallback(
    (control, testID) => (
      <IconButton
        icon={control.icon}
        size={20}
        style={styles.increaseButton}
        onPress={control.action}
        testID={testID}
      />
    ),
    []
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Caption testID={`${testID}Label`} style={[styles.lineTitle, labelStyle]}>
        {label}
      </Caption>
      <View style={styles.lineInput}>
        {controls && renderInput(controls[0], `${testID}ControlLeft`)}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          selectionColor={theme.colors.textSelection}
          style={[
            {
              color: theme.colors.text,
            },
            styles.textInput,
          ]}
          placeholderTextColor={theme.colors.placeholder}
          returnKeyType="done"
          testID={testID}
          {...rest}
        />
        {controls && renderInput(controls[1], `${testID}ControlRight`)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 2,
  },
  lineTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  lineInput: {
    marginTop: 20,
    flexDirection: 'row',
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
  },
  increaseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: increaseButtonSize,
    width: increaseButtonSize,
  },
});

export default EditSetsInputControls;
