import React from "react"; 
import StudentenHeader from "./studentenheader";

const StudentenLayout = ({ children }) => {
  return (
    <div>
      <StudentenHeader />
      <main>{children}</main>
    </div>
  );
};

export default StudentenLayout;
