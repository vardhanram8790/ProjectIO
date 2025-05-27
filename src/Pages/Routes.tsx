import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Dashboard from "./Dashboard";
import Home from "./Home";
import DeviceMaster from "./DeviceMaster";
import UserMaster from "./UserMaster";
import DepartmentMaster from "./DepartmentMaster";
import DeviceCommand from "./DeviceCommand";
import ZoneMaster from "./ZoneMaster";
import LiveCount from "./LiveCount";
import VisitorPass from "./VisitorPass";
import VisitorHistory from "./VisitorHistory";
import VisitorPrintPass from "../Components/VisitorPrintPass";
import EmployeeLog from "./EmployeeLog";
import MasterMapping from "./MasterMapping";


export const Routers = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />, 
      children: [
        { path: "DeviceMaster", element: <DeviceMaster /> },
        { path: "UserMaster", element: <UserMaster /> },
        { path: "ZoneMaster", element: <ZoneMaster /> },
        { path: "DepartmentMaster", element: <DepartmentMaster /> },
        { path: "Dashboard", element: <Dashboard /> },
        { path: "DeviceCommand", element: <DeviceCommand /> },
        { path: "LiveCount", element: <LiveCount /> },
        { path: "VisitorPass", element: <VisitorPass /> },
        { path: "VisitorPrintPass", element: <VisitorPrintPass /> },
        { path: "VisitorHistory", element: <VisitorHistory /> },
        { path: "EmployeeLog", element: <EmployeeLog /> },
        { path: "MasterMapping", element: <MasterMapping /> },
        { path: "/", element: <Dashboard /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
