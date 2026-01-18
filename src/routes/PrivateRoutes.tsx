import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/layouts/AppLayout';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import ProjectAccessGuard from '@/components/guards/ProjectAccessGuard';

// App Pages
import VendorSubmission from '@/pages/vendor/VendorSubmission';
import DepartmentDashboard from '@/pages/dashboard/DepartmentDashboard';
import OverallDashboard from '@/pages/dashboard/OverallDashboard';
import ContractJobs from '@/pages/dispatch/ContractJobs';
import ProcumentJobs from '@/pages/dispatch/ProcumentJobs';
import ProjectList from '@/pages/projects/ProjectList';
import ProjectImport from '@/pages/projects/ProjectImport';
import ProjectDetail from '@/pages/projects/ProjectDetail';
import MyDashboard from '@/pages/user/MyDashboard';
import PersonalKPI from '@/pages/user/PersonalKPI';
import OrganizationManagement from '@/pages/admin/OrganizationManagement';
import EmployeesDashboard from '@/pages/dashboard/EmployeesDashboard';
import PageNotFound from '@/pages/auth/PageNotFound';

export const PrivateRoutes = () => {
  const { user } = useAuth();

  const getHomeRedirect = () => {
    if (user?.role === 'unit') {
      return '/app/dashboards/department';
    }
    if (user?.role === 'head' || user?.role === 'admin') {
      return '/app/dashboards/overview';
    }
    return '/app/me/dashboard';
  };

  return (
    <AppLayout>
      <Routes>
        <Route
          path="app"
          element={<Navigate to={getHomeRedirect()} replace />}
        />

        {/* === DASHBOARDS === */}
        <Route element={<ProtectedRoute allowedRoles={['unit']} />}>
          <Route
            path="app/dashboards/department"
            element={<DepartmentDashboard />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['head', 'admin']} />}>
          <Route
            path="app/dashboards/overview"
            element={<OverallDashboard />}
          />
        </Route>

        {/* === MY SPACE  === */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'head']} />}>
          <Route path="app/me/dashboard" element={<MyDashboard />} />
          <Route path="app/me/kpi" element={<PersonalKPI />} />
        </Route>

        {/* === OPERATIONAL WORKFLOWS === */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'head']} />}>
          <Route path="app/dispatch/procurements" element={<ProcumentJobs />} />
          <Route path="app/dispatch/contracts" element={<ContractJobs />} />
          <Route path="app/vendors/submission" element={<VendorSubmission />} />
        </Route>

        {/* === PROJECTS === */}
        <Route element={<ProtectedRoute />}>
          <Route path="app/projects" element={<ProjectList />} />

          <Route element={<ProtectedRoute allowedRoles={['unit']} />}>
            <Route path="app/projects/import" element={<ProjectImport />} />
          </Route>

          <Route element={<ProjectAccessGuard />}>
            <Route path="app/projects/:id" element={<ProjectDetail />} />
          </Route>
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
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route
            path="app/management/organization"
            element={<OrganizationManagement />}
          />
        </Route>

        {/* === FALLBACK === */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};
