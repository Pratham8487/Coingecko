import React from "react";

const Loader = () => {
  const loaderStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "inline-block",
    position: "relative",
    border: "10px solid",
    boxSizing: "border-box",
    animation: "animloader 1s linear infinite alternate",
    top: "50%",
    left: "50%",
  };

  return (
    <>
      <style>
        {`
          @keyframes animloader {
            0% {
              border-color: #ff6b6b transparent transparent transparent;
            }
            33% {
              border-color: #ff6b6b #feca57 transparent transparent;
            }
            66% {
              border-color: #ff6b6b #feca57 #1dd1a1 transparent;
            }
            100% {
              border-color: #ff6b6b #feca57 #1dd1a1 #54a0ff;
            }
          }
        `}
      </style>
      <span style={loaderStyle}></span>
    </>
  );
};

export default Loader;
