/* @flow */

import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
