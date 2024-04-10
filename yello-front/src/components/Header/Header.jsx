import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";
import { ROUTES } from "../../utils/routes";

const Header = () => {
    return (
        <header className={styles.header}>
            <h3 className={styles.header_title}>Yello</h3>
            <nav>
                <Link to={ROUTES.HOME} className={styles.header_lk}>Home</Link>
                <Link to={ROUTES.RESULTS} className={styles.header_lk}>Results</Link>
            </nav>
        </header>
    )
}

export default Header;