import React, { useState, useEffect } from "react";

import styles from "../../styles/ScrollTopBottom.module.css";

const ScrollTopBottom = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const goToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {showTopBtn ?
                <div
                    className={styles.up}
                    onClick={goToTop}
                />
                :
                <div
                className={styles.down}
                    onClick={goToBottom}
                />}
        </>
    )

};
export default ScrollTopBottom;
