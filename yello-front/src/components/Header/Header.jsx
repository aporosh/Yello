import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { togglePageType } from "../../store/challenge/challengeSlice";
import { getPage } from "../../utils/common";

const Header = () => {
    const dispatch = useDispatch();

    const { pageType } = useSelector(({ challenge }) => challenge);

    const toggleCurrentPageType = (type) => dispatch(togglePageType(type));

    const id = window.location.pathname.split('/')[2]

    useEffect(() => {
        const handleBackButton = () => {
            const currentPage = getPage();
            toggleCurrentPageType(currentPage)
        };

        window.onpopstate = handleBackButton;

        return () => {
            window.onpopstate = null;
        };
    }, []);

    return (
        <header className={styles.header}>
            <h3 className={styles.header_title}>Yello</h3>
            {
                pageType === "challenge" ? (
                    <div>
                        <Link
                            to={`/challenge/${id}/results`}
                            className={styles.header_lk}
                            onClick={() => toggleCurrentPageType("results")}
                        >Results</Link>
                        <Link
                            to={`/admin`}
                            className={styles.header_lk}
                            onClick={() => toggleCurrentPageType("admin")}
                        >Admin</Link>
                    </div>)
                    : pageType === "results" ? (
                        <div>
                            <Link
                                to={`/challenge/${id}`}
                                className={styles.header_lk}
                                onClick={() => toggleCurrentPageType("challenge")}
                            >Challenge</Link>
                            <Link
                                to={`/admin`}
                                className={styles.header_lk}
                                onClick={() => toggleCurrentPageType("admin")}
                            >Admin</Link>
                        </div>
                    )

                        : null

            }
        </header>
    )
}

export default Header;