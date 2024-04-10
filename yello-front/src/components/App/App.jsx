//import './App.css';
import React from "react";
import Header from "../Header/Header";
import AppRoutes from "../Routes/Routes";
import styles from "../../styles/App.module.css";
import Footer from "../Footer/Footer";


function App() {
  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
