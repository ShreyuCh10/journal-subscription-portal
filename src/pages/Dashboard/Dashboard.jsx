import React from "react";
import { replace, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

 const Dashboard = () =>{

  const {signOut} = useClerk();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to your Dashboard!</h1>
      <p>This page is visible only to signed-in users</p>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
}

export default Dashboard;

