import React from "react"; 
import AdminHeader from "./AdminHeader.jsx";

const AdminHeader = ({ children }) => {
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
};

export default AdminHeader;