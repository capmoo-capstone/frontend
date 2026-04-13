import { z } from 'zod';

import api from '@/lib/axios';

import type { WorkflowStepConfig } from '../types';
import { type Submission, SubmissionDocumentSchema } from '../types';

const WorkflowSubmissionBackendStatusSchema = z.enum([
  'WAITING_APPROVAL',
  'WAITING_PROPOSAL',
  'WAITING_SIGNATURE',
  'REJECTED',
  'COMPLETED',
  'SUBMITTED',
  'APPROVED',
  'ACCEPTED',
]);

const WorkflowSubmissionMetaSchema = z.union([
  z.record(z.string(), z.any()),
  z.array(
    z.object({
      field_key: z.string().optional(),
      value: z.union([z.string(), z.number(), z.boolean()]).optional(),
    })
  ),
]);

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
  documents: z.array(SubmissionDocumentSchema).default([]),
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
  value?: string;
};

export type CreateWorkflowSubmissionPayload = {
  project_id: string;
  workflow_type: string;
  step_order: number;
  require_approval: boolean;
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
    case 'COMPLETED':
    case 'APPROVED':
      return 'APPROVED';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'REJECTED':
    default:
      return 'REJECTED';
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

const getSubmissionActionBy = (submission: WorkflowSubmissionApiRecord) => {
  return submission.approved_by ?? submission.proposing_by ?? submission.completed_by ?? null;
};

const getSubmissionActionAt = (submission: WorkflowSubmissionApiRecord) => {
  return submission.approved_at ?? submission.proposing_at ?? submission.completed_at ?? null;
};

const toUiSubmission = (submission: WorkflowSubmissionApiRecord, stepName: string): Submission => {
  return {
    id: submission.id,
    project_id: submission.project_id,
    workflow_type: submission.workflow_type,
    step_name: stepName,
    step_order: submission.step_order,
    submission_round: submission.submission_round,
    status: mapBackendStatusToSubmissionStatus(submission.status),
    submitted_by: submission.submitted_by ?? 'ไม่ทราบชื่อ',
    submitted_at: submission.submitted_at ?? new Date().toISOString(),
    action_by: getSubmissionActionBy(submission),
    action_at: getSubmissionActionAt(submission),
    documents: submission.documents,
    meta_data: toMetaDataRecord(submission.meta_data),
    comments: submission.comment ?? undefined,
  };
};

export const normalizeWorkflowSubmissions = (
  submissions: WorkflowSubmissionApiRecord[],
  steps: WorkflowStepConfig[]
): Submission[] => {
  return submissions
    .map((submission) => {
      const stepName =
        submission.step_name ?? steps.find((step) => step.order === submission.step_order)?.name;
      if (!stepName) return null;
      return toUiSubmission(submission, stepName);
    })
    .filter((submission): submission is Submission => Boolean(submission));
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

  return data.data ?? data;
};

export const approveWorkflowStep = async (submissionId: string, requiredSignature = false) => {
  const { data } = await api.patch(`/submissions/${submissionId}/approve`, {
    required_signature: requiredSignature,
  });

  return data.data ?? data;
};

export const rejectWorkflowStep = async (submissionId: string, comment: string) => {
  const { data } = await api.patch(`/submissions/${submissionId}/reject`, {
    comment,
  });

  return data.data ?? data;
};

export const proposeWorkflowStep = async (submissionId: string) => {
  const { data } = await api.patch(`/submissions/${submissionId}/propose`);

  return data.data ?? data;
};

export const signAndCompleteWorkflowStep = async (submissionId: string) => {
  const { data } = await api.patch(`/submissions/${submissionId}/sign`);

  return data.data ?? data;
};

export type WorkflowSubmissionsResponse = WorkflowSubmissionGroup;
