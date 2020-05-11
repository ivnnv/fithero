/* @flow */

// $FlowFixMe
const navigate = jest.fn();
// $FlowFixMe
const setParams = jest.fn();
// $FlowFixMe
const addListener = jest.fn(() => () => {});

export const useNavigation = () => ({
  navigate,
  setParams,
  addListener,
});

// $FlowFixMe
export const useFocusEffect = jest.fn();

// $FlowFixMe
export const useRoute = jest.fn();
