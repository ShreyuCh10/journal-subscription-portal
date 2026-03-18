import './App.css';
import { useAuth } from "@clerk/clerk-react";
import { setupInterceptors } from "./Service/api";
import {  useEffect } from "react"
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
import ManagePayments from "./pages/Dashboard/AdminDashboard/ManagePayments";
import ManageDispatch from "./pages/Dashboard/AdminDashboard/ManageDispatch";
import AdminReports from "./pages/Dashboard/AdminDashboard/AdminReports"
import AdminSettings from "./pages/Dashboard/AdminDashboard/AdminSettings"



import UserDashboard from "./pages/Dashboard/UserDashboard/Dashboard/Dashboard";
import UserSummary from "./pages/Dashboard/UserDashboard/Dashboard/UserSummary";
import BrowseJournals from "./pages/Dashboard/UserDashboard/BrowseJournals";
import MySubscriptions from "./pages/Dashboard/UserDashboard/MySubscriptions";
import Payments from "./pages/Dashboard/UserDashboard/Payments";
import Profile from "./pages/Dashboard/UserDashboard/Profile";
import Settings from "./pages/Dashboard/UserDashboard/Settings";

import JournalDetail from "./pages/Dashboard/UserDashboard/JournalDetail";
import Cart from "./pages/Dashboard/UserDashboard/Cart";
import Checkout from "./pages/Dashboard/UserDashboard/Checkout"
import Receipt from "./pages/Dashboard/UserDashboard/Receipt"
import TrackShipment from "./pages/Dashboard/UserDashboard/TrackShipment";



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
    { path: 'payments',element:<ManagePayments />},
    { path: "dispatch", element: <ManageDispatch /> },
    { path: "reports", element: <AdminReports /> },
    { path: "settings", element: <AdminSettings /> }

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
      { path: 'subscriptions', element: <MySubscriptions /> },
        { path: "cart", element: <Cart /> },
      { path: 'payments', element: <Payments /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },

      {path: "journals/:id",element: <JournalDetail />},
      {path:"checkout",element:<Checkout/>},
      {path:"receipt/:id", element:<Receipt />} ,
      { path: "shipments", element: <TrackShipment /> },

    ],
  },
]);
function App() {
     const { getToken } = useAuth();

       useEffect(() => {
          setupInterceptors(getToken);
        }, []);

  return <RouterProvider router={router} />;
}

export default App;