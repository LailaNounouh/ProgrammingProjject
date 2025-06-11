import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/algemenelayout/Layout";
import StudentenLayout from "./components/layout/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./components/layout/bedrijvenlayout/BedrijvenLayout";
import AdminLayout from "./components/layout/adminlayout/AdminLayout";
import SeekerLayout from "./components/layout/seekerlayout/SeekerLayout";

import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import Register from "./pages/Algemeen/register/Register";
import Notfound from "./pages/Algemeen/NotFound";
import About from "./pages/Algemeen/About";
import Contact from "./pages/Algemeen/Contact";

import Afspraken from "./pages/Modules/AfsprakenModule";
import Standen from "./pages/Modules/StandenModule";
import Bedrijven from "./pages/Modules/BedrijvenModule";
import Gebruikers from "./pages/Modules/GebruikersModule";

import StudentDashboard from "./pages/Student/StudentenDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import BedrijvenDashboard from "./pages/Bedrijven/BedrijvenDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

export default function App() {
  const [bedrijf, setBedrijf] = useState(null);

  useEffect(() => {
    // Bedrijf ophalen uit localStorage (aangenomen JSON string)
    const opgeslagenBedrijf = localStorage.getItem("bedrijf");
    if (opgeslagenBedrijf) {
      try {
        setBedrijf(JSON.parse(opgeslagenBedrijf));
      } catch {
        setBedrijf(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        <Route path="/student" element={<StudentenLayout><StudentDashboard /></StudentenLayout>} />
        <Route path="/student/bedrijven" element={<StudentenLayout><Bedrijven /></StudentenLayout>} />
        <Route path="/student/standen" element={<StudentenLayout><Standen /></StudentenLayout>} />
        <Route path="/student/afspraak" element={<StudentenLayout><Afspraken /></StudentenLayout>} />

        <Route
          path="/bedrijf"
          element={
            <BedrijvenLayout>
              <BedrijvenDashboard bedrijf={bedrijf} />
            </BedrijvenLayout>
          }
        />

        <Route path="/seeker" element={<SeekerLayout><SeekerDashboard /></SeekerLayout>} />
        <Route path="/bedrijven" element={<SeekerLayout><Bedrijven /></SeekerLayout>} />
        <Route path="/standen" element={<SeekerLayout><Standen /></SeekerLayout>} />

        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/gebruikers" element={<AdminLayout><Gebruikers /></AdminLayout>} />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}
