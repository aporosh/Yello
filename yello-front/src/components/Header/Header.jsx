import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { togglePageType } from "../../store/challenge/challengeSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { pageType } = useSelector(({ challenge }) => challenge);
 
    const toggleCurrentPageType = (type) => dispatch(togglePageType(type));

    const id = window.location.pathname.split('/')[2]

    return (
        <header className={styles.header}>
            <h3 className={styles.header_title} id="header">Yello</h3>
            
                {pageType === "challenge" ? (
                    <Link
                        to={`/results/${id}`}
                        className={styles.header_lk}
                        onClick={() => toggleCurrentPageType("results")}
                    >Results</Link>
                ) : (
                    <Link
                        to={`/challenge/${id}`}
                        className={styles.header_lk}
                        onClick={() => toggleCurrentPageType("challenge")}
                    >Challenge</Link>
                )
                }
           
        </header>
    )
}

export default Header;