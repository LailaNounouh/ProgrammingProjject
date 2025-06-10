import React from "react"; 
import BedrijvenHeader from "./BedrijvenHeader";

const BedrijvenLayout = ({ children }) => {
  return (
    <div>
      <BedrijvenHeader />
      <main>{children}</main>
    </div>
  );
};

export default BedrijvenLayout;
