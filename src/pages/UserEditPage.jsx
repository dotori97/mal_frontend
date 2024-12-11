import React, {useState, useEffect} from "react";
import TabMenu from "../components/TabMenu";
import "./UserEditPage.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
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
  import { useAuth } from "../context/AuthContext";


const UserEdit = () => {
    const { user } = useAuth(); // AuthContext에서 사용자 정보와 업데이트 함수 가져오기
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState("");
    const [gen, setGen] = useState(2);
    const [b_date, setB_date] = useState("");
    const navigate = useNavigate();

    // 사용자 정보 불러오기
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get("/api/user"); // 사용자 정보 가져오기
          
          const userData = response.data.data;
          // console.log("userEditPage.jsx 37line:", userData.b_date); // 가져온 데이터 확인
          setEmail(userData.email);
          setName(userData.name);
          setGen(userData.gen);
          if (userData.b_date !== null) {
            setB_date(new Date(userData.b_date).toISOString().split("T")[0]);
          } else {
            setB_date(userData.b_date);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          alert("사용자 정보를 불러오지 못했습니다.");
        }
      };
  
      fetchUserData();
    }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Updated Data:", {name, gen, b_date});
  //   updateUser(email, {name, gen, b_date});
  //   alert("성공적으로 수정되었습니다.")
  //   navigate("/user");
  // }  

   // 사용자 정보 업데이트
   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { name, gen, b_date };
      console.log("Updating User Data:", updatedData);

      await axiosInstance.put("/api/user", updatedData); // 사용자 정보 업데이트
      alert("성공적으로 수정되었습니다.");
      navigate("/user");
    } catch (error) {
      console.error("Failed to update user data:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  return (
    <div>
            <TabMenu />      
    <div className="useredit-container">        
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
          title = {
            <Typography variant="h4" align = "center" gutterBottom>
              회원 정보
            </Typography>  
          }
        />
        <CardContent>
          <TextField 
          label = "이메일"
          fullWidth
          value = {email}
          disabled // 이메일 수정 불가
          sx = {{ mb: 2 }}
          />
          <TextField
          label = "사용자명"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb:2 }}
          required 
          />
          <FormControl fullWidth sx={{ mb:2 }} required>
            <InputLabel id = "gender-label">성별</InputLabel>
            <Select
            labelId="gender-label"
            value={gen || ""}
            onChange={(e)=>setGen(e.target.value)}
            >
              <MenuItem value="2">여성</MenuItem>
              <MenuItem value="1">남성</MenuItem>
            </Select>
          </FormControl>
          <TextField   //dateField 찾아볼 것 
          label="생년월일"
          type="date"
          fullWidth
          value={b_date}
          onChange={(e)=>setB_date(e.target.value)}
          InputLabelProps={{shrink:true}}
          sx={{ mb:2 }}
          required
          />
        </CardContent>  
        <CardActions sx={{justifyContent: "center"}}>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: "rgb(202, 110, 99)",
              color:"#fff",
            }}
          >
            수정하기
          </Button>
        </CardActions>
      </Box>    
    </Card>    
  </div>  
  </div>  
  );
};

export default UserEdit;