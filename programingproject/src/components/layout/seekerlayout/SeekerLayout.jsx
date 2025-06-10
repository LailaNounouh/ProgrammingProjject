import React from "react"; 
import SeekerHeader from "./SeekerHeader";

const SeekerLayout = ({ children }) => {
  return (
    <div>
      <SeekerHeader />
      <main>{children}</main>
    </div>
  );
};

export default SeekerLayout;