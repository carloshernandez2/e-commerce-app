import React from "react";

export default function MessageBox(props) {
  return (
    <div className={`alert alert-${props.variant || "info"}`}>
      {props.children}
      {props.close && (
        <div onClick={props.close} className="button">
          <i className="fa fa-window-close" aria-hidden="true"></i>
        </div>
      )}
    </div>
  );
}
