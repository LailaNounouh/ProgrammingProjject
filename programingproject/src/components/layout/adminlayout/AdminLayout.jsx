import React from "react";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => (
  <div>
    <AdminHeader />
    <main>{children}</main>
  </div>
);

export default AdminLayout;