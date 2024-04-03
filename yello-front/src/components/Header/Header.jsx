import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";

const Header = () => {
    return (
        <header className={styles.header}>
            <h3 className={styles.header_title}>Yello</h3>
            <nav>
                <Link to="/" className={styles.header_lk}>Home</Link>
                <Link to="/results" className={styles.header_lk}>Results</Link>
            </nav>
        </header>
    )
}

export default Header;