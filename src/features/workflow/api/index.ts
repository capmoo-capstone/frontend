// Workflow submission and action APIs
// These would typically handle workflow step submissions, approvals, rejections, etc.
import type { Submission } from '../types';

// Example API functions - implement as needed
export async function submitWorkflowStep(
  projectId: string,
  stepOrder: number,
  documents: Record<string, any>
): Promise<Submission> {
  // Implementation would go here
  throw new Error('Not implemented');
}

export async function approveWorkflowStep(
  projectId: string,
  submissionId: string,
  comments?: string
): Promise<void> {
  // Implementation would go here
  throw new Error('Not implemented');
}

export async function rejectWorkflowStep(
  projectId: string,
  submissionId: string,
  comments: string
): Promise<void> {
  // Implementation would go here
  throw new Error('Not implemented');
}
