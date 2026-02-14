import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@/components/guards/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { ProjectAccessGuard } from '@/features/projects/components';
import AppLayout from '@/layouts/AppLayout';
import OrganizationManagement from '@/pages/admin/OrganizationManagement';
import ProcumentJobs from '@/pages/assign/AssignJobs';
import PageNotFound from '@/pages/auth/PageNotFound';
import DepartmentDashboard from '@/pages/dashboard/DepartmentDashboard';
import EmployeesDashboard from '@/pages/dashboard/EmployeesDashboard';
import OverallDashboard from '@/pages/dashboard/OverallDashboard';
import DocExportPage from '@/pages/projects/DocExport';
import FinanceExportPage from '@/pages/projects/FinanceExport';
import ProjectDetail from '@/pages/projects/ProjectDetail';
import ProjectImport from '@/pages/projects/ProjectImport';
import ProjectList from '@/pages/projects/ProjectList';
import MyToDoDashboard from '@/pages/user/MyToDoDashboard';
import PersonalKPI from '@/pages/user/PersonalKPI';
// App Pages
import VendorSubmission from '@/pages/vendor/VendorSubmission';

export const PrivateRoutes = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/app/home" element={<Home />} /> */}

        {/* === PROJECTS === */}
        <Route path="app/projects" element={<ProjectList />} />
        <Route path="app/exports/finance" element={<FinanceExportPage />} />
        <Route path="app/exports/registry" element={<FinanceExportPage />} />
        <Route path="app/exports/docs" element={<DocExportPage />} />

        <Route element={<ProjectAccessGuard />}>
          <Route path="app/projects/:id" element={<ProjectDetail />} />
        </Route>
        {/* === DASHBOARDS === */}
        <Route path="app/dashboards/department" element={<DepartmentDashboard />} />
        {/* <Route path="app/dashboards/indiv" element={<IndividualDashboardV2 />} /> */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'HEAD_OF_DEPARTMENT',
                'HEAD_OF_UNIT',
                'DOCUMENT_STAFF',
                'FINANCE_STAFF',
                'GENERAL_STAFF',
                'ADMIN',
              ]}
            />
          }
        >
          <Route path="app/dashboards/overview" element={<OverallDashboard />} />

          {/* === MY SPACE  === */}
          <Route path="app/me/dashboard" element={<MyToDoDashboard />} />
          <Route path="app/me/kpi" element={<PersonalKPI />} />

          {/* === OPERATIONAL WORKFLOWS === */}
          <Route path="app/assign/:id" element={<ProcumentJobs />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DOCUMENT_STAFF']} />}>
          <Route path="app/projects/import" element={<ProjectImport />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                'HEAD_OF_DEPARTMENT',
                'HEAD_OF_UNIT',
                'FINANCE_STAFF',
                'GENERAL_STAFF',
              ]}
            />
          }
        >
          <Route path="app/vendor-response" element={<VendorSubmission />} />
        </Route>

        {/* === MANAGEMENT (Head) === */}
        <Route element={<ProtectedRoute allowedRoles={['HEAD_OF_DEPARTMENT', 'HEAD_OF_UNIT']} />}>
          <Route path="app/management/employees/kpi" element={<EmployeesDashboard />} />
          <Route
            path="app/management/employees/:id/kpi"
            element={
              <PersonalKPI
                viewAsManager={user?.role === 'HEAD_OF_DEPARTMENT' || user?.role === 'HEAD_OF_UNIT'}
              />
            }
          />
        </Route>

        {/* === PROJECTS === */}
        <Route path="app/projects" element={<ProjectList />} />

        <Route element={<ProjectAccessGuard />}>
          <Route path="app/projects/:id" element={<ProjectDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="app/management/organization" element={<OrganizationManagement />} />
        </Route>

        {/* === FALLBACK === */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};
