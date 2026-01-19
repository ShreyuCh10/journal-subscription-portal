import './App.css';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AdminDashboard from './Pages/Dashboard/AdminDashboard/Dashboard';
import UserDashboard from './Pages/Dashboard/UserDashboard/Dashboard';




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
  {
    path: '/Admindashboard',
    element: (
      <SignedIn>
        <AdminDashboard />
      </SignedIn>
    ),
  },

  {
    path: '/userdashboard',
    element: (
      <SignedIn>
        <UserDashboard />
      </SignedIn>
    ),
  },

]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;