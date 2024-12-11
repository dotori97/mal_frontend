import React from "react";
import TabMenu from "../components/TabMenu";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext.js";


const UserPage = () => {
    const { user } = useAuth();
    const Navigate = useNavigate();
    // console.log(user); // user 객체가 정상적으로 전달되었는지 확인

    const handleEditClick = () => {
        Navigate("/edit-profile");
    };

    return(        
        <div className="page-container">
            <TabMenu />              
        <Card   
            sx={{
                minWidth: 400,
                mx: "auto",
                mt: 5,
                boxShadow: 3,
                padding: 3,
                aspectRatio: "1/1",
            }}
        >
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom  sx={{ mb: 8 }}>
                    회원 정보
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1"  sx={{ mb: 2 }}>이메일: {user.email}</Typography>
                    <Typography variant="body1"  sx={{ mb: 2 }}>이름: {user.name}</Typography>
                    <Typography variant="body1"  sx={{ mb: 2 }}>성별: {user.gen==="1" ? "여성": "남성"}</Typography>
                    <Typography variant="body1"  sx={{ mb: 2 }}>생년월일: {user.b_date}</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex", 
                        justifyContent: "center", // 수평 가운데 정렬
                     }}
                >
                    <Button
                        onClick={handleEditClick}
                        sx={{
                            mt: 6,
                            backgroundColor: "#1976d2",
                            color:"#fff",
                            "&:hover":{
                              backgroundColor: "#1565c0",
                            },
                          }} 
                    >
                        수정하기    
                    </Button> 
                </Box>
            </CardContent>
        </Card>
        </div>
    );
};

export default UserPage;