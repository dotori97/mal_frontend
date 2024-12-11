import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';  // AuthContext import
import axiosInstance from "../utils/axiosInstance";
import "../components/ChallengeViewer.css";


const ChallengeViewer = ({ dictionarys, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useAuth(); // AuthContext에서 이메일 가져오기

  // dictionarys가 변경되면 currentIndex를 초기화
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [dictionarys]);

  const handleFlip = (e) => {
    // level-selector 내에서의 클릭은 무시
    if (e.target.closest(".level-selector")) return;

    // 카드가 뒤집힌 상태라면 다음 카드로 이동
    if (isFlipped) {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= dictionarys.length) {
        onComplete(); // 모든 카드 완료
      } else {
        setCurrentIndex(nextIndex);
      }
      setIsFlipped(false);
    } else {
      setIsFlipped(true);
    }
  };

  const handleSelectLevel = async (level) => {
    const dictionary = dictionarys[currentIndex]; 

    if (!user) {
      console.error('사용자 내용이 없습니다.');
      return;
    }

    try {
        await axiosInstance.put(`/api/level/id/${dictionary.id}`, {
            level: level, // level 값
            email: user.email, // email 값
        });

        const nextIndex = currentIndex + 1;
        if (nextIndex >= dictionarys.length) {
          onComplete(); // 모든 카드 완료
        } else {
          setCurrentIndex(nextIndex);
        }
        setIsFlipped(false);
      } catch (error) {
        console.error("Error updating level:", error);
      }
    };

    if (currentIndex >= dictionarys.length) {
      return null; // 모든 카드가 완료되었을 경우 아무것도 렌더링하지 않음
    }

  const dictionary = dictionarys[currentIndex];
  const backContent = dictionary.des_json || dictionary.des;

  return (
    <div className="dictionary-container" onClick={handleFlip}>
      <div className={`dictionary ${isFlipped ? "flipped" : ""}`}>
        {!isFlipped ? (
          <div className="dictionary-front">{dictionary.word}</div>
        ) : (
          <div className="dictionary-back">
            <p>{backContent}</p> 
            <div className="level-selector">
              <label>
                <input type="radio" name="level" value="10" checked={dictionary.level === 10}
                  onClick={() => handleSelectLevel(10)}
                />상</label>
              <label>
                <input type="radio" name="level" value="5" checked={dictionary.level === 5}
                  onClick={() => handleSelectLevel(5)}
                />중</label>
              <label>
                <input type="radio" name="level" value="0" checked={dictionary.level === 0}
                  onClick={() => handleSelectLevel(0)}
                />하</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeViewer;
