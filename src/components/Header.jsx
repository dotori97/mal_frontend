import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import axiosInstance from "../utils/axiosInstance"; // Axios 인스턴스 불러오기
import "../components/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // 유저 데이터를 저장할 상태

  // 유저 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        try {
          const response = await axiosInstance.get(`/api/level/email`); 
          // const data = response.data[0];
          const data = response.data.data[0];
          // console.log(`header.jsx 19line ${data.total_cnt} `)
          setUserData(data); // 가져온 데이터 상태에 저장 
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]); // user가 변경될 때마다 실행
    
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 별 생성 로직
  const renderStars = (total, complete) => {
    const stars = [];
    const fullStars = Math.floor(complete / 10); // 완전히 채워진 별의 개수
    const hasHalfStar = complete % 10 > 0; // 반쪽 별 여부
    const totalStars = Math.ceil(total / 10); // 총 별의 개수

    // for (let i = 0; i < totalStars; i++) {
    //   if (i < fullStars) {
    //     stars.push(
    //       <img
    //         key={i}
    //         src="/full-star.png"
    //         alt="Filled Star"
    //         className="star-icon"
    //       />
    //     );
    //   } else if (i === fullStars && hasHalfStar) {
    //     stars.push(
    //       <img
    //         key={i}
    //         src="/half-star.png"
    //         alt="Half Star"
    //         className="star-icon"
    //       />
    //     );
    //   } else {
    //     stars.push(
    //       <img
    //         key={i}
    //         src="/empty-star.png"
    //         alt="Empty Star"
    //         className="star-icon"
    //       />
    //     );
    //   }
    // }

    for (let i = 0; i < totalStars; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star-icon">
            ★ {/* 채워진 별 */}
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="star-icon">
            ✬ {/* 반쪽 별 */}
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-icon">
            ☆ {/* 빈 별 */}
          </span>
        );
      }
    }
    return stars;
  }

  return (
    <header className="header">
      {user ? (
        <div className="header-left"><p>{user.email}
        {userData && userData.total_cnt > 0 && (
                <>
                <span> [{userData.complete_cnt}/{userData.total_cnt}]</span>
                <div className="stars-container">
                  {renderStars(userData.total_cnt, userData.complete_cnt)}
                </div>
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="header-left">Welcome, Guest</div>
      )}
      <div className="header-right">
        <Link to="/">Home</Link>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
