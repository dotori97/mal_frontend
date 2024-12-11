import { useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { downloadWav, getWaveBlob } from "webm-to-wav-converter";

const AudioRecorder = ({ onAudioCaptured }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const stream = useRef(null);
  //* 녹음이 잘 되었는지 알아보고자 확인 차원 코딩 수행
  // const [audioUrl, setAudioUrl] = useState(null);

  //*
  const startRecording = async () => {
    stream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    mediaRecorderRef.current = new MediaRecorder(stream.current);

    mediaRecorderRef.current.ondataavailable = async (event) => {
      // 녹음이 끝나면 동작
      if (mediaRecorderRef.current) {
        // For 16-bit audio file
        const waveData = await getWaveBlob(event.data, false);

        //* 녹음이 잘 되었는지 알아보고자 확인 차원 코딩 수행
        // const url = URL.createObjectURL(waveData);
        // setAudioUrl(url);
        // console.log(url);

        onAudioCaptured(waveData);
      }
      //*
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <IconButton
        aria-label="record"
        color={isRecording ? "secondary" : "primary"}
        onClick={isRecording ? stopRecording : startRecording}
        size="large"
      >
        {isRecording ? (
          <StopIcon sx={{ fontSize: 30 }} />
        ) : (
          <MicIcon sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      {/* {
        // 단축평가 if () {}
        audioUrl && (
          <div>
            <p>녹음된 오디오:</p>
            <audio controls src={audioUrl}></audio>
          </div>
        )
      } */}
    </div>
  );
};

export default AudioRecorder;
