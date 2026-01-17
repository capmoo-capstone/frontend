import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';

// Auth Pages
import Login from './pages/auth/Login';
import PageNotFound from './pages/auth/PageNotFound';

// Vendor Pages
import VendorForm from './pages/vendor/VendorForm';
import VendorSubmission from './pages/vendor/VendorSubmission';

// App Pages
import DepartmentDashboard from './pages/dashboard/DepartmentDashboard';
import OverallDashboard from './pages/dashboard/OverallDashboard';
import ContractJobs from './pages/dispatch/ContractJobs';
import ProcumentJobs from './pages/dispatch/ProcumentJobs';
import ProjectList from './pages/projects/ProjectList';
import ProjectImport from './pages/projects/ProjectImport';
import ProjectDetail from './pages/projects/ProjectDetail';
import MyDashboard from './pages/user/MyDashboard';
import PersonalKPI from './pages/user/PersonalKPI';
import OrganizationManagement from './pages/admin/OrganizationManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Sidebar) */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/vendor/submission"
          element={
            <PublicLayout>
              <VendorSubmission />
            </PublicLayout>
          }
        />
        <Route
          path="/vendor/form"
          element={
            <PublicLayout>
              <VendorForm />
            </PublicLayout>
          }
        />

        {/* Protected Routes (With Sidebar) */}
        <Route
          path="/app"
          element={
            <AppLayout>
              <DepartmentDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/dashboard/department"
          element={
            <AppLayout>
              <DepartmentDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/dashboard/overall"
          element={
            <AppLayout>
              <OverallDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/user/dashboard"
          element={
            <AppLayout>
              <MyDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/user/kpi"
          element={
            <AppLayout>
              <PersonalKPI />
            </AppLayout>
          }
        />
        <Route
          path="/app/dispatch/procurement"
          element={
            <AppLayout>
              <ProcumentJobs />
            </AppLayout>
          }
        />
        <Route
          path="/app/dispatch/contract"
          element={
            <AppLayout>
              <ContractJobs />
            </AppLayout>
          }
        />
        <Route
          path="/app/projects"
          element={
            <AppLayout>
              <ProjectList />
            </AppLayout>
          }
        />
        <Route
          path="/app/projects/import"
          element={
            <AppLayout>
              <ProjectImport />
            </AppLayout>
          }
        />
        <Route
          path="/app/projects/:id"
          element={
            <AppLayout>
              <ProjectDetail />
            </AppLayout>
          }
        />
        <Route
          path="/app/admin/organization"
          element={
            <AppLayout>
              <OrganizationManagement />
            </AppLayout>
          }
        />

        {/* Redirect any unknown routes to 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <PageNotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
