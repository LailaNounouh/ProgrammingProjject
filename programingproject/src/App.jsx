import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from './Auth/ProtectedRoute';

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

import StudentDashboard from "./pages/Student/StudentenDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import BedrijvenDashboard from "./pages/Bedrijven/BedrijvenDashboard";

import Afspraken from "./pages/Modules/AfsprakenModule";
import Bedrijven from "./pages/Modules/BedrijvenModule";
import Gebruikers from "./pages/Modules/GebruikersModule";
import Standen from "./pages/Modules/StandenModule";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        <Route
          path="/seeker"
          element={
            <ProtectedRoute role="seeker">
              <SeekerLayout><SeekerDashboard /></SeekerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentenLayout><StudentDashboard /></StudentenLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/afspraken"
          element={
            <ProtectedRoute role="student">
              <Afspraken />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/bedrijven"
          element={
            <ProtectedRoute role="student">
              <Bedrijven />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gebruikers"
          element={
            <ProtectedRoute role="admin">
              <Gebruikers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/standen"
          element={
            <ProtectedRoute role="admin">
              <Standen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/afspraken"
          element={
            <ProtectedRoute role="admin">
              <Afspraken />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bedrijf"
          element={
            <ProtectedRoute role="bedrijf">
              <BedrijvenLayout><BedrijvenDashboard /></BedrijvenLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </AuthProvider>
  );
}