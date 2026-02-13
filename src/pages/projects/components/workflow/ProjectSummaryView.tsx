import { Check, Download, FileText, Mail, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCard } from '@/components/ui/file-card';
import { formatDateThai } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { ProjectDetail, WorkflowStepConfig } from '@/types/project-detail';

interface ProjectSummaryViewProps {
  project: ProjectDetail;
  steps: WorkflowStepConfig[];
}

export function ProjectSummaryView({ project, steps }: ProjectSummaryViewProps) {
  const stepsWithDocs = steps
    .map((step) => {
      // Filter submissions by Step Order AND Step Name
      const submissions = project.submissions
        .filter((s) => s.step_order === step.order && s.step_name === step.name)
        .sort((a, b) => b.submission_round - a.submission_round);

      const approved = submissions.find((s: any) => ['APPROVED', 'ACCEPTED'].includes(s.status));
      const latest = submissions[0];
      const targetSubmission = approved || latest;

      const enrichedDocuments = (targetSubmission?.documents || []).map((doc: any) => {
        const docConfig = step.required_documents?.find((d: any) => d.field_key === doc.field_key);
        return {
          ...doc,
          label: docConfig?.label || doc.field_key,
          type: docConfig?.type || 'TEXT',
        };
      });

      return {
        ...step,
        documents: enrichedDocuments,
        status: targetSubmission?.status || 'PENDING',
      };
    })
    .filter((step: any) => step.documents.length > 0);

  const handleDownloadAll = () => {
    console.log('Downloading all files...');
  };

  const renderValue = (doc: any) => {
    if (!doc.value && !doc.file_path) return <span className="text-muted-foreground">-</span>;

    switch (doc.type) {
      case 'FILE':
        return (
          <FileCard file={doc.file_path || 'Unknown File'} disabled={true} className="max-w-xs" />
        );

      case 'DATE':
      case 'DATE_WITH_CHECKBOX':
        return <span>{formatDateThai(doc.value, 'd MMM yy')}</span>;

      case 'BOOLEAN':
        return doc.value ? (
          <span className="flex items-center gap-1 text-green-600">
            <Check className="h-4 w-4" /> ใช่
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-600">
            <X className="h-4 w-4" /> ไม่ใช่
          </span>
        );

      case 'VENDOR_EMAIL':
      case 'COMMITTEE_EMAIL':
        const emails = Array.isArray(doc.value) ? doc.value : [doc.value];
        return (
          <div className="flex flex-col gap-1">
            {emails.map((email: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5">
                <Mail className="text-muted-foreground h-3 w-3" /> {email}
              </span>
            ))}
          </div>
        );

      case 'GEN_CONT_NO':
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 font-mono font-normal text-yellow-700"
          >
            {doc.value}
          </Badge>
        );

      default:
        return <span>{doc.value}</span>;
    }
  };

  if (stepsWithDocs.length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/10 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
        <FileText className="mb-2 h-10 w-10 opacity-50" />
        <p>ยังไม่มีข้อมูลสรุป</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="h2-topic">สรุปข้อมูลเอกสารโครงการ</h2>
        <Button variant="outline" size="sm" onClick={handleDownloadAll}>
          <Download className="mr-2 h-4 w-4" />
          ดาวน์โหลดเอกสารทั้งหมด
        </Button>
      </div>

      {/* Summary List Container */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
        {stepsWithDocs.map((step: any, index: number) => (
          <div
            key={step.order}
            className={cn(
              'hover:bg-muted/5 p-6 transition-colors',
              index !== stepsWithDocs.length - 1 && 'border-b'
            )}
          >
            {/* Step Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {step.order}
                </div>
                <h3 className="h3-topic">{step.name}</h3>
              </div>

              {/* Simple Status Indicator */}
              {['APPROVED', 'ACCEPTED'].includes(step.status) && (
                <Badge variant="success">เสร็จสมบูรณ์</Badge>
              )}
            </div>

            {/* Document Data List (Compact Grid) */}
            <div className="ml-9 grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              {step.documents.map((doc: any, idx: number) => (
                <div key={`${step.order}-${idx}`} className="flex min-w-0 flex-col gap-1">
                  <span className="text-muted-foreground normal truncate tracking-wide uppercase">
                    {doc.label}
                  </span>
                  <div className="text-foreground warp-break-words normal">{renderValue(doc)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
