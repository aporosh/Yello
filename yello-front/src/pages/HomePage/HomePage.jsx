import React, { useState } from "react";
import styles from "../../styles/HomePage.module.css";

import { useAddNewTrialsMutation, useUpdateTrialsMutation } from "../../store/api/apiSlice";


const HomePage = () => {
    const [addNewTrials, response] = useAddNewTrialsMutation();
    //const [dataGame, setDataGame] = useState(localStorage.trial);

    let list = localStorage.trialList ? JSON.parse(localStorage.trialList) : [];
   const [updateTrials] = useUpdateTrialsMutation();


    function handleChoose(winner) {
        const loser = list.find(item => item.id !== winner)
        updateTrials({ winner: `${winner}`, loser: `${loser.id}`})
        addNewTrials()
    }

    return (
        <div className={styles.home_page}>
            <div className={styles.container}>
                <div className={styles.market}>
                    <div className={styles.market_title}>Yello</div>
                    <div className={styles.market_text}>Какой-то текст для завлекания в игру например: Выберете что Вам нравится больше</div>
                </div>

                <div
                    className={styles.poster_button}
                    onClick={() => addNewTrials()}
                >test button</div>
                <div className={styles.game}>
                    {list?.length == 0 && <div className={styles.market_text}>Нет результатов</div>}
                    <ul >
                        {list?.map((post) => {
                            return (
                                <li key={post.id} className={styles.game_item}>
                                    <a href={post.link} target="_blank"> <h3 className={styles.game_title}>{post.title}</h3></a>
                                    <p className={styles.game_text}>{post.description}</p>
                                    <button
                                        className={styles.poster_button}
                                        onClick={() => handleChoose(post.id)}
                                    >
                                        Выбери меня
                                    </button>
                                </li>
                            )
                        }

                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default HomePage;