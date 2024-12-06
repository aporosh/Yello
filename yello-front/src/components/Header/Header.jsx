import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Header.module.css";
import classes from "../../styles/Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { togglePageType } from "../../store/challenge/challengeSlice";
import { getPage } from "../../utils/common";

const Header = () => {
    const dispatch = useDispatch();

    const { pageType } = useSelector(({ challenge }) => challenge);

    const toggleCurrentPageType = (type) => dispatch(togglePageType(type));

    const id = window.location.pathname.split('/')[2]

    const [showMenu, setShowMenu] = useState(false);

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

    function openMenu() {
        setShowMenu(!showMenu)
    }
    

    // ** Additional components ** //
    const MenuButtons = ((props) => {
        if (props.pageType == 'challenge') {
            return (
                <ul
                    className={showMenu ? classes.menuButtons + " " + classes.menuButtons__open : classes.menuButtons}>
                    <li ><Link className={styles.header_lk} to={`/challenge/${id}/results`} onClick={() => toggleCurrentPageType("results")}>Results</Link></li>
                </ul>
            )
        } else if (pageType === 'results') {
            console.log("test results")
            return (
                <ul className={showMenu ? classes.menuButtons + " " + classes.menuButtons__open : classes.menuButtons}>
                    <li ><Link className={styles.header_lk} to={`/challenge/${id}`} onClick={() => toggleCurrentPageType("challenge")}>Challenge</Link></li>
                </ul>
            )
        } else if (pageType === 'challengers') {
            return (
                <ul className={showMenu ? classes.menuButtons + " " + classes.menuButtons__open : classes.menuButtons}>
                    <li ><Link className={styles.header_lk} to={`/challenge/${id}`} onClick={() => toggleCurrentPageType("challenge")}>Challenge</Link></li>
                    <li ><Link className={styles.header_lk} to={`/challenge/${id}/results`} onClick={() => toggleCurrentPageType("results")}>Results</Link></li>
                    <li><Link className={styles.header_lk} to={`/admin`} onClick={() => toggleCurrentPageType("admin")}>Admin</Link></li>
                </ul>
            )
        } else return null;
    })

    return (
        <header className={styles.header}>
            <h3 className={styles.header_title}>Yello</h3>
            <nav className={styles.header__menu}>
                {pageType != "admin" && <div className={styles.menu__btn} onClick={openMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>}
                <MenuButtons pageType={pageType} />
            </nav>

        </header>
    )
}

export default Header;