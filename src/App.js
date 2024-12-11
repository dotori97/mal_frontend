import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { createTheme, ThemeProvider } from "@mui/material";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";

// import User from "./pages/UserPage"; 

import WordPage from "./pages/WordPage";
import Challenge from "./pages/Challenge";
import DictionaryPage from "./pages/DictionaryPage";
import User from "./pages/UserEditPage";

import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "inherit", // 기본 스타일 제거
          textTransform: "none", // 텍스트 대문자 변환 방지
        },
        contained: {
          backgroundColor: "rgb(202, 110, 99)",
        },
      },
    },
  },
});

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/logout" element={<LogoutPage />} /> 
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/dictionary" element={<DictionaryPage />} /> 
          <Route path="/word" element={<WordPage />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
