

import { Splash } from "../pages/Splash";
import {BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import { StartlogIn } from "../pages/StartlogIn";
import {MemberDashboard} from "../pages/MemberDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";

export const AllRoutes = () =>  {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/start-login" />} />
          <Route path="/start-login" element={<StartlogIn/>} />
          <Route path="/dashboard/user/:id" element={<MemberDashboard/>} />
          <Route path="/dashboard/admin/:id" element={<AdminDashboard/>} />
          {/* <Route path="/assets/:id" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    );
}