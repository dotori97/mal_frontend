import React from "react";
import TabMenu from "../components/TabMenu";
import Word from "../components/Word";
import { useAuth } from "../context/AuthContext";

const WordPage = () => {
  const { user } = useAuth();
  
  return (
    // <div className="page-container">
    <div>
      {user && <TabMenu />}
      <Word />
    </div>
  );
};

export default WordPage;
