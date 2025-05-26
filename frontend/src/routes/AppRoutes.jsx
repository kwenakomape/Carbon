

import { BrowserRouter, Routes, Route} from "react-router-dom";
import { MemberDashboard } from "../pages/MemberDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";
import { CreateAccount } from "../pages/CreateAccount";
import { LandingPage } from "../pages/LandingPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/dashboard/user/:id" element={<MemberDashboard />} />
        <Route path="/dashboard/admin/:id" element={<AdminDashboard />} />
        <Route path="/create-account" element={<CreateAccount />} />
        
      </Routes>
    </BrowserRouter>
  );
};