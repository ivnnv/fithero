/* @flow */

import React from 'react';
import { Keyboard } from 'react-native';
import { Provider } from 'react-redux';
import { fireEvent, render } from 'react-native-testing-library';
import { useRoute } from '@react-navigation/native';

import EditSetsWeightReps from '../index';
import { toDate } from '../../../../utils/date';
import {
  addSet,
  deleteSet,
  getLastSetByType,
  getMaxSetByType,
  updateSet,
} from '../../../../database/services/WorkoutSetService';
import { MockRealmArray } from '../../../../database/services/__tests__/helpers/databaseMocks';
import { createStore } from 'redux';
import { addExercise } from '../../../../database/services/WorkoutExerciseService';

jest.mock('react-native/Libraries/Components/Keyboard/Keyboard');
jest.mock('../../../../database/services/WorkoutSetService', () => ({
  addSet: jest.fn(),
  deleteSet: jest.fn(),
  getLastSetByType: jest.fn(() => []),
  updateSet: jest.fn(),
  getMaxSetByType: jest.fn(),
  getMaxRepByType: jest.fn(),
}));
jest.mock('../../../../database/services/WorkoutExerciseService', () => ({
  addExercise: jest.fn(),
}));
jest.mock('../../../../hooks/useKeyboard');
jest.mock('../../../../hooks/useMaxSetHook');

const date = toDate('2018-05-01T00:00:00.000Z');

describe('EditSetsWeightReps', () => {
  const day = '2018-05-01T00:00:00.000Z';
  const exerciseKey = 'bench-press';
  const exercise = {
    id: '20180501_bench-press',
    sets: [
      {
        id: '20180501_bench-press_001',
        reps: 8,
        weight: 80,
        date,
        type: 'bench-press',
      },
      {
        id: '20180501_bench-press_002',
        reps: 6,
        weight: 90,
        date,
        type: 'bench-press',
      },
    ],
    date,
    type: 'bench-press',
    sort: 0,
    weight_unit: 'metric',
    isValid: jest.fn(() => true),
  };

  const defaultWeight = 20;
  const defaultReps = 8;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const _render = (props, defaultUnitSystem = 'metric') => {
    useRoute.mockReturnValue({
      params: {
        day,
        exerciseKey,
      },
    });
    return render(
      <Provider
        store={createStore(() => ({
          settings: { defaultUnitSystem },
        }))}
      >
        <EditSetsWeightReps
          selectedPage={0}
          exercise={null}
          // $FlowIgnore
          {...props}
        />
      </Provider>
    );
  };

  describe('EditSetsInputControls', () => {
    it('has correct default values if there is no exercise', async () => {
      const { getByTestId } = _render();

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');
      const weightLabel = getByTestId('weightInputLabel');
      const repsLabel = getByTestId('repsInputLabel');

      expect(weightInput.props.value).toEqual(defaultWeight.toString());
      expect(repsInput.props.value).toEqual(defaultReps.toString());
      expect(weightLabel.props.children).toEqual('Weight (kgs)');
      expect(repsLabel.props.children).toEqual('Reps');
    });

    it('has the values of last set if we pass an exercise', () => {
      const { getByTestId } = _render({
        exercise: {
          weight_unit: 'metric',
          sort: 1,
          isValid: jest.fn(),
          ...exercise,
        },
      });

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      expect(weightInput.props.value).toEqual(
        exercise.sets[1].weight.toString()
      );
      expect(repsInput.props.value).toEqual(exercise.sets[1].reps.toString());
    });

    it('has values of last set (from another day) if no exercise', () => {
      const mockLastSet = {
        id: '2018-05-01T00:00:00.000Z_bench-press_002',
        reps: 6,
        weight: 90,
        date: toDate('2018-05-01T00:00:00.000Z'),
        type: 'bench-press',
      };

      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => [mockLastSet]);

      const { getByTestId } = _render();

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      expect(weightInput.props.value).toEqual(mockLastSet.weight.toString());
      expect(repsInput.props.value).toEqual(mockLastSet.reps.toString());
    });

    it('changes input(s) state using the TextInput', () => {
      const { getByTestId } = _render();

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      fireEvent.changeText(weightInput, '50');
      fireEvent.changeText(repsInput, '5');

      expect(weightInput.props.value).toEqual('50');
      expect(repsInput.props.value).toEqual('5');
    });

    it.skip('handles empty TextInput', () => {
      // TODO write test
    });

    it('uses -2, -1, +1, +2 buttons for reps', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const { getByTestId } = _render();

      const repsInput = getByTestId('repsInput');
      const repsInputControlLeft = getByTestId('repsInputControlLeft');
      const repsInputControlRight = getByTestId('repsInputControlRight');

      fireEvent.press(repsInputControlLeft);
      expect(repsInput.props.value).toEqual((defaultReps - 1).toString());
      fireEvent.press(repsInputControlRight);
      fireEvent.press(repsInputControlRight);
      expect(repsInput.props.value).toEqual(
        (defaultReps - 1 + 1 + 1).toString()
      );
    });

    it('uses -1.0, -0.5, +0.5, +1.0 buttons for weight', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const { getByTestId } = _render();

      const weightInput = getByTestId('weightInput');
      const weightInputControlLeft = getByTestId('weightInputControlLeft');
      const weightInputControlRight = getByTestId('weightInputControlRight');

      fireEvent.press(weightInputControlLeft);
      expect(weightInput.props.value).toEqual((defaultWeight - 1).toString());
      fireEvent.press(weightInputControlRight);
      fireEvent.press(weightInputControlRight);
      expect(weightInput.props.value).toEqual(
        (defaultWeight - 1 + 1 + 1).toString()
      );
    });
  });

  describe('EditSetActionButtons and back button', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('switches between Add and Update text if a set is selected', async () => {
      const { getByTestId } = _render({ exercise });
      expect(getByTestId('addSetButton').props.children).toBe('Add');
      fireEvent.press(getByTestId('editSetItem-1'));
      expect(getByTestId('addSetButton').props.children).toBe('Update');
    });

    it('switches Delete button to enabled/disabled depending on set selection', () => {
      const { getByTestId } = _render({ exercise });
      // Nothing selected
      expect(getByTestId('deleteSetButton').props.disabled).toBe(true);
      // Something selected means delete button is enabled
      fireEvent.press(getByTestId('editSetItem-1'));
      expect(getByTestId('deleteSetButton').props.disabled).toBe(false);
    });

    it('deletes a set and dismiss the keyboard', () => {
      const { getByTestId } = _render();

      expect(Keyboard.dismiss).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('deleteSetButton'));

      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(deleteSet).toHaveBeenCalledTimes(1);
    });
  });

  describe('Weight units', () => {
    // $FlowFixMe
    getMaxSetByType.mockImplementation(
      () => new MockRealmArray({ ...exercise.sets[0] })
    );

    it('renders kgs or lbs', () => {
      const { toJSON: metricJSON } = _render({ exercise });
      const { toJSON: imperialJSON } = _render({
        exercise: {
          ...exercise,
          weight_unit: 'imperial',
        },
      });

      // $FlowFixMe
      expect(metricJSON()).toMatchDiffSnapshot(imperialJSON(), {
        contextLines: 0,
        stablePatchmarks: true,
      });
    });
  });

  describe('onAddSet', () => {
    it('dismissed the keyboard when adding a set', () => {
      const { getByTestId } = _render();

      expect(Keyboard.dismiss).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('addSetButton'));

      expect(Keyboard.dismiss).toHaveBeenCalled();
    });

    const _addSet = getByTestId => {
      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      fireEvent.changeText(weightInput, '100');
      fireEvent.changeText(repsInput, '6');

      fireEvent.press(getByTestId('addSetButton'));
    };

    it('creates a new exercise with a new set if there is no exercise', () => {
      const { getByTestId } = _render();
      _addSet(getByTestId);
      fireEvent.press(getByTestId('addSetButton'));

      expect(addExercise).toHaveBeenCalledWith({
        id: '20180501_bench-press',
        date,
        category: 'weight_reps',
        sets: [
          {
            id: '20180501_bench-press_001',
            date,
            weight: 100,
            reps: 6,
            category: 'weight_reps',
            type: 'bench-press',
          },
        ],
        weight_unit: 'metric',
        type: 'bench-press',
      });
    });

    it('adds a set to an existing exercise', () => {
      const { getByTestId } = _render({ exercise });
      _addSet(getByTestId);
      fireEvent.press(getByTestId('addSetButton'));

      expect(addExercise).not.toHaveBeenCalled();
      expect(addSet).toHaveBeenCalledWith({
        id: '20180501_bench-press_003',
        date,
        weight: 100,
        reps: 6,
        category: 'weight_reps',
        type: 'bench-press',
      });
    });

    it('updates an existing set', async () => {
      const { getByTestId } = _render({ exercise });
      fireEvent.press(getByTestId('editSetItem-1'));
      _addSet(getByTestId);

      fireEvent.press(getByTestId('addSetButton'));

      expect(addExercise).not.toHaveBeenCalled();
      expect(addSet).not.toHaveBeenCalled();
      expect(updateSet).toHaveBeenCalledWith({
        id: exercise.sets[0].id,
        date,
        weight: 100,
        reps: 6,
        category: 'weight_reps',
        type: 'bench-press',
      });
    });
  });
});
