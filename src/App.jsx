import './App.css';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ResetPassword from "./pages/ResetPassword/ResetPassword";

//Admin Dashboard 
import AdminDashboard from './Pages/Dashboard/AdminDashboard/Dashboard';

//User Dashboard 
import UserDashboard from "./Pages/Dashboard/UserDashboard/Dashboard/Dashboard";
import UserSummary from "./Pages/Dashboard/UserDashboard/Dashboard/UserSummary";
import BrowseJournals from "./Pages/Dashboard/UserDashboard/BrowseJournals/BrowseJournals";
import Subscriptions from "./Pages/Dashboard/UserDashboard/Subscriptions/Subscriptions";
import Payments from "./Pages/Dashboard/UserDashboard/Payments/Payments";
import Profile from "./Pages/Dashboard/UserDashboard/Profile/Profile";
import Settings from "./Pages/Dashboard/UserDashboard/Settings/Settings";
import Support from "./Pages/Dashboard/UserDashboard/Support/Support";




const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <SignedIn>
          <AdminDashboard />
        </SignedIn>
        <SignedOut>
          <Login />
        </SignedOut>
      </>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
  path: "/reset-password",
  element: <ResetPassword />,
  },

  //Admin Dashboard Paths
  {
    path: '/Admindashboard',
    element: (
      <SignedIn>
        <AdminDashboard />
      </SignedIn>
    ),
  },

  // User Dashboard Paths - CORRECTED NESTED STRUCTURE
  {
    path: '/userdashboard',
    element: (
      <SignedIn>
        <UserDashboard />
      </SignedIn>
    ),
    children: [
      { 
        index: true, 
        element: <UserSummary /> 
      }, // This loads when URL is /userdashboard
      { 
        path: 'browse', 
        element: <BrowseJournals /> 
      }, // This loads when URL is /userdashboard/browse
      { 
        path: 'subscriptions', 
        element: <Subscriptions /> 
      },
      { 
        path: 'payments', 
        element: <Payments /> 
      },
      { 
        path: 'profile', 
        element: <Profile /> 
      },
      { 
        path: 'settings', 
        element: <Settings /> 
      },
      { 
        path: 'support', 
        element: <Support /> 
      },
    ],
  },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;