import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/algemenelayout/Layout";
import StudentenLayout from "./components/layout/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./components/layout/bedrijvenlayout/BedrijvenLayout"
import AdminLayout from "./components/layout/adminlayout/AdminLayout";
import SeekerLayout from "./components/layout/seekerlayout/SeekerLayout"

import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import Register from "./pages/Algemeen/register/Register";
import Notfound from "./pages/Algemeen/NotFound";
import About from "./pages/Algemeen/About";
import Contact from "./pages/Algemeen/Contact";

import StudentDashboard from "./pages/Student/StudentenDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import BedrijvenDashboard from "./pages/Bedrijven/BedrijvenDashboard";

import AfsprakenModule from "./pages/Modules/AfsprakenModule";
import BedrijvenModule from "./pages/Modules/BedrijvenModule";
import StandenModule from "./pages/Modules/StandenModule";
import ProfielModule from "./pages/Modules/ProfielModule";

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>}/>
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          <Route path="/seeker" element={<SeekerLayout><SeekerDashboard /></SeekerLayout>} />
          <Route path="/student" element={<StudentenLayout><StudentDashboard /></StudentenLayout>} />
          <Route path="/student/bedrijven" element={<StudentenLayout><BedrijvenModule/></StudentenLayout>} />
          <Route path="/student/profiel" element={<StudentenLayout><ProfielModule/></StudentenLayout>} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/bedrijf" element={<BedrijvenLayout><BedrijvenDashboard /></BedrijvenLayout>} />
          <Route path="*" element={<Notfound />} />
        </Routes>
    </Router>
  );
}
