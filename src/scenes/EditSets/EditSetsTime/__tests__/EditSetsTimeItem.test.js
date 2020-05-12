/* @flow */

import React from 'react';
import { render } from 'react-native-testing-library';

import EditSetsTimeItem from '../EditSetsTimeItem';

describe('EditSetsTimeItem', () => {
  it('compares set with placeholder for only seconds', () => {
    const { toJSON: secondsJSON } = render(<EditSetsTimeItem time={45} />);
    const { toJSON: minutesJSON } = render(<EditSetsTimeItem time={110} />);

    // $FlowFixMe
    expect(secondsJSON()).toMatchDiffSnapshot(minutesJSON(), {
      contextLines: 0,
      stablePatchmarks: true,
    });
  });
});
