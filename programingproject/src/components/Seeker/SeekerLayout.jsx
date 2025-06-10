import React from "react"; 
import StudentenHeader from "./StudentenHeader";

const StudentenLayout = ({ children }) => {
  return (
    <div>
      <StudentenHeader />
      <main>{children}</main>
    </div>
  );
};

export default StudentenLayout;