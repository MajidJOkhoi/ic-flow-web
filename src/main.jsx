import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./loyout/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";

// Admin routes

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";

// project routes
import ManageProject from "./pages/admin/manageproject/ManageProject";
import CreateProject from "./pages/admin/manageproject/CreateProject";

// team Routes
import ManageTeam from "./pages/admin/manageuser/ManageTeam";
import AddTeamLead from "./pages/admin/manageuser/AddTeamLead";
import EditUser from "./pages/admin/manageuser/EditUser";

// Attendence Routes
import ManageAttendance from "./pages/admin/manageattendece/ManageAttendence";
import AttendanceDetails from "./pages/admin/manageattendece/AttendenceDetails";
import AbsentUser from "./pages/admin/manageattendece/AbsentUser";
import PresentUser from "./pages/admin/manageattendece/PresentUser";
import ViewTodayAttendance from "./pages/admin/manageattendece/ViewTodayAttendance";
import EditAttendenceForm from "./pages/admin/manageattendece/EditAttendenceForm";
import AddTeamAttendance from "./pages/admin/manageattendece/AddTeamAttendance";

// Leave and Perfomance Routes
import ManageLeave from "./pages/admin/manageleave/ManageLeave";
import TimeOffDetails from "./pages/admin/manageleave/TimeOffDetails";
import CheckPerformance from "./pages/admin/manageperformance/CheckPerformance";

// edit admin profile

import EditMyProfile from "./pages/admin/manageuser/EditMyProfile";



// Team Lead Routes
import TeamLeadDashboard from "./pages/teamlead/TeamLeadDashboard";
import TeamLeadHome from "./pages/teamlead/TeamLeadHome";

// Manage Team Routes
import ManageMyTeam from "./pages/teamlead/manageteam/ManageMyTeam";
import AddTeamMember from "./pages/teamlead/manageteam/AddTeamMember";
import EditTeamMember from "./pages/teamlead/manageteam/EditTeamMember";

// Attendence Routes
import ManageTeamAttendance from "./pages/teamlead/teamattendance/ManageTeamAttendance";
import TeamAttendanceDetails from "./pages/teamlead/teamattendance/TeamAttendanceDetails";
import AbsentTeamMember from "./pages/teamlead/teamattendance/AbsentTeamMember";
import ViewTodayTeamAttendance from "./pages/teamlead/teamattendance/ViewTodayTeamAttendane";
import PresentTeamMember from "./pages/teamlead/teamattendance/PresentTeamMember";
import GetMyAttendance from "./pages/teamlead/teamattendance/GetMyAttendance";
import AddMyTeamAttendance from "./pages/teamlead/teamattendance/AddMyTeamAttendance";
import EditMyTeamAttendance from "./pages/teamlead/manageteam/EditTeamAttendance";


// edit own Profile 
import EditProfile from "./pages/teamlead/manageteam/EditProfile";



// Authentication Routes ....
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";


const router = createBrowserRouter([
  {
    path: "/dashboard/admin",
    element: <ProtectedRoute allowedRoles={[1]} />,
    children: [
      {
        path: "/dashboard/admin",
        element: <AdminDashboard />,
        children: [
          { index: true, element: <AdminHome /> },
          { path: "projects", element: <ManageProject /> },
          { path: "editmyprofile", element: <EditMyProfile /> },
          { path: "projects/create", element: <CreateProject /> },
          { path: "team", element: <ManageTeam /> },
          { path: "create/createteamlead", element: <AddTeamLead /> },
          { path: "team/edit/:id", element: <EditUser /> },
          { path: "leaves", element: <ManageLeave /> },
          { path: "managetimedetails/:id", element: <TimeOffDetails /> },
          { path: "attendance", element: <ManageAttendance /> },
          { path: "attendencedetails/:id", element: <AttendanceDetails /> },
          { path: "viewtodayattendence", element: <ViewTodayAttendance /> },
          { path: "absentusers", element: <AbsentUser /> },
          { path: "edit-attendance/:id", element: <EditAttendenceForm /> },
          { path: "addattendance/:id", element: <AddTeamAttendance /> },
          { path: "presentusers", element: <PresentUser /> },
          { path: "performance", element: <CheckPerformance /> },
        ],
      },
    ],
  },
  {
    path: "/dashboard/teamlead",
    element: <ProtectedRoute allowedRoles={[2]} />,
    children: [
      {
        path: "/dashboard/teamlead",
        element: <TeamLeadDashboard />,
        children: [
          { index: true, element: <TeamLeadHome /> },
          { path: "editprofile", element: <EditProfile /> },
          { path: "projects", element: <ManageProject /> },
          { path: "projects/create", element: <CreateProject /> },
          { path: "team", element: <ManageMyTeam /> },
          { path: "team/createteammember", element: <AddTeamMember /> },
          { path: "team/edit/:id", element: <EditTeamMember /> },
          { path: "attendance", element: <ManageTeamAttendance /> },
          { path: "addattendance/:id", element: <AddMyTeamAttendance  /> },
          {
            path: "teamattendencedetails/:id",
            element: <TeamAttendanceDetails />,
          },
          {
            path: "viewtodayteamattendence",
            element: <ViewTodayTeamAttendance />,
          },
          { path: "edit-team-attendance/:id", element: <EditMyTeamAttendance /> },
          { path: "absentmembers", element: <AbsentTeamMember /> },
          { path: "presentmembers", element: <PresentTeamMember /> },
          { path: "gettodayattendance", element: <GetMyAttendance /> },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
);
