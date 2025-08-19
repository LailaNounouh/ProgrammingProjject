import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProfileProvider } from "./context/ProfileContext";
import { WerkzoekendeProvider } from "./context/werkzoekendeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
 
import Layout from "./components/layout/algemenelayout/Layout";
import StudentenLayout from "./components/layout/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./components/layout/bedrijvenlayout/BedrijvenLayout";
import AdminLayout from "./components/layout/adminlayout/AdminLayout";
import SeekerLayout from "./components/layout/Seekerlayout/SeekerLayout";
 
 
import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import WachtwoordVergeten from "./pages/Algemeen/login/WachtwoordVergeten";
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
import Aanwezigheid from "./pages/Admin/Aanwezigheid";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import BedrijvenDashboard from "./pages/Bedrijven/BedrijvenDashboard";
import StatusBetaling from './pages/Bedrijven/statusbetaling';
import AfspraakOverzicht from "./pages/Bedrijven/Afspraakoverzicht";
import Settingsbedrijf from "./pages/Bedrijven/Settingsbedrijf";
import Standen from "./pages/Bedrijven/Standen";
import BedrijfDetail from './pages/Student/BedrijfDetail';
 
import AfsprakenModule from "./pages/Modules/AfsprakenModule";
import BedrijvenModule from "./pages/Modules/BedrijvenModule";
import StandenModule from "./pages/Modules/StandenModule";
import AccountModule from "./pages/Modules/AccountModule";
import WerkzoekendeModule from "./pages/Modules/werkzoekendeModule";
import Attendance from "./pages/Admin/Aanwezigheid";

import CheckIn from "./pages/Algemeen/CheckIn";
import WerkzoekendeAccountModule from "./pages/Modules/werkzoekendeModule";
 
 
export default function App() {
  return (
      <AuthProvider>
        <Routes>
          {/* Algemene pagina's */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/wachtwoord-vergeten" element={<Layout><WachtwoordVergeten /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="*" element={<Notfound />} />
 
          {/* Seeker - Protected Routes */}
          <Route path="/werkzoekende" element={
            <ProtectedRoute allowedRoles={['werkzoekende']}>
              <SeekerLayout><SeekerDashboard /></SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/werkzoekende/bedrijven" element={
            <ProtectedRoute allowedRoles={['werkzoekende']}>
              <SeekerLayout><BedrijvenModule /></SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/werkzoekende/standen" element={
            <ProtectedRoute allowedRoles={['werkzoekende']}>
              <SeekerLayout><StandenModule /></SeekerLayout>
            </ProtectedRoute>
          } />
          <Route path="/werkzoekende/account" element={
            <ProtectedRoute allowedRoles={['werkzoekende']}>
              <SeekerLayout><WerkzoekendeProvider><WerkzoekendeModule /></WerkzoekendeProvider></SeekerLayout>
            </ProtectedRoute>
          } />

 
          {/* Student - Protected Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><StudentDashboard /></StudentenLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/bedrijven" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><BedrijvenModule /></StudentenLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/account" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><ProfileProvider><AccountModule /></ProfileProvider></StudentenLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/afspraken" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><AfsprakenModule /></StudentenLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/standen" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><StandenModule /></StudentenLayout>
            </ProtectedRoute>
          } />
              <Route path="/student/bedrijven/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentenLayout><BedrijfDetail /></StudentenLayout>
            </ProtectedRoute>
          } />

          
          {/* Admin - Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/Bedrijf" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminBedrijf /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/standen" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminStanden /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/gebruikers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminGebruikers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/statistiek" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminStatistiek /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sectoren" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><AdminSectoren /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/aanwezigheid" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Aanwezigheid /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout><Attendance /></AdminLayout>
            </ProtectedRoute>
          } />
 
          {/* Bedrijven - Protected Routes */}
          <Route path="/bedrijf" element={
            <ProtectedRoute allowedRoles={['bedrijf']}>
              <BedrijvenLayout><BedrijvenDashboard /></BedrijvenLayout>
            </ProtectedRoute>
          } />
          <Route path="/bedrijf/betaling" element={
            <ProtectedRoute allowedRoles={['bedrijf']}>
              <BedrijvenLayout><StatusBetaling /></BedrijvenLayout>
            </ProtectedRoute>
          } />
          <Route path="/bedrijf/afspraken" element={
            <ProtectedRoute allowedRoles={['bedrijf']}>
              <BedrijvenLayout><AfspraakOverzicht /></BedrijvenLayout>
            </ProtectedRoute>
          } />
          <Route path="/bedrijf/Settingsbedrijf" element={
            <ProtectedRoute allowedRoles={['bedrijf']}>
              <BedrijvenLayout><Settingsbedrijf /></BedrijvenLayout>
            </ProtectedRoute>
          } />
          <Route path="/bedrijf/standen" element={
            <ProtectedRoute allowedRoles={['bedrijf']}>
              <BedrijvenLayout><Standen /></BedrijvenLayout>
            </ProtectedRoute>
          } />


          <Route path="/checkIn" element={<Layout><CheckIn /></Layout>} />
        </Routes>
      </AuthProvider>
  );
}
