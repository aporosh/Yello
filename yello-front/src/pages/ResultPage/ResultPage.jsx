import React from "react";
import { useGetChallengersQuery } from "../../store/api/apiSlice";
import { useParams } from "react-router-dom";
import styles from "../../styles/ResultPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleResultsType } from "../../store/challenge/challengeSlice";


const ResultPage = () => {
    const dispatch = useDispatch();
    const { resType } = useSelector(({ challenge }) => challenge);

    const toggleCurrentResultsType = (type) => dispatch(toggleResultsType(type));

    const { id } = useParams();

    const { data, isSuccess, isFetching, error } = useGetChallengersQuery({ id });

    if (isFetching) return <p>Loading</p>;
    if (error) return <p>Error: {error.data}</p>;

    const datalist = resType ? data : data.filter((post) => post.active === true)
    //const datalist = resType ? data : data.filter((post) => post.rating > 1100)

    let togglText = "Показать все";
    window.addEventListener("resize", handleTabletChange);
    function handleTabletChange() {
        const mediaQuery = window.matchMedia('(max-width: 650px)')
        console.log("resize")
        if (mediaQuery.matches) {
            togglText= "Все"
        } else togglText = "Показать все"
    }

    /*
    const mediaQuery = window.matchMedia('(width < 650px)')
    function handleTabletChange(e) {
        console.log("resize")
        if (e.matches) {
            togglText= "Все"
        } else togglText = "Показать все"
    }
    mediaQuery.addEventListener("resize", handleTabletChange)
    handleTabletChange(mediaQuery)
*/

    const listItems = datalist?.map((post) => {
        let postItemStyle = post.active === true ? styles.post_item : styles.post_item + " " + styles.post_opacity;
        //let postItemStyle = post.rating > 1100 ? styles.post_item : styles.post_item + " " + styles.post_opacity;
        return <li key={post.id} className={postItemStyle}>
            <a className={styles.post_title} href={post.link} target="_blank">{post.title}</a>
            <div className={styles.post_numb}>
                <div className={styles.post_rating}>{Math.round(post.rating)}</div>
                <div className={styles.post_trials}>({post.trials})</div>
            </div>
        </li>
    }
    )

    return (
        <div className={styles.result_page}>
            <div className={styles.head}>
                <div className={styles.title}>Результаты</div>
                {data.length !== 0 && <div className={styles.checkbox_cont}>
                    <input
                        type="checkbox"
                        id="allResults"
                        name="allResults"
                        value={resType}
                        defaultChecked={resType}
                        className={styles.checkbox_inp}
                        onClick={() => toggleCurrentResultsType()} />
                    <label htmlFor="allResults">Показать все</label>
                    {togglText}
                </div>}
            </div>

            <div className={styles.container}>
                {isSuccess && (
                    <div className={styles.content}>
                        {data.length === 0 && <div className={styles.market_text}>Нет результатов</div>}
                        <ul className={styles.post_list}>
                            {listItems}
                        </ul>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ResultPage;