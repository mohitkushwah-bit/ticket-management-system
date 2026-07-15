import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { WriterRoute } from './components/WriterRoute';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { LoadingSpinner } from './components/common';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

import './styles/global.css';

// Lazy-load non-critical route pages to reduce initial bundle size
const TicketListPage = lazy(() => import('./pages/TicketListPage').then(m => ({ default: m.TicketListPage })));
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage').then(m => ({ default: m.TicketDetailPage })));
const CreateTicketPage = lazy(() => import('./pages/CreateTicketPage').then(m => ({ default: m.CreateTicketPage })));
const EditTicketPage = lazy(() => import('./pages/EditTicketPage').then(m => ({ default: m.EditTicketPage })));
const KanbanPage = lazy(() => import('./pages/KanbanPage').then(m => ({ default: m.KanbanPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const UsersPage = lazy(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })));
const RolesPage = lazy(() => import('./pages/RolesPage').then(m => ({ default: m.RolesPage })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="tickets" element={ <Suspense fallback={<LoadingSpinner />}><TicketListPage /></Suspense>} />
              <Route path="tickets/new" element={ <Suspense fallback={<LoadingSpinner />}><WriterRoute><CreateTicketPage /></WriterRoute></Suspense>} />
              <Route path="tickets/:id/edit" element={ <Suspense fallback={<LoadingSpinner />}><WriterRoute><EditTicketPage /></WriterRoute></Suspense>} />
              <Route path="tickets/:id" element={ <Suspense fallback={<LoadingSpinner />}><TicketDetailPage /></Suspense>} />
              <Route path="kanban" element={ <Suspense fallback={<LoadingSpinner />}><KanbanPage /></Suspense>} />
              <Route path="profile" element={ <Suspense fallback={<LoadingSpinner />}><ProfilePage /></Suspense>} />
              <Route path="users" element={ <Suspense fallback={<LoadingSpinner />}><AdminRoute><UsersPage /></AdminRoute></Suspense>} />
              <Route path="roles" element={ <Suspense fallback={<LoadingSpinner />}><AdminRoute><RolesPage /></AdminRoute></Suspense>} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
