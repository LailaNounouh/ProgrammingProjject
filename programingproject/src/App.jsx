import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProfileProvider } from "./context/ProfileContext";
 
import Layout from "./components/layout/algemenelayout/Layout";
import StudentenLayout from "./components/layout/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./components/layout/bedrijvenlayout/BedrijvenLayout";
import AdminLayout from "./components/layout/adminlayout/AdminLayout";
import SeekerLayout from "./components/layout/Seekerlayout/SeekerLayout";
 
 
import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import Register from "./pages/Algemeen/register/Register";
import Notfound from "./pages/Algemeen/NotFound";
import About from "./pages/Algemeen/About";
import Contact from "./pages/Algemeen/Contact";
 
import StudentDashboard from "./pages/Student/StudentenDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminBedrijf from "./pages/Admin/AdminBedrijf";
import AdminStanden from "./pages/Admin/AdminStanden";
import AdminGebruikers from "./pages/Admin/AdminGebruikers";
import AdminStatistiek from "./pages/Admin/AdminStatistiek";
import AdminSectoren from "./pages/Admin/AdminSectoren";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import BedrijvenDashboard from "./pages/Bedrijven/BedrijvenDashboard";
import StatusBetaling from './pages/Bedrijven/statusbetaling';
import AfspraakOverzicht from "./pages/Bedrijven/Afspraakoverzicht";
import Settingsbedrijf from "./pages/Bedrijven/Settingsbedrijf";
 
import AfsprakenModule from "./pages/Modules/AfsprakenModule";
import BedrijvenModule from "./pages/Modules/BedrijvenModule";
import StandenModule from "./pages/Modules/StandenModule";
import ProfielSettingsModule from "./pages/Modules/ProfielSettingsModule";
import ProfielModule from "./pages/Modules/ProfielModule";

import Attendance from "./pages/Admin/Aanwezigheid";

import CheckIn from "./pages/Algemeen/CheckIn";
 
 
export default function App() {
  return (
      <AuthProvider>
        <Routes>
          {/* Algemene pagina's */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="*" element={<Notfound />} />
 
          {/* Seeker */}
          <Route path="/werkzoekende" element={<SeekerLayout><SeekerDashboard /></SeekerLayout>} />
          <Route path="/werkzoekende/bedrijven" element={<SeekerLayout><BedrijvenModule /></SeekerLayout>} />
          <Route path="/werkzoekende/standen" element={<SeekerLayout><StandenModule /></SeekerLayout>} />
          <Route path="/werkzoekende/profiel" element={<SeekerLayout><ProfileProvider><ProfielModule /></ProfileProvider></SeekerLayout>} />

 
          {/* Student */}
          <Route path="/student" element={<StudentenLayout><StudentDashboard /></StudentenLayout>} />
          <Route path="/student/bedrijven" element={<StudentenLayout><BedrijvenModule /></StudentenLayout>} />
          <Route path="/student/instellingen" element={<StudentenLayout><ProfileProvider><ProfielSettingsModule /></ProfileProvider></StudentenLayout>} />
          <Route path="/student/profiel" element={<StudentenLayout><ProfileProvider><ProfielModule /></ProfileProvider></StudentenLayout>} />
          <Route path="/student/afspraken" element={<StudentenLayout><AfsprakenModule /></StudentenLayout>} />
          <Route path="/student/standen" element={<StudentenLayout><StandenModule /></StudentenLayout>} />
          {/* Admin */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/Bedrijf" element={<AdminLayout><AdminBedrijf /></AdminLayout>} />
          <Route path="/admin/standen" element={<AdminLayout><AdminStanden /></AdminLayout>} />
          <Route path="/admin/gebruikers" element={<AdminLayout><AdminGebruikers /></AdminLayout>} />
          <Route path="/admin/statistiek" element={<AdminLayout><AdminStatistiek /></AdminLayout>} />
          <Route path="/admin/sectoren" element={<AdminLayout><AdminSectoren /></AdminLayout>} />
  <Route path="/admin/attendance" element={<AdminLayout><Attendance /></AdminLayout>} />
 
          {/* Bedrijven */}
          <Route path="/bedrijf" element={<BedrijvenLayout><BedrijvenDashboard /></BedrijvenLayout>} />
          <Route path="/bedrijf/betaling" element={<BedrijvenLayout><StatusBetaling /></BedrijvenLayout>} />
          <Route path="/bedrijf/afspraken" element={<BedrijvenLayout><AfspraakOverzicht /></BedrijvenLayout>} />
          <Route path="/bedrijf/Settingsbedrijf" element={<BedrijvenLayout><Settingsbedrijf /></BedrijvenLayout>} />

          <Route path="/checkIn" element={<Layout><CheckIn /></Layout>} />
        </Routes>
      </AuthProvider>
  );
}
