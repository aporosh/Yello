import React from "react";
import { useGetChallengersQuery } from "../../store/api/apiSlice";
import { useParams } from "react-router-dom";
import styles from "../../styles/ResultPage.module.css";


const ResultPage = () => {

    const { id } = useParams();

    const { data, isSuccess, isFetching, error } = useGetChallengersQuery({ id });
 

    if (isFetching) return <p>Loading</p>;
    if (error) return <p>Error: {error.toString()} </p>;

    return (
        <div className={styles.result_page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Результаты</h1>
                {isSuccess && (
                    <div className={styles.content}>
                        {data.length === 0 && <div className={styles.market_text}>Нет результатов</div>}
                        <ul className={styles.post_list}>
                            {data?.map((post) => {
                                return <li key={post.id} className={styles.post_item}>
                                    <a className={styles.post_title} href={post.link} target="_blank">{post.title}</a>
                                    <div className={styles.post_rating}>{post.rating}</div>
                                    <div className={styles.post_trials}>{post.trials}</div>
                                </li>
                            }

                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResultPage;