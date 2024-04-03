import React from "react";
import styles from "../../styles/HomePage.module.css";


const HomePage = () => {

    return (
        <div className={styles.home}>
            <h1 className={styles.home_title}>Сhoose what you like best</h1>
            <div className={styles.game}>
                <div className={styles.game_item}>
                    <a className={styles.game_title}>Test title 123</a>
                    <span className={styles.game_text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, laborum reprehenderit. Vero modi totam nihil mollitia quaerat. Quidem enim repudiandae architecto dicta earum atque nisi temporibus fugiat distinctio? Quidem, ratione.</span>
                </div>
            </div>
            <div className={styles.game}>
                <div className={styles.game_item}>
                    <a> <h3 className={styles.game_title}>Some title 456</h3></a>
                    <p className={styles.game_text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, laborum reprehenderit. Vero modi totam nihil mollitia quaerat. Quidem enim repudiandae architecto dicta earum atque nisi temporibus fugiat distinctio? Quidem, ratione.</p>
                </div>
            </div>
        </div>
    )
}
export default HomePage;