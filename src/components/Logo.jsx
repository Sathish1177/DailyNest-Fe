import React from "react";
import { Link } from "react-router-dom";
import brandLogo from "../assets/logo/Dailynest Fresh Grocery Logo.png";

const Logo = ({ size = "md", to = "/", className = "" }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";

  // Height sizing tailored for crisp display
  const heightClass = isSm ? "h-8" : isLg ? "h-14 sm:h-16" : "h-10 sm:h-11";

  const content = (
    <div className={`inline-flex items-center cursor-pointer select-none transition-transform duration-200 hover:opacity-95 ${className}`}>
      <img
        src={brandLogo}
        alt="DailyNest Official Brand Logo"
        className={`${heightClass} w-auto object-contain shrink-0`}
      />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
