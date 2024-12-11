import React, { useState, useEffect } from "react";
import TabMenu from "../components/TabMenu"; 
import Category from "../components/Category";
import ChallengeViewer from "../components/ChallengeViewer";
import axiosInstance from "../utils/axiosInstance";
import "./Challenge.css"
import { Button } from "@mui/material";

const Challenge = () => {
  const [c_id, setCategoryId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [dictionarys, setDictionarys] = useState([]);
  const [isComplete, setIsComplete] = useState(false); // 완료 상태 추가

  const handleFetchData = async () => {
    // console.log(`challenge.jsx 14line c_id:${c_id}, limit:${limit}`)
    if (!c_id || limit <= 0) {
      alert("카테고리를 선택하고 올바른 숫자를 입력하세요.");
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/level/category?c_id=${c_id}&limit=${limit}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch data');
      }  
      const data = response.data.data;  // Axios는 `data`에 응답 본문이 포함됨

      // console.log(`challenge.jsx 27line ${data}`)
       
      const shuffledDictionarys = data.sort(() => Math.random() - 0.5); // 데이터 랜덤 섞기
    
      setDictionarys(shuffledDictionarys);
      setIsComplete(false); // 조회 시 완료 상태 초기화
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  // 카테고리 변경 시 완료 상태 초기화
  useEffect(() => {
    setIsComplete(false);
  }, [c_id]);
  
  return (
    //<div className="page-container">
    <div>
      <TabMenu />
      <div className="search-container"> 
  <Category onSelect={setCategoryId} />
  <div className="number-input-container">
    <input 
      type="text"
      min="1"
      placeholder="숫자 입력"
      value={limit}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
          setLimit(inputValue);
        }
      }}
      onBlur={(e) => {
        if (!/^\d+$/.test(e.target.value)) {
          alert("숫자만 입력 가능합니다.");
          setLimit("");
        }
      }}
    /> 
    <Button 
    variant="contained"
    sx={{ marginLeft: "10px" }}
    onClick={handleFetchData}>조회</Button>
  </div>
</div>
<div className="page-content">
        {isComplete ? (
          <p>모든 카드를 완료했습니다!</p> // 완료 메시지 표시
        ) : (
          <ChallengeViewer
            dictionarys={dictionarys}
            onComplete={() => setIsComplete(true)} // 완료 핸들러 전달
          />
        )}
      </div>
    </div>
  );
};

export default Challenge;