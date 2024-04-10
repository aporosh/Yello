import React from "react";

import styles from "../../styles/Poster.module.css";

import BG from "../../images/cat.png";
import FIL from "../../images/bubble.png";
import FIR from "../../images/cube.png";

const Poster = () => (
    <section className={styles.poster}>
        <div className={styles.poster_title}>Yello</div>
        <div className={styles.poster_content}>
            <div className={styles.text}>
                <h1 className={styles.poster_head}>Какой-то текст для завлекания в игру например: Выберете что Вам нравится больше</h1>
                <button className={styles.poster_button}>Может быть нужна кнопка?</button>
            </div>
            <div className={styles.content_footer}>
                
                    <div className={styles.features_item}>
                        <img className={styles.feature_img} src={FIR} alt="" />
                        <p className={styles.feature_text}>Вы можете выбрать пост, который больше нравится</p>
                    </div>
                    <div className={styles.features_item}>
                        <img className={styles.feature_img} src={FIL} alt="" />
                        <p className={styles.feature_text}>Вы можете перейти по ссылке на страницу публикации</p>
                    </div>
                    <div className={styles.features_item}>
                        <img className={styles.feature_img} src={FIR} alt="" />
                        <p className={styles.feature_text}>Вы можете посмотреть результаты</p>
                    </div>

              
                <div className={styles.poster_image}>
                    <img src={BG} alt="" />
                </div>
            </div>

        </div>
    </section>
)

export default Poster