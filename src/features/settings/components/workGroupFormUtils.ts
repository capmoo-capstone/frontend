import type { FieldErrors } from 'react-hook-form';

import type { DelegationPayload, WorkGroupFormInput } from '@/features/settings/types';

export const normalizeDelegation = (
  delegation: WorkGroupFormInput['delegation']
): DelegationPayload | null => {
  if (!delegation) return null;

  return {
    ...delegation,
    is_permanent: delegation.is_permanent ?? false,
  };
};

export const getFormErrorMessages = (errors: FieldErrors<WorkGroupFormInput>) => {
  const messages = new Set<string>();

  const collectMessages = (value: unknown) => {
    if (!value || typeof value !== 'object') return;

    if ('message' in value && typeof value.message === 'string') {
      messages.add(value.message);
    }

    Object.values(value).forEach(collectMessages);
  };

  collectMessages(errors);

  return Array.from(messages);
};
