import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Logout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 세션/토큰 초기화
    localStorage.removeItem("authToken"); // 예: 토큰 저장소에서 제거
    user(null); // Context에서 사용자 상태 초기화

    // Home 페이지로 리디렉션
    navigate("/");
  }, [user, navigate]);

  return null; // UI 없이 처리만 진행
}

export default Logout;
