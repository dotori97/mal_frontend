import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CardActions,
  Alert,
} from "@mui/material";


const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 에러 초기화
    try {
      await login({ email, pw });
      navigate("/"); // 로그인 성공 시 홈으로 이동
    } catch (err) {
      setError("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
      console.error("Login failed:", err);  // 에러 로그 추가
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 15,
        boxShadow: 3,
        padding: 3,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            로그인
          </Typography>

          {error && (   //조건이 true일 때만 결과를 렌더링하고, false일 때는 아무것도 렌더링하지 않음
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="이메일"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}  //입력 값이 변경될 때 상태를 업데이트하는 함수
            sx={{ mb: 1}}
            required  //필수 입력 필드로 지정
          />
          <TextField
            label="비밀번호"
            fullWidth
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            sx={{ mb: 1 }}
            required
          />
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              backgroundColor: "rgb(202, 110, 99)", 
              color:"#fff",
            }}          
          >
            로그인
          </Button>
          <Link to={"/signup"} style={{ textDecoration: "none" }}>
            <Typography variant="body2" color="primary">
              회원가입
            </Typography>
          </Link>
        </CardActions>
      </Box>
    </Card>
  );
};

export default SigninPage;
