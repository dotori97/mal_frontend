import React from "react";
import { NavLink } from "react-router-dom";
import "./TabMenu.css";

const TabMenu = () => {
  return (
    <div className="tab-menu">
      <NavLink to="/word">말입력</NavLink>
      <NavLink to="/challenge">암기</NavLink>
      <NavLink to="/dictionary">사전</NavLink>
      <NavLink to="/user">회원정보</NavLink>
    </div>
  );
};

export default TabMenu;
