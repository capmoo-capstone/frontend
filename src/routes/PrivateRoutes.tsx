import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PermissionGuard from '@/components/guards/PermissionGuard';
import { useAuth } from '@/context/AuthContext';
import { useProjectImportPermissions } from '@/features/project-import';
import AppLayout from '@/layouts/AppLayout';
import { hasSettingsPermission } from '@/lib/permissions';

// --- Lazy Load Pages ---
const Home = lazy(() => import('@/pages/home/Home'));
const PageNotFound = lazy(() => import('@/pages/auth/PageNotFound'));

// Dashboard
const OverallDashboard = lazy(() => import('@/pages/dashboard/OverallDashboard'));
const MyToDoDashboard = lazy(() => import('@/pages/user/MyToDoDashboard'));
const StaffKpi = lazy(() => import('@/pages/dashboard/StaffKpi'));

// Projects
const ProjectList = lazy(() => import('@/pages/projects/ProjectList'));
const ProjectDetail = lazy(() => import('@/pages/projects/ProjectDetail'));
const ProjectImport = lazy(() => import('@/pages/projects/ProjectImport'));
const ProjectImportSuccess = lazy(() => import('@/pages/projects/ProjectImportSuccess'));

// Budget Plan
const BudgetPlanImport = lazy(() => import('@/pages/projects/BudgetPlanImport'));

// Exports
const FinanceExportPage = lazy(() => import('@/pages/projects/FinanceExport'));

// Admin & Others
const OrganizationManagement = lazy(() => import('@/pages/admin/OrganizationManagement'));
const DepartmentRepsPage = lazy(() => import('@/pages/settings/DepartmentRepsPage'));
const WorkGroupsPage = lazy(() => import('@/pages/settings/WorkGroupsPage'));
const ProcurementStaffPage = lazy(() => import('@/pages/settings/ProcurementStaffPage'));
const ProcurementJobs = lazy(() => import('@/pages/assign/AssignJobs'));
const VendorSubmission = lazy(() => import('@/pages/vendor/VendorSubmission'));
const ApiProbe = lazy(() => import('@/pages/dev/ApiProbe'));
const VendorForm = lazy(() => import('@/pages/vendor/VendorForm'));

export const PrivateRoutes = () => {
  const { user } = useAuth();

  // permission checks
  const { canImportProject } = useProjectImportPermissions();
  const canManageSettings = user ? hasSettingsPermission(user) : false;

  return (
    <Routes>
      <Route
        path="*"
        element={
          <AppLayout>
            <Routes>
              {/* --- Redirect Root to Home --- */}
              <Route path="/" element={<Navigate to="/app/home" replace />} />
              {/* --- Main Entry Points --- */}
              <Route path="/app/home" element={<Home />} />
              <Route path="/app/dashboards/overview" element={<OverallDashboard />} />
              <Route path="/app/me/dashboard" element={<MyToDoDashboard />} />
              {/* --- Projects (The Unified View) --- */}
              <Route path="/app/projects" element={<ProjectList />} />
              <Route path="/app/projects/:id" element={<ProjectDetail />} />
              <Route
                element={
                  <PermissionGuard isAllowed={canImportProject} redirectPath="/app/projects" />
                }
              >
                <Route path="/app/project-import" element={<ProjectImport />} />
                <Route path="/app/project-import/success" element={<ProjectImportSuccess />} />
              </Route>
              {/* --- Exports --- */}
              <Route path="/app/exports/finance" element={<FinanceExportPage />} />
              {/* --- Specific Workflows --- */}
              <Route path="/app/assign" element={<ProcurementJobs />} />
              <Route path="/app/assign/:id" element={<ProcurementJobs />} />
              {/* --- Budget Plan --- */}
              <Route path="/app/budget-import" element={<BudgetPlanImport />} />z
              {/* --- Vendor Management --- */}
              <Route path="/app/vendor-response" element={<VendorSubmission />} />
              <Route path="/app/vendor-form" element={<VendorForm />} />
              <Route path="/vendor-form" element={<Navigate to="/app/vendor-form" replace />} />
              {/* --- Management / Admin --- */}
              <Route path="/app/management/employees/kpi" element={<StaffKpi />} />
              <Route path="/app/management/organization" element={<OrganizationManagement />} />
              <Route path="/app/dev/api-probe" element={<ApiProbe />} />
              <Route
                element={<PermissionGuard isAllowed={canManageSettings} redirectPath="/app/home" />}
              >
                <Route
                  path="/app/settings"
                  element={<Navigate to="/app/settings/work-groups" replace />}
                />
                <Route path="/app/settings/work-groups" element={<WorkGroupsPage />} />
                <Route path="/app/settings/department-reps" element={<DepartmentRepsPage />} />
                <Route path="/app/settings/procurement-staff" element={<ProcurementStaffPage />} />
              </Route>
              {/* --- Fallback --- */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
};
