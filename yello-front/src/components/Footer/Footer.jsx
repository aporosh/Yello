import React from "react";

import styles from "../../styles/Footer.module.css";

import BG from "../../images/cat.png";

const Footer = () => (


    <footer className={styles.footer}>

        <div className={styles.logo}>
            Yello
        </div>
        <div className={styles.rights}>
            Разработано PAL 2024
        </div>
        <a href="#" className={styles.test}>
           
        </a>
        <div className={styles.poster_image}>
            <img src={BG} alt="" />
        </div>
    </footer>

)

export default Footer