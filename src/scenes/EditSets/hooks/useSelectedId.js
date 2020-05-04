/* @flow */

import { useCallback, useState } from 'react';
import useBackButton from '../../../hooks/useBackButton';

const useSelectedId = (selectedPage?: number) => {
  const [selectedId, setSelectedId] = useState<string>('');

  const onBackButton = useCallback(() => {
    setSelectedId('');
  }, []);
  const shouldTriggerBackButton = !!(selectedId && selectedPage === 0);
  useBackButton(shouldTriggerBackButton, onBackButton);

  return [selectedId, setSelectedId];
};

export default useSelectedId;
