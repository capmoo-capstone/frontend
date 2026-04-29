import { z } from 'zod';

import api from '@/lib/axios';

import type { Submission, WorkflowStepConfig } from '../types';
import { WorkflowSubmissionBackendStatusSchema } from '../types';

const WorkflowSubmissionMetaSchema = z.union([
  z.record(z.string(), z.any()),
  z.array(
    z.object({
      field_key: z.string().optional(),
      value: z.union([z.string(), z.number(), z.boolean()]).optional(),
    })
  ),
]);

const WorkflowSubmissionDocumentSchema = z.object({
  id: z.string().optional(),
  submission_id: z.string().optional(),
  field_key: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_path: z.string().nullable().optional(),
  value: z
    .string()
    .optional()
    .or(z.number().optional())
    .or(z.boolean().optional())
    .or(z.array(z.string()).optional()),
});

const WorkflowSubmissionApiSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional(),
  workflow_type: z.string().optional(),
  step_name: z.string().optional(),
  step_order: z.number(),
  submission_round: z.number(),
  status: WorkflowSubmissionBackendStatusSchema,
  submitted_by: z.string().nullable().optional(),
  submitted_at: z.string().nullable().optional(),
  approved_by: z.string().nullable().optional(),
  approved_at: z.string().nullable().optional(),
  proposing_by: z.string().nullable().optional(),
  proposing_at: z.string().nullable().optional(),
  completed_by: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  documents: z.array(WorkflowSubmissionDocumentSchema).default([]),
  meta_data: WorkflowSubmissionMetaSchema.default({}),
});

const WorkflowSubmissionsResponseSchema = z.object({
  procurement: z.array(WorkflowSubmissionApiSchema),
  contract: z.array(WorkflowSubmissionApiSchema),
});

export type WorkflowSubmissionFileInput = {
  field_key: string;
  file_name: string;
  file_path: string;
};

export type WorkflowSubmissionMetaInput = {
  field_key?: string;
  value?: string | number | boolean;
};

export type CreateWorkflowSubmissionPayload = {
  project_id: string;
  workflow_type: string;
  step_order: number;
  required_approval: boolean;
  required_updating: boolean;
  meta_data?: WorkflowSubmissionMetaInput[];
  files?: WorkflowSubmissionFileInput[];
};

type WorkflowSubmissionApiRecord = z.infer<typeof WorkflowSubmissionApiSchema>;

type WorkflowSubmissionGroup = {
  procurement: WorkflowSubmissionApiRecord[];
  contract: WorkflowSubmissionApiRecord[];
};

const mapBackendStatusToSubmissionStatus = (
  status: WorkflowSubmissionApiRecord['status']
): Submission['status'] => {
  switch (status) {
    case 'WAITING_APPROVAL':
    case 'SUBMITTED':
      return 'SUBMITTED';
    case 'WAITING_PROPOSAL':
      return 'ACCEPTED';
    case 'WAITING_SIGNATURE':
    case 'APPROVED':
      return 'APPROVED';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'REJECTED':
      return 'REJECTED';
    default: {
      const _unreachable: never = status;
      return _unreachable;
    }
  }
};

const toMetaDataRecord = (metaData: WorkflowSubmissionApiRecord['meta_data']) => {
  if (Array.isArray(metaData)) {
    return metaData.reduce<Record<string, unknown>>((acc, item) => {
      if (item.field_key) {
        acc[item.field_key] = item.value ?? '';
      }
      return acc;
    }, {});
  }

  return metaData;
};

const toUiSubmission = (submission: WorkflowSubmissionApiRecord, stepName?: string): Submission => {
  const normalizedDocuments = submission.documents.map((document, index) => ({
    field_key: document.field_key ?? `__document_${index + 1}`,
    file_name: document.file_name ?? undefined,
    file_path: document.file_path ?? undefined,
    value: document.value,
  }));

  return {
    id: submission.id,
    project_id: submission.project_id,
    workflow_type: submission.workflow_type,
    backend_status: submission.status,
    step_name: stepName,
    step_order: submission.step_order,
    submission_round: submission.submission_round,
    status: mapBackendStatusToSubmissionStatus(submission.status),
    submitted_by: submission.submitted_by ?? null,
    submitted_at: submission.submitted_at ?? null,
    approved_by: submission.approved_by ?? null,
    approved_at: submission.approved_at ?? null,
    proposing_by: submission.proposing_by ?? null,
    proposing_at: submission.proposing_at ?? null,
    completed_by: submission.completed_by ?? null,
    completed_at: submission.completed_at ?? null,
    documents: normalizedDocuments,
    meta_data: toMetaDataRecord(submission.meta_data),
    comments: submission.comment ?? undefined,
  };
};

export const normalizeWorkflowSubmissions = (
  submissions: WorkflowSubmissionApiRecord[],
  steps: WorkflowStepConfig[]
): Submission[] => {
  return submissions.map((submission) => {
    const stepName =
      submission.step_name ?? steps.find((step) => step.order === submission.step_order)?.name;

    return toUiSubmission(submission, stepName);
  });
};

export const fetchWorkflowSubmissions = async (projectId: string) => {
  const { data } = await api.get(`/submissions/${projectId}`);
  return WorkflowSubmissionsResponseSchema.parse(data);
};

export const submitWorkflowStep = async (payload: CreateWorkflowSubmissionPayload) => {
  const { data } = await api.post('/submissions', {
    ...payload,
    type: 'STAFF',
  });

  return WorkflowSubmissionApiSchema.parse(data);
};

export const approveWorkflowStep = async (submissionId: string, required_signature = false) => {
  const { data } = await api.patch(`/submissions/${submissionId}/approve`, {
    required_signature,
  });

  return WorkflowSubmissionApiSchema.parse(data);
};

export const rejectWorkflowStep = async (submissionId: string, comment: string) => {
  const { data } = await api.patch(`/submissions/${submissionId}/reject`, {
    comment,
  });

  return WorkflowSubmissionApiSchema.parse(data);
};

export const proposeWorkflowStep = async (submissionId: string) => {
  const { data } = await api.patch(`/submissions/${submissionId}/propose`);

  return WorkflowSubmissionApiSchema.parse(data);
};

export const signAndCompleteWorkflowStep = async (
  submissionId: string,
  required_updating = false
) => {
  const { data } = await api.patch(`/submissions/${submissionId}/sign`, {
    required_updating,
  });

  return WorkflowSubmissionApiSchema.parse(data);
};

export type WorkflowSubmissionsResponse = WorkflowSubmissionGroup;
