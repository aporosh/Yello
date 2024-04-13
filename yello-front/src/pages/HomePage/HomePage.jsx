import React, { useEffect } from "react";
import styles from "../../styles/HomePage.module.css";

import { useAddNewTrialsMutation, useGetChallengeByIdQuery, useUpdateTrialsMutation } from "../../store/api/apiSlice";
import { useParams } from "react-router-dom";


const HomePage = () => {
    const { id } = useParams();


    const { isError, error, isSuccess } = useGetChallengeByIdQuery({ id });


    const [addNewTrials] = useAddNewTrialsMutation({ id });

    useEffect(() => {
        if (isError) {
            console.log("error " + isError)
            localStorage.setItem('trial', "")
            localStorage.setItem('trialId', "")
            localStorage.setItem('trialList', "")
            console.log("test")
        } else {
            if (isSuccess) {
                console.log("isSuccess " + isSuccess)
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
        <div className={styles.home_page}>
            <div className={styles.container}>
                <div className={styles.market}>
                    <div className={styles.market_title}>Yello</div>
                    {error && <div className={styles.head_error}>Error: {JSON.stringify(error)} </div>}
                    {isSuccess && <div className={styles.head_text}>{localStorage.chDescription}</div>}
                </div>
                <div className={styles.game}>
                    {list?.length === 0 && <div className={styles.head_error}>Нет данных</div>}
                  
                        {list?.map((post) => {
                            return (
                                <li key={post.id} className={styles.game_item}>
                                    <a href={post.link} target="_blank" className={styles.game_title}>{post.title}</a>
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
                   
                </div>
            </div>
        </div>
    )
}
export default HomePage;