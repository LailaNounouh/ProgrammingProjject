import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/algemenelayout/Layout";
import StudentenLayout from "./components/studentenlayout/StudentenLayout";
import BedrijvenLayout from "./components/bedrijvenlayout/BedrijvenLayout"
import AdminLayout from "./components/adminlayout/AdminLayout"
//import SeekerLayout from "./components/seekerlayout/SeekerLayout"


import Home from "./pages/Algemeen/Home";
import Login from "./pages/Algemeen/login/Login";
import Register from "./pages/Algemeen/register/Register";
import Notfound from "./pages/Algemeen/NotFound";
import About from "./pages/Algemeen/About";
import Contact from "./pages/Algemeen/Contact";


import StudentDashboard from "./pages/Student/StudentenDashboard";
import Afspraken from "./pages/Student/AfsprakenModule";
import Standen from "./pages/Student/StandenModule";
import Bedrijven from "./pages/Student/BedrijvenModule";

// import BedrijfDashboard from "./pages/Bedrijven/BedrijvenDashboard";


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
          <Route path="/student/bedrijven" element={<StudentenLayout><Bedrijven /></StudentenLayout>} />
          <Route path="/student/standen" element={<StudentenLayout><Standen /></StudentenLayout>} />
          <Route path="/student/afspraak" element={<StudentenLayout><Afspraken /></StudentenLayout>} />

          <Route path="*" element={<Notfound />} />
        </Routes>
    </Router>
  );
}