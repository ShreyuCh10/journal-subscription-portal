import './App.css';
import { useAuth } from "@clerk/clerk-react";
import { setupInterceptors } from "./Service/api";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages//Register';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from "./pages/ResetPassword";


import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import AdminHome from "./pages/Dashboard/AdminDashboard/AdminHome";
import ManageUsers from "./pages/Dashboard/AdminDashboard/ManageUsers";
import ManageJournals from "./pages/Dashboard/AdminDashboard/ManageJournals";
import ManageSubscription from "./pages/Dashboard/AdminDashboard/ManageSubscription";

import UserDashboard from "./pages/Dashboard/UserDashboard/Dashboard/Dashboard";
import UserSummary from "./pages/Dashboard/UserDashboard/Dashboard/UserSummary";
import BrowseJournals from "./pages/Dashboard/UserDashboard/BrowseJournals";
import Subscriptions from "./pages/Dashboard/UserDashboard/Subscriptions";
import Payments from "./pages/Dashboard/UserDashboard/Payments";
import Profile from "./pages/Dashboard/UserDashboard/Profile";
import Settings from "./pages/Dashboard/UserDashboard/Settings";
import Support from "./pages/Dashboard/UserDashboard/Support";
import JournalDetail from "./pages/Dashboard/UserDashboard/JournalDetail";

import ProtectedAdminRoute from "./Component/ProtectedAdminRoute";
import ProtectedUserRoute from "./Component/ProtectedUserRoute";
import RoleRedirect from "./Component/RoleRedirect";


const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleRedirect />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },

  {
    path: '/admin-dashboard',
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    ),
      children: [
          { index: true, element: <AdminHome /> },
    { path: 'users', element: <ManageUsers /> },
    { path: 'journals', element: <ManageJournals /> },
    { path: 'subscriptions', element: <ManageSubscription /> },
  ],
},

  {
    path: '/dashboard',
    element: (
      <ProtectedUserRoute>
        <UserDashboard />
      </ProtectedUserRoute>
    ),
    children: [
      { index: true, element: <UserSummary /> },
      { path: 'browse', element: <BrowseJournals /> },
      { path: 'subscriptions', element: <Subscriptions /> },
      { path: 'payments', element: <Payments /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'support', element: <Support /> },
      {path: "journals/:id",element: <JournalDetail />},

    ],
  },
]);
function App() {
     const { getToken } = useAuth();

      setupInterceptors(getToken);
  return <RouterProvider router={router} />;
}

export default App;