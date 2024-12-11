import axiosInstance from "../utils/axiosInstance.js";

// 내 사전 조회
export const fetchWord = async (word, accessToken) => {
  console.log("2. fetchWord>>>>>>>>>", word);
  const response = await axiosInstance.post("/api/word/type/1", { word });
  return response.data.data;
};

export const fetchAllbyCategory = async (c_id, id, accessToken) => {
  console.log("3. fetchAllbyCategory>>>>>>>>>", c_id, id);
  const response = await axiosInstance.post("/api/dictionary/type/2", { c_id, id });
  return response.data.data;
};

// 저장
export const addWord = async (newWord, accessToken) => {
  try {
    const response = await axiosInstance.post("/api/word/type/3", newWord);
    return response.data.data;
  } catch (error) {
    console.error("Word 등록/수정 오류:", error.message);
  }
};

// 삭제
export const deleteWord = async (id, accessToken) => {
  return await axiosInstance.delete(`/api/dictionary/${id}`);
};
