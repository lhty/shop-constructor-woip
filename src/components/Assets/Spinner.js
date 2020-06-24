import React from "react";

import "./Spinner.css";

export default ({ stroke = 2, fill = "none", color = "" }) => {
  return (
    <svg className="spinner" viewBox="0 0 50 50">
      <circle
        style={{
          stroke: color,
        }}
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill={fill}
        strokeWidth={stroke}
      ></circle>
    </svg>
  );
};
