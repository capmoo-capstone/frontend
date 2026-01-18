import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/guards/ProtectedRoute';

// App Pages
import VendorSubmission from '../pages/vendor/VendorSubmission';
import DepartmentDashboard from '../pages/dashboard/DepartmentDashboard';
import OverallDashboard from '../pages/dashboard/OverallDashboard';
import ContractJobs from '../pages/dispatch/ContractJobs';
import ProcumentJobs from '../pages/dispatch/ProcumentJobs';
import ProjectList from '../pages/projects/ProjectList';
import ProjectImport from '../pages/projects/ProjectImport';
import ProjectDetail from '../pages/projects/ProjectDetail';
import MyDashboard from '../pages/user/MyDashboard';
import PersonalKPI from '../pages/user/PersonalKPI';
import OrganizationManagement from '../pages/admin/OrganizationManagement';
import PageNotFound from '@/pages/auth/PageNotFound';
import EmployeesDashboard from '@/pages/dashboard/EmployeesDashboard';
import ProjectAccessGuard from '@/components/guards/ProjectAccessGuard';

export const PrivateRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route element={<ProtectedRoute />}>
          {/* === ROOT REDIRECT === */}
          <Route
            path="app"
            element={<Navigate to="/app/dashboards/department" replace />}
          />

          {/* === DASHBOARDS === */}
          <Route
            path="app/dashboards/department"
            element={<DepartmentDashboard />}
          />
          <Route
            path="app/dashboards/overview"
            element={<OverallDashboard />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* === MY SPACE  === */}
          <Route path="app/me/dashboard" element={<MyDashboard />} />
          <Route path="app/me/kpi" element={<PersonalKPI />} />
        </Route>

        {/* === MANAGEMENT (Head/Admin Views) === */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'head']} />}>
          <Route
            path="app/management/employees/kpi"
            element={<EmployeesDashboard />}
          />
          <Route
            path="app/management/employees/:id/kpi"
            element={<PersonalKPI viewAsManager={true} />}
          />
          <Route
            path="app/management/organization"
            element={<OrganizationManagement />}
          />
        </Route>

        {/* === OPERATIONAL WORKFLOWS === */}

        <Route element={<ProtectedRoute />}>
          {/* Dispatch & Jobs */}
          <Route path="app/dispatch/procurements" element={<ProcumentJobs />} />
          <Route path="app/dispatch/contracts" element={<ContractJobs />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* Vendor */}
          <Route path="app/vendors/submission" element={<VendorSubmission />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* === PROJECTS === */}
          <Route path="app/projects" element={<ProjectList />} />
          <Route path="app/projects/import" element={<ProjectImport />} />
          <Route element={<ProjectAccessGuard />}>
            <Route path="app/projects/:id" element={<ProjectDetail />} />
          </Route>
        </Route>

        {/* === FALLBACK === */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};
