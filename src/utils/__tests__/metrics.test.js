/* @flow */

import {
  durationInputStringToSeconds,
  secondsDurationToInputString,
} from '../metrics';

describe('metrics', () => {
  test('secondsDurationToInputString', () => {
    expect(secondsDurationToInputString(7465)).toEqual({
      hours: '2',
      minutes: '4',
      seconds: '25',
    });
    expect(secondsDurationToInputString(600)).toEqual({
      hours: '0',
      minutes: '10',
      seconds: '0',
    });
    expect(secondsDurationToInputString(59)).toEqual({
      hours: '0',
      minutes: '0',
      seconds: '59',
    });
    expect(secondsDurationToInputString(0)).toEqual({
      hours: '0',
      minutes: '0',
      seconds: '0',
    });
  });

  test('durationInputStringToSeconds', () => {
    expect(
      durationInputStringToSeconds({
        hours: '2',
        minutes: '4',
        seconds: '25',
      })
    ).toEqual(7465);
    expect(
      durationInputStringToSeconds({
        hours: '0',
        minutes: '10',
        seconds: '0',
      })
    ).toEqual(600);
    expect(
      durationInputStringToSeconds({
        hours: '0',
        minutes: '0',
        seconds: '59',
      })
    ).toEqual(59);
    expect(
      durationInputStringToSeconds({
        hours: '0',
        minutes: '0',
        seconds: '0',
      })
    ).toEqual(0);
  });
});
