import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./Category.css";

const Category = ({ 
  cid,
  email,
  initialCategories = [], 
  onSelect = () => {}, //기본값 추가: 부모로 선택된 ID 전달
  width = "50%", 
  height = "50px" 
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(initialCategories[0] || null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false); // 경고창 상태
  const { user } = useAuth();
 
  // useEffect(() => {
  //   if (categories.length > 0 && selectedCategory == null) {
  //     setSelectedCategory(categories[0].c_id);
  //   }
  // }, [categories, selectedCategory]);

  
  useEffect(() => {  
    if (categories.length > 0 ) {
      if (cid) {
        const matchingCategory = categories.find(category => category.c_id === cid);
        //setSelectedCategory(categories[matchingCategory].c_id);
        setSelectedCategory(matchingCategory ? matchingCategory.c_id : categories[0].c_id);
      } else {
        setSelectedCategory(categories[0].c_id);
      }
    }
  }, [categories, cid]);
    
  
  useEffect(()=>{    
    const fetchCategories = async() => {  
      if (!user || !user.email) {
        console.warn("User is not defined or email is missing.");
        return; // user가 없으면 fetchCategories를 실행하지 않음
      } 
      const email = user.email;                
      try{
        const response = await axiosInstance.get(`/api/category/email/${email}`); //백엔드에서 데이터 가져오기
        const categories = response.data.categories;
        console.log("category 27번째줄:", response.data.categories);

        if (!Array.isArray(categories) || categories.length === 0) {
          console.warn("No categories found.");
          setCategories([]);
          return;
      }
      
      if(Array.isArray(categories)){
        // console.log("category.jsx 35번째줄response.data.categories"+response.data.categories);
        // console.log("category.jsx 36번째줄JSON.strigify", JSON.stringify(response.data.categories, null, 2));

        setCategories(categories); //데이터 상태 업데이트
        if(categories.length > 0){
          const firstCategory = categories[0]; //첫번째 카테고리 선택
          setSelectedCategory(firstCategory.c_id); //ID 저장
          
          // console.log("category 47번째", firstCategory.c_id);

          onSelect(firstCategory.c_id); //부모 컴포넌트에 전달
          console.log("Selected category ID in Category:", firstCategory.c_id);

        }
      }else{
        console.error("Expected an array but got:", categories);
        setCategories([]); //빈 배열로 초기화
      }      
    }catch(error){
      console.error("Error fetching categories:", error);
    }
  };
  
  fetchCategories();
}, [onSelect, user]); 

  
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectCategory = (category) => {
    setSelectedCategory(category.c_id); //ID 저장
    
    // console.log("category.jsx 66번째줄"+category.c_id);

    onSelect(category.c_id);
    setIsOpen(false);
    setIsEditing(false);
  };

  const addCategory = () => {
    setIsEditing(true);
    setInputValue("");
  };

  const confirmAddCategory = async () => {
    const trimmedValue = inputValue.trim();
    const email= user.email;

    if (!trimmedValue) {
      setIsEditing(false);
      return;
    }

    // categories가 배열인지 확인하고, 배열 내부의 각 객체에 'c_name' 속성이 있는지 확인
    if (Array.isArray(categories)) {
      const isExistingCategory = categories.some(category => category.c_name === trimmedValue);
      if (isExistingCategory) {
        alert("이미 존재하는 목록입니다.");
        setIsEditing(false);
        return;      
      } 
    };

    try{
      const response = await axiosInstance.post('/api/category/create', {
        c_name: trimmedValue, // 새 카테고리 이름 전달
        email
      });      

      //백엔드에서 반환된 새로운 카테고리를 상태에 추가
      const newCategory = response.data; // 백엔드에서 새 카테고리 객체 반환
      console.log("새 카테고리 추가: ",categories, newCategory.data);

      //setCategories([...categories, newCategory]); // 기존 상태에 새 카테고리 추가
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, newCategory.data]
        return updatedCategories;
      });

      //상태 변화 이후 바로 반영되도록 보장  
      setTimeout(() => {
        setSelectedCategory(newCategory.c_id); // 새로 추가된 카테고리를 선택
        onSelect(newCategory.c_id); //부모로 전달
      }, 0);
      
      setIsEditing(false);
    }catch(error){
      console.error("Error adding category:", error);
    }    
  };

  // const removeCategory = async () => {
  //   if (categories.length === 1) {
  //     alert("최소 한 개의 카테고리는 있어야 합니다.");
  //     setShowWarning(false);
  //     return;
  //   }

  //   try{
  //     await axiosInstance.delete(`/api/category/${selectedCategory}`); //삭제 요청
  //     const updatedCategories = categories.filter(
  //       (cat) => cat.c_id !== selectedCategory
  //     );
  //     setCategories(updatedCategories);
  //     setSelectedCategory(updatedCategories[0]);
  //     setShowWarning(false); // 경고창 닫기
  //   }catch(error){
  //     console.error("Error removing category", error);
  //   }    
  // };

  const removeCategory = async () => {
    // if (categories.length === 1) {
    //     alert("최소 한 개의 카테고리는 있어야 합니다.");
    //     setShowWarning(false);
    //     return;
    // }

    try {
        await axiosInstance.delete(`/api/category/${selectedCategory}`); // API 호출
        const updatedCategories = categories.filter(
            (cat) => cat.c_id !== selectedCategory
        );
        setCategories(updatedCategories); 
        setSelectedCategory(updatedCategories[0]?.c_id || null); // 첫 카테고리 선택
        setShowWarning(false);
    } catch (error) {
        console.error("Error removing category", error);
    }
  };


  const handleRemoveClick = () => setShowWarning(true); // 경고창 열기
  const cancelRemove = () => setShowWarning(false); // 경고창 닫기

  return (
    <div className="category-container" style={{width}}>
      {/* 카테고리 선택 박스 */}
      <div className="category-box" style={{ height }}>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={confirmAddCategory}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmAddCategory();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className="category-input"
            placeholder="새 목록 입력"
            autoFocus
          />
        ) : (
          <span onClick={toggleDropdown}>
            {selectedCategory
              ? categories.find((cat)=> cat.c_id === selectedCategory)?.c_name
              : "카테고리를 선택하세요"}
          </span>
        )}
        <span onClick={toggleDropdown}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* 드롭다운 목록 */}
      
      {isOpen && categories.length > 0 && (
        <ul className="category-dropdown" style={{ top: height }}>
          {categories.map((category) => (
            <li
              key={category.c_id}
              className="category-item"
              onClick={() => selectCategory(category)}
            >
              {category.c_name}
            </li>
          ))}
        </ul>
      )}

      {/* +, - 버튼 */}
      <div className="buttons">
        <button className="add-btn" onClick={addCategory}>
          +
        </button>
        <button className="remove-btn" onClick={handleRemoveClick}>
          -
        </button>
      </div>
      

      {/* 경고 메시지 */}
      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-box">
            <p>정말 삭제하시겠습니까?</p>
            <div className="warning-buttons">
              <button onClick={removeCategory}>확인</button>
              <button onClick={cancelRemove}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
