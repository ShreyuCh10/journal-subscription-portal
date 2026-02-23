import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

const StatCard = ({ title, value, color, icon }) => {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminHome = () => {
  return (
    <div className="space-y-6">

      {/* Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Users" value="1,245" color="bg-blue-500" icon="👥" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Journals" value="342" color="bg-purple-500" icon="📘" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Active Subscriptions" value="189" color="bg-green-500" icon="💳" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Revenue" value="₹45,000" color="bg-orange-500" icon="💰" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="rounded-2xl shadow-md h-72">
            <CardContent>
              <Typography className="font-semibold mb-2">Users Growth</Typography>
              <div className="h-56 flex items-center justify-center text-gray-400">
                📈 Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="rounded-2xl shadow-md h-72">
            <CardContent>
              <Typography className="font-semibold mb-2">Revenue Stats</Typography>
              <div className="h-56 flex items-center justify-center text-gray-400">
                📊 Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <CardContent>
              <Typography className="font-semibold mb-4">Recent Users</Typography>
              <TableContainer component={Paper} className="shadow-none">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">Name</TableCell>
                      <TableCell className="font-semibold">Email</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>Rohit</TableCell>
                      <TableCell>rohit@gmail.com</TableCell>
                      <TableCell className="text-green-600 font-medium">Active</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>Anjali</TableCell>
                      <TableCell>anjali@gmail.com</TableCell>
                      <TableCell className="text-green-600 font-medium">Active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="rounded-2xl shadow-md">
            <CardContent>
              <Typography className="font-semibold mb-4">Recent Payments</Typography>
              <TableContainer component={Paper} className="shadow-none">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">User</TableCell>
                      <TableCell className="font-semibold">Amount</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>Rohit</TableCell>
                      <TableCell>₹499</TableCell>
                      <TableCell className="text-green-600 font-medium">Success</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell>Anjali</TableCell>
                      <TableCell>₹999</TableCell>
                      <TableCell className="text-green-600 font-medium">Success</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>
  );
};

export default AdminHome;