//import './App.css';
import React from "react";
import Header from "../Header/Header";
import HomePage from "../../pages/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import ResultPage from "../../pages/ResultPage/ResultPage";
import styles from "../../styles/App.module.css";

function App() {
  return (
    <>
     <Header />
     <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/results' element={<ResultPage/>} />
      </Routes>
    </>
  );
}

export default App;
