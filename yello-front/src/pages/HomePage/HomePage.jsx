import React, { useEffect, useState } from "react";
import styles from "../../styles/HomePage.module.css";

import { useAddNewTrialsMutation, useGetChallengeByIdQuery, useUpdateTrialsMutation } from "../../store/api/apiSlice";
import { useParams } from "react-router-dom";


const HomePage = () => {

    const { id } = useParams();

    const { isError, error, isSuccess } = useGetChallengeByIdQuery({ id });

    const [addNewTrials] = useAddNewTrialsMutation({ id });
   
    useEffect(() => {
        if (isError) {
            localStorage.clear();
        } else {
            if (isSuccess) {
                addNewTrials({ id })
            }
        }

    }, [isSuccess, isError])

    let list = localStorage.trialList ? JSON.parse(localStorage.trialList) : [];
    const [updateTrials] = useUpdateTrialsMutation({ id });

    function handleChoose(winner) {
        const loser = list.find(item => item.id !== winner)
        updateTrials({ id, winner: `${winner}`, loser: `${loser.id}` })

        addNewTrials({ id })
    }

    return (
        <div className={styles.home_page}  data-testid="home_page">
            <div className={styles.container}  data-testid="container">
                <div className={styles.market}  data-testid="market">
                    <div className={styles.market_title} data-testid="market_title">Yello</div>
                    {error && <div className={styles.head_error} data-testid="head_error">Такого ChallengeId не существует</div>}
                    {isSuccess && <div className={styles.head_text}>
                        <div className={styles.head_title} data-testid="head_title">{localStorage.chTitle}</div>
                        <div className={styles.head_description} data-testid="head_description">{localStorage.chDescription}</div>
                    </div>}
                </div>
                {!error && <div className={styles.game} data-testid="trial">
                    {list?.length === 0 && <div className={styles.empty} data-testid="empty_trial_data">Нет данных</div>}
                    {list?.map((post) => {
                        return (
                            <li key={post.id} className={styles.game_item} data-testid="trial-item">
                                <div className={styles.item_content} data-testid="item_content">
                                    <a href={post.link} target="_blank" className={styles.game_title} data-testid="item_title">{post.title}</a>
                                    <p className={styles.game_text}  data-testid="item_description">{post.description}</p>
                                </div>
                                <div className={styles.btn}  data-testid="item_btn">
                                    <button
                                        data-testid="poster_button"
                                        className={styles.poster_button}
                                        onClick={() => handleChoose(post.id)}
                                    >
                                        Выбрать
                                    </button>
                                </div>

                            </li>
                        )
                    }
                    )}
                </div>}               
            </div>
        </div>
    )
}
export default HomePage;