// Workflow submission and action APIs
// These would typically handle workflow step submissions, approvals, rejections, etc.
import type { Submission } from '../types';

// Example API functions - implement as needed
export async function submitWorkflowStep(
  _projectId: string,
  _stepOrder: number,
  _documents: Record<string, any>
): Promise<Submission> {
  // Implementation would go here
  throw new Error('Not implemented');
}

export async function approveWorkflowStep(
  _projectId: string,
  _submissionId: string,
  _comments?: string
): Promise<void> {
  // Implementation would go here
  throw new Error('Not implemented');
}

export async function rejectWorkflowStep(
  _projectId: string,
  _submissionId: string,
  _comments: string
): Promise<void> {
  // Implementation would go here
  throw new Error('Not implemented');
}
