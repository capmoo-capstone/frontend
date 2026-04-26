import type { FieldErrors } from 'react-hook-form';

import type { WorkGroupFormInput } from '../../types';

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
