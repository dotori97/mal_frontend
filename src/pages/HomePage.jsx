import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioRecorder from "../components/AudioRecorder";
import { useAuth } from "../context/AuthContext";
import { speechToText } from "../hooks/api";
import "./HomePage.css";
import { Button } from "@mui/material";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 

  const [word, setWord] = useState(""); // 상태 추가
  const [input_type, setInput_type] = useState(1);
  const [gptclick, setGptClick] = useState(0);

  const handleButtonClick = (type) => {
    if (type === "word") {
      console.log(`homepage.jsx 19line ${gptclick}`)
      navigate("/word", { state: { word, input_type, gptclick } }); // 입력 내용 전달
    } else if (!user) {
      navigate("/login");
    } else {
      navigate(`/${type}`);
    }
  };

  const handleAudioCatured = async (audioBlob) => {
    try {
      //1. stt
      const speechText = await speechToText(audioBlob);
      setWord(speechText);
      //2. gpt
      setInput_type(2);
      //handleButtonClick("word"); 
    } catch (error) {
      console.log("오류 발생:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터 동작(폼 제출 등)을 방지
      handleButtonClick("word");  
    }
  };

  // gptclick 값이 변경될 때 handleButtonClick 호출
  useEffect(() => {
    if (gptclick === 1) {
      handleButtonClick("word");
    }
  }, [gptclick]); // gptclick 상태를 의존성으로 설정
  
  return (
    <div className="homepage-container">
     <div className="input-group">      
        <input type="text" placeholder="Search..." className="search-box" 
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setInput_type(1);
          }}
          onKeyDown={handleKeyDown} // Enter 이벤트 핸들링
        />
        <AudioRecorder onAudioCaptured={handleAudioCatured}></AudioRecorder>
          <Button
            onClick={(e) => setGptClick(1)}
            variant="contained"
            sx={{ marginLeft: "10px" }}
          >
            chatGpt 조회
          </Button> 
        </div>
      <div className="button-group">
        <button onClick={() => handleButtonClick("word")}>말입력</button>
        <button onClick={() => handleButtonClick("challenge")}>암기</button>
        <button onClick={() => handleButtonClick("dictionary")}>사전</button>
      </div>
    </div>
  );
};

export default HomePage;
