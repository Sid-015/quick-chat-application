import React from "react";
import loaderSlice from "../redux/loaderSlice";

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
}

export default Loader;
