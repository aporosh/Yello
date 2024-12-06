import React from "react";

import styles from "../../styles/Footer.module.css";
import ScrollTopBottom from "../ScrollTopBottom/ScrollTopBottom";
import { useDispatch, useSelector } from "react-redux";
import BG from "../../images/cat.png";

const Footer = () => {
    const { pageType } = useSelector(({ challenge }) => challenge);

return (
    <footer className={styles.footer}>

        <div className={styles.logo}>
            Yello
        </div>
        <div className={styles.rights}>
            Разработано PAL 2024
        </div>

       {pageType === "results" ? <ScrollTopBottom /> : null}
        <div className={styles.poster_image}>
            <img src={BG} alt="" />
        </div>
    </footer>
)
    

}

export default Footer;