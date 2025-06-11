import React from "react"; 
import AdminHeader from "./AdminHeader.jsx";

const AdminLayout = ({ children }) => { 
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>   
    </div>
  );
};

export default AdminLayout;
