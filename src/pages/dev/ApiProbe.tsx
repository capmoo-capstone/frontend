import { useMemo, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDepartments, useUnits } from '@/features/organization';

type ProbeMode = 'list' | 'detail';

export default function ApiProbe() {
  const [mode, setMode] = useState<ProbeMode>('list');
  const [departmentIdInput, setDepartmentIdInput] = useState('');
  const [activeDepartmentId, setActiveDepartmentId] = useState('');

  const listQuery = useDepartments();
  const detailQuery = useUnits(activeDepartmentId);

  const activeQuery = mode === 'list' ? listQuery : detailQuery;

  const previewData = useMemo(() => {
    if (mode === 'list' && Array.isArray(listQuery.data)) {
      return listQuery.data.slice(0, 5);
    }
    return activeQuery.data;
  }, [activeQuery.data, listQuery.data, mode]);

  const handleProbeDetail = () => {
    setActiveDepartmentId(departmentIdInput.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1-topic text-primary">API Probe (Temporary)</h1>
        <p className="caption text-muted-foreground mt-2">
          Use this page to test department API and hook logic before the final UI is ready.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Probe Controls</CardTitle>
          <CardDescription>Select the hook and trigger fetch requests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === 'list' ? 'default' : 'outline'}
              onClick={() => setMode('list')}
            >
              Probe Departments List
            </Button>
            <Button
              variant={mode === 'detail' ? 'default' : 'outline'}
              onClick={() => setMode('detail')}
            >
              Probe Units By Department
            </Button>
          </div>

          {mode === 'detail' && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={departmentIdInput}
                onChange={(event) => setDepartmentIdInput(event.target.value)}
                placeholder="Enter department ID"
              />
              <Button onClick={handleProbeDetail}>Fetch Units</Button>
            </div>
          )}

          <div className="text-muted-foreground text-sm">
            <p>
              Current query key target:{' '}
              {mode === 'list' ? 'departments' : `units/${activeDepartmentId || '-'}`}
            </p>
            <p>
              Status: {activeQuery.status} | Fetching: {activeQuery.isFetching ? 'yes' : 'no'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Probe Result</CardTitle>
          <CardDescription>
            Raw response preview to confirm request and payload shape.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeQuery.isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}

          {activeQuery.isError && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {(activeQuery.error as Error)?.message || 'Unknown error'}
            </div>
          )}

          {!activeQuery.isLoading && !activeQuery.isError && (
            <pre className="bg-muted max-h-105 overflow-auto rounded-md p-3 text-xs break-all whitespace-pre-wrap">
              {JSON.stringify(previewData ?? null, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
