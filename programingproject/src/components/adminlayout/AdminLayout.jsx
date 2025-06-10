import React from "react"; 
import AdminHeader from "./AdminHeader.jsx";

const AdminLayout = ({ children }) => { //De naam zou AdminLayout moeten zijn WANT DE FUNCTIE ZAL PROBEREN ZICHZELF TE GEBRUIKEN
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>   
    </div>
  );
};

export default AdminHeader;