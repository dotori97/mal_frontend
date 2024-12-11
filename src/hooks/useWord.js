import { useState, useEffect } from "react";
import {
  fetchWord,
  addWord,
  deleteWord,
  fetchAllbyCategory,
} from "../services/wordService";

export const useWord = () => {
  const handlefetchWord = async (word) => {
    try {
      const data = await fetchWord(word);
      return data;
    } catch (error) {
      console.error("Error fetching Word:", error);
    }
  };

  const handlefetchCategory = async (c_id, id) => {
    try {
      const data = await fetchAllbyCategory(c_id, id);
      return data;
    } catch (error) {
      console.error("Error fetching AllbyCategory:", error);
    }
  };

  const handleAddWord = async (newWord) => {
    try {
      await addWord(newWord);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleDeleteWord = async (id, prevCardsData) => {
    try {
      const res = await deleteWord(id);
      if (res.status == "204") {
        if (!Array.isArray(prevCardsData)) {
          console.error("prevCardsData is not an array", prevCardsData);
          throw new Error("Invalid data: prevCardsData must be an array");
        }
        const updatedCardsData = prevCardsData.filter((card) => card.id !== id);
        return updatedCardsData;
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      throw error;
    }
  };

  const handleinitButton = () => {
    const data = {
      word: "",
      url: "",
      memo: "",
      level: 10,
      input_type: 1,
      email: "",
      des_json: null,
      des: "",
      c_id: null,
      c_data: null,
    };
    return data;
  };

  return {
    handlefetchWord,
    handleAddWord,
    handleDeleteWord,
    handleinitButton,
    handlefetchCategory,
  };
};
