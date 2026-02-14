import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from '@/layouts/AppLayout';

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

// Exports
const FinanceExportPage = lazy(() => import('@/pages/projects/FinanceExport'));
const RegistryExportPage = lazy(() => import('@/pages/projects/RegistryExport'));
const DocExportPage = lazy(() => import('@/pages/projects/DocExport'));

// Admin & Others
const OrganizationManagement = lazy(() => import('@/pages/admin/OrganizationManagement'));
const ProcumentJobs = lazy(() => import('@/pages/assign/AssignJobs'));
const VendorSubmission = lazy(() => import('@/pages/vendor/VendorSubmission'));

export const PrivateRoutes = () => {
  return (
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
        <Route path="/app/projects/import" element={<ProjectImport />} />

        {/* --- Exports --- */}
        <Route path="/app/exports/finance" element={<FinanceExportPage />} />
        <Route path="/app/exports/registry" element={<RegistryExportPage />} />
        <Route path="/app/exports/docs" element={<DocExportPage />} />

        {/* --- Specific Workflows --- */}
        <Route path="/app/assign/:id" element={<ProcumentJobs />} />
        <Route path="/app/vendor-response" element={<VendorSubmission />} />

        {/* --- Management / Admin --- */}
        <Route path="/app/management/employees/kpi" element={<StaffKpi />} />
        <Route path="/app/management/organization" element={<OrganizationManagement />} />

        {/* --- Fallback --- */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};
