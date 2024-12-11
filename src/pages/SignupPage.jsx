import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  CardActions,
  CardHeader,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";


const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [gen, setGen] = useState(1); 
  const [b_date, setB_date] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { email, pw, name, gen, b_date });
    regist({ email, pw, name, gen, b_date }); //사용자 데이터를 서버로 전송하는 regist 함수 호출
    navigate("/login");
  };

  const regist = async (data) => {
    try {
      const resp = await axiosInstance.post("/api/auth/register", data);
      console.log(resp);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="user-container">
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        boxShadow: 3,
        padding: 3,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <CardHeader
          title={
            <Typography variant="h4" align="center" gutterBottom>
              회원가입
            </Typography>
          }
        />
        <CardContent>
          <TextField
            label="사용자명"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="이메일"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            sx={{ mb: 2 }}
            required
          />          
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel id="gender-label">성별</InputLabel>
            <Select
              labelId="gender-label"
              value={gen || ""}
              onChange={(e) => setGen(e.target.value)}
            >              
              <MenuItem value="2">여성</MenuItem>
              <MenuItem value="1">남성</MenuItem>
            </Select>
          </FormControl> 
          <TextField
            label="생년월일"
            type="date"
            fullWidth
            value={b_date || ""}
            onChange={(e) => setB_date(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            required
          />                  
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
           <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "rgb(202, 110, 99)", 
              color:"#fff",
            }}              
          >
            회원가입
          </Button>          
        </CardActions>
      </Box>
    </Card>
    </div>
  );
};

export default SignupPage;
