import React from 'react';
import Plattegrond from '../../components/plattegrond/plattegrond';

const StandenModule = () => {
  return (
    <div className="standen-module">
      <h2>Interactieve Kaart: Standen</h2>
      <div className="plattegrond-container">
        <Plattegrond bewerkModus={false} />
      </div>
    </div>
  );
};

export default StandenModule;
