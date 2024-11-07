

import { Splash } from "../pages/Splash";
import {BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import { StartlogIn } from "../pages/StartlogIn";
import { Dashboard } from "../pages/Dashboard";
export const AllRoutes = () =>  {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/start-login" />} />
          <Route path="/start-login" element={<StartlogIn/>} />
          <Route path="/dashboard/user/:id" element={<Dashboard/>} />
          <Route path="/dashboard/admin/:id" element={<Dashboard/>} />
          {/* <Route path="/assets/:id" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    );
}