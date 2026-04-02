import { useState } from 'react';

export function useDelegationFormReset() {
  const [delegationFormResetKey, setDelegationFormResetKey] = useState(0);

  const bumpDelegationFormResetKey = () => {
    setDelegationFormResetKey((prev) => prev + 1);
  };

  return {
    delegationFormResetKey,
    bumpDelegationFormResetKey,
  };
}
