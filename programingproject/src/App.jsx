import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import StudentenLayout from "./components/layout/StudentenLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notfound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

import StudentDashboard from "./pages/Student/StudentenDashboard";

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
          <Route path="*" element={<Notfound />} />
        </Routes>
    </Router>
  );
}