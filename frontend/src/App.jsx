import './App.css';
import { useAuth } from "@clerk/clerk-react";
import { setupInterceptors } from "./Service/api";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ResetPassword from "./pages/ResetPassword/ResetPassword";


import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import ManageUsers from "./pages/Dashboard/AdminDashboard/ManageUsers";
import ManageJournals from "./pages/Dashboard/AdminDashboard/ManageJournals";
import ManageSubscription from "./pages/Dashboard/AdminDashboard/ManageSubscription";

import UserDashboard from "./pages/Dashboard/UserDashboard/Dashboard/Dashboard";
import UserSummary from "./pages/Dashboard/UserDashboard/Dashboard/UserSummary";
import BrowseJournals from "./pages/Dashboard/UserDashboard/BrowseJournals/BrowseJournals";
import Subscriptions from "./pages/Dashboard/UserDashboard/Subscriptions/Subscriptions";
import Payments from "./pages/Dashboard/UserDashboard/Payments/Payments";
import Profile from "./pages/Dashboard/UserDashboard/Profile/Profile";
import Settings from "./pages/Dashboard/UserDashboard/Settings/Settings";
import Support from "./pages/Dashboard/UserDashboard/Support/Support";

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
    { path: 'users', element: <ManageUsers /> },
    { path: 'journals', element: <ManageJournals /> },
    { path: 'subscriptions', element: <ManageSubscription /> },
  ],
},

  {
    path: '/userdashboard',
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
    ],
  },
]);
function App() {
     const { getToken } = useAuth();

      setupInterceptors(getToken);
  return <RouterProvider router={router} />;
}

export default App;