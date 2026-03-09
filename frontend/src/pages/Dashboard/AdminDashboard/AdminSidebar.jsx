import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  Dashboard,
  People,
  Subscriptions,
  MenuBook,
  CreditCard,
  LocalShipping,
  BarChart,
  Settings
} from "@mui/icons-material";

const AdminSidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
    { text: "Users", icon: <People />, path: "/admin-dashboard/users" },
    { text: "Subscriptions", icon: <Subscriptions />, path: "/admin-dashboard/subscriptions" },
    { text: "Payments", icon: <CreditCard />, path: "/admin-dashboard/payments" },
    { text: "Dispatch", icon: <LocalShipping />, path: "/admin-dashboard/dispatch" },
    { text: "Journals", icon: <MenuBook />, path: "/admin-dashboard/journals" },
    { text: "Reports", icon: <BarChart />, path: "/admin-dashboard/reports" },
    { text: "Settings", icon: <Settings />, path: "/admin-dashboard/settings" },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: 260,
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "background.paper",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 80,
          display: "flex",
          alignItems: "center",
          px: 3,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          sx={{ fontWeight: 600, letterSpacing: "-0.3px" }}
        >
          Journal Hub
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, py: 3 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

          {menuItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              end={item.path === "/admin-dashboard"}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.3,
                    transition: "all 0.2s ease",
                    backgroundColor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "#ffffff" : "text.primary",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "primary.main"
                        : "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 35,
                      color: isActive ? "#ffffff" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          ))}

        </List>
      </Box>
    </Box>
  );
};

export default AdminSidebar;