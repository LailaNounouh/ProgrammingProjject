import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/algemenelayout/Layout";
import StudentenLayout from "./components/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./componentts/bedrijvenlayout/BedrijvenLayout"

import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import Register from "./pages/Algemeen/register/Register";
import Notfound from "./pages/Algemeen/NotFound";
import About from "./pages/Algemeen/About";
import Contact from "./pages/Algemeen/Contact";

import StudentDashboard from "./pages/Student/StudentenDashboard";
import BedrijfDashboard from "./pages/Bedrijf/BedrijfDashboard";


export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>}/>
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />

          <Route path="/student" element={<StudentenLayout><StudentDashboard /></StudentenLayout>} />
          <Route path="/bedrijf" element={<BedrijvenLayout><BedrijfDashboard /></BedrijvenLayout>} />

          <Route path="*" element={<Notfound />} />
        </Routes>
    </Router>
  );
}