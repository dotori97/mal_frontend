import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 로그인 함수
  const login = async ({ email, pw }) => {
    try {
      const resp = await axiosInstance.post("/api/auth/login", { email, pw });
      const { user, accessToken, refreshToken } = resp.data;
      setUser({ ...user, accessToken, refreshToken });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error) {
      console.error("Login error:", error);  // 에러 로그 추가
      throw error;  // 에러를 던져서 로그인 페이지에서 처리할 수 있도록
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 회원정보 수정
//   const updateUser = async (email, updatedData) => {
//     try {
//         const resp = await axiosInstance.put(`/user/${email}`, updatedData); 
//         setUser((prevUser) => ({ ...prevUser, ...updatedData }));
//         console.log('Update successful:', resp.data);
//     } catch (error) {
//         console.error('Error updating user:', error.response.data.message);
//     }
// };

  // 세션 복원 함수
  const restoreSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) return;

    try {
      const resp = await axiosInstance.post("/api/auth/validate", {
        token: accessToken,
      });
      if (resp.data.valid) {
        setUser({
          ...resp.data.user,
          accessToken,
          refreshToken,
          // totalword: resp.data.totalword,
          // zerocount: resp.data.zerocount,
        });
      }else{
        // throw Exception("");
      }
    } catch (error) {
      // 토큰이 유효하지 않으면 리프레시 시도
      try {
        const resp = await axiosInstance.post("/api/auth/refresh", {
          refreshToken,
        });
        const { accessToken: newAccessToken } = resp.data;
        setUser({
          user: resp.data.user,
          accessToken: newAccessToken,
          refreshToken,
          // totalword: resp.data.totalword,
          // zerocount: resp.data.zerocount,          
        });
        localStorage.setItem("accessToken", newAccessToken);
      } catch (refreshError) {
        console.error("Session restore failed:", refreshError);
        logout();
      }
    }
  };

  // 페이지 로드 시 세션 복원
  useEffect(() => {
    restoreSession();
  }, []);



  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
