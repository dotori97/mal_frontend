import { useState, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import { useWord } from "../hooks/useWord";
import { speechToText, getGptResponse } from "../hooks/api";
import { useAuth } from "../context/AuthContext";
import Category from "../components/Category";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Button,
  Stack,
  TextField,
  Grid2 as Grid,
  Select,
  MenuItem,
} from "@mui/material";

const Word = () => {
  const location = useLocation();
  const searchText = location.state?.word || "말모이"; // 전달받은 값 
  const getInputType = location.state?.input_type; // 전달받은 값
  const getGptClick = location.state?.gptclick; // 전달받은 값

  const [word, setWord] = useState(searchText);
  const [des, setDes] = useState("");
  const [c_id, setC_id] = useState(null);
  const [memo, setMemo] = useState("");
  const [input_type, setInput_type] = useState(() => getInputType ?? 1);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { handlefetchWord, handleAddWord, handleinitButton } = useWord();

  const handleSubmit = (e) => {
    if (!user) {
      navigate("/login");
      return;
    }

    e.preventDefault();
    if (!word || !des) return;
    const { des_json, url } = "";
    const newWord = { word, des, des_json, c_id, memo, url, input_type };
    handleAddWord(newWord);
  };

  const handleDisplay = (data) => {
    const {
      word,
      url,
      memo,
      level,
      input_type,
      email,
      des_json,
      des,
      c_id,
      c_data,
    } = data;
    setWord(word);
    setDes(des);
    setC_id(c_id);
    setMemo(memo);
  };

  const handleAudioCatured = async (audioBlob) => {
    try {
      //1. stt
      const speechText = await speechToText(audioBlob);
      setWord(speechText);
      //2. gpt
      handlechatGpt(speechText);
      setInput_type(2);
    } catch (error) {
      console.log("오류 발생:", error);
    }
  };

  const handlechatGpt = async (word) => {
    try {
      // gpt
      const gptResponse = await getGptResponse(word);
      setDes(gptResponse);
      setC_id(null);
      setMemo("");
    } catch (error) {
      console.log("chatGpt 오류 발생", error);
    }
  };

  // 페이지 로드 시 getGptClick 값에 따라 handlechatGpt 호출
  useEffect(() => {
    if (getGptClick === 1) {
      handlechatGpt(searchText);
    }
  }, [getGptClick, searchText]);

//  const handleCid = (data) => {
//     console.log('handleCid', data);
//     setC_id(data);
//   } 
  return (
    <div className="word-container">
    <Grid
      container
      spacing={1}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        height: "90vh", // Full viewport height
        width: "90vw",
        display: "flex", // Use Flexbox for alignment
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        ml: 10,
        //mt: 4,
      }}
    >
      <Grid size={8}>
        <TextField
          id="word-input"
          label="word"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "grey", borderWidth: "2px" },
              cursor: "pointer",
            },
          }}
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
            setInput_type(1);
          }}
        />
      </Grid>
      <Grid size={1}>
        <AudioRecorder onAudioCaptured={handleAudioCatured}></AudioRecorder>
      </Grid>
      <Grid size={3}>
        <Stack spacing={2} direction="row">
          <Button
            onClick={(e) => {
              handlechatGpt(word);
            }}
            variant="contained"
            sx={{ width: "150px" }} //backgroundColor: "primary.main"
          >
            chatGpt 조회
          </Button>
          <Button
            variant="outlined"
            sx={{ width: "150px" }}
            onClick={async (e) => {
              console.log("전송전 word 조회 >>", word);
              const data = await handlefetchWord(word);
              console.log("조회후 dictionary data 수신 >>", data);
              handleDisplay(data);
            }}
          >
            내 사전 조회
          </Button>
        </Stack>
      </Grid>
      <Grid size={12}>
        <TextField
          id="des-input"
          label="des"
          fullWidth
          multiline
          rows={10}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "grey", borderWidth: "2px" },
            },
          }}
          value={des}
          onChange={(e) => setDes(e.target.value)}
        />
      </Grid>
      <Grid size={8}>
        <Category 
        width="100%"
        cid={c_id}
        onSelect={setC_id} />
      </Grid>
      <Grid size={4}></Grid>
      <Grid size={12}>
        <TextField
          id="memo-input"
          label="memo"
          multiline
          fullWidth
          rows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "grey", borderWidth: "2px" },
            },
          }}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Stack spacing={2} direction="row">
          <Button type="submit" variant="contained" sx={{ width: "150px" }}>
            저장
          </Button>
          <Button
            onClick={(e) => {
              const data = handleinitButton();
              console.log("handleinitButton>>>>", data);
              handleDisplay(data);
            }}
            variant="outlined"
            sx={{ width: "150px" }}
          >
            초기화
          </Button>
        </Stack>
      </Grid>
    </Grid>
    </div>
  );
};

export default Word;
