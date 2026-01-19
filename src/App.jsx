import './App.css';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import ResetPassword from "./pages/ResetPassword/ResetPassword";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <SignedIn>
          <Dashboard />
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
    path: '/dashboard',
    element: (
      <SignedIn>
        <Dashboard />
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