/* @flow */

import React from 'react';
import { render } from 'react-native-testing-library';
import { Provider } from 'react-native-paper';

import EditSetItem from '../EditSetItem';
import { toDate } from '../../../../utils/date';
import { defaultTheme } from '../../../../utils/theme';

describe('EditSetItem', () => {
  const _render = props =>
    render(
      <Provider theme={defaultTheme}>
        <EditSetItem
          isSelected={false}
          onPressItem={jest.fn()}
          index={1}
          set={{
            id: '2018-05-04T00:00:00.000Z_bench-press_001',
            reps: 7,
            weight: 70,
            date: toDate('2018-05-04T00:00:00.000Z'),
            type: 'bench-press',
          }}
          trophyColor={null}
          // $FlowFixMe
          {...props}
        />
      </Provider>
    );

  it('shows the set selected if is set is isSelected', () => {
    const { toJSON: toJSON } = _render();
    const { toJSON: toJSONSelected } = _render({ isSelected: true });

    // $FlowFixMe
    expect(toJSON()).toMatchDiffSnapshot(toJSONSelected(), {
      contextLines: 0,
      stablePatchmarks: true,
    });
  });

  it('shows a trophy if set is maxSetId', () => {
    const { toJSON: toJSON } = _render();
    const { toJSON: toJSONMax } = _render({ trophyColor: 'yellow' });

    // $FlowFixMe
    expect(toJSON()).toMatchDiffSnapshot(toJSONMax(), {
      contextLines: 0,
      stablePatchmarks: true,
    });
  });
});
