import React from "react";
import { GridLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="loading">
      <GridLoader color="lightgreen" size={20} />
    </div>
  );
};

export default Loader;
