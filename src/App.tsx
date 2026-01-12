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

// Vendor Pages
import VendorSubmission from './pages/vendor/VendorSubmission';

// App Pages
import Dashboard from './pages/dashboard/Dashboard';
import TodoList from './pages/tasks/TodoList';
import JobAssignment from './pages/dispatch/JobAssignment';
import ProjectList from './pages/projects/ProjectList';
import ProjectImport from './pages/projects/ProjectImport';
import ProjectDetail from './pages/projects/ProjectDetail';
import GroupManagement from './pages/admin/GroupManagement';
import UnitManagement from './pages/admin/UnitManagement';

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

        {/* Protected Routes (With Sidebar) */}
        <Route
          path="/app"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/app/tasks"
          element={
            <AppLayout>
              <TodoList />
            </AppLayout>
          }
        />
        <Route
          path="/app/dispatch"
          element={
            <AppLayout>
              <JobAssignment />
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
          path="/app/admin/groups"
          element={
            <AppLayout>
              <GroupManagement />
            </AppLayout>
          }
        />
        <Route
          path="/app/admin/units"
          element={
            <AppLayout>
              <UnitManagement />
            </AppLayout>
          }
        />

        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
