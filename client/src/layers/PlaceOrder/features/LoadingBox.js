import React from "react";

export default function LoadingBox(props) {
  return (
    <div className="container centro">
      <div className={`lds-ring-${props.variant || "small"}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
