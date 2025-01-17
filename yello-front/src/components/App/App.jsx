//import './App.css';
import React from "react";
import Header from "../Header/Header";
import AppRoutes from "../Routes/Routes";
import styles from "../../styles/App.module.css";
import Footer from "../Footer/Footer";


function App() {
  return (
    <div className={styles.app}>
      <Header />
      <AppRoutes />
      <Footer />
   
    </div>
  );
}

export default App;
