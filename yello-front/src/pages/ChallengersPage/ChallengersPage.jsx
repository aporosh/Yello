import React from "react";
import { useGetChallengersQuery } from "../../store/api/apiSlice";
import { useParams } from "react-router-dom";
import styles from "../../styles/ChallengersPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleChallengerId, toggleChallengersForm, toggleResultsType, setChallengerData, setChallengeId } from "../../store/challenge/challengeSlice";
import CreateChallengersForm from "../../components/CreateChallenge/CreateChallengersForm";
import UpdateChallengersForm from "../../components/CreateChallenge/UpdateChallengersForm";


const ChallengersPage = () => {
    const dispatch = useDispatch();
   // const { activeChallenger, challengerData } = useSelector(({ challenge }) => challenge);
   const { id } = useParams();
    const handleClick = (chId, activeChallenger, title, desc, link, activation) => {
        dispatch(setChallengeId(chId));
        if (activeChallenger) { 
            console.log('chId' + chId)
            dispatch(toggleChallengerId(activeChallenger));
            
            dispatch(setChallengerData({title, desc, link, activation}));
        }
        dispatch(toggleChallengersForm(true));
    };

    

    const { data, isSuccess, isFetching, error } = useGetChallengersQuery({ id });

    if (isFetching) return <p>Loading</p>;
    if (error) return <p>Error: {error.data}</p>;

    //const datalist = resType ? data : data.filter((post) => post.active === true)

    
    const listItems = data.map((post) => {
        let postItemStyle = post.active === true ? styles.post_item : styles.post_item + " " + styles.post_opacity;
        return <li key={post.id} className={postItemStyle}>
            <div className={styles.post_title} onClick={() => handleClick(id, post.id, post.title, post.description, post.link, post.active)}>{post.title}</div>
            <div className={styles.post_numb}>
            <div className={styles.checkbox_cont}>
                <input
                    type="checkbox"
                    id={post.id}
                    name="activation"
                    value={post.active}
                    
                    className={styles.checkbox_inp}
                     />
                     <label htmlFor={post.id}></label>
                     </div>
            </div>
        </li>
    }
    )

    return (
        <div className={styles.result_page}>
           <UpdateChallengersForm  />
            <div className={styles.head}>
                <div className={styles.title}>Challengers list</div>
                <button
                    className={styles.btn_create}
                    onClick={() => handleClick(id)}
                >
                    <div>+</div>
                    <div>Создать нового участника</div>
                </button>
            </div>

            <div className={styles.container} id='result'>
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

export default ChallengersPage;
/**
 * {data.length !== 0 && <div className={styles.checkbox_cont}>
                    <input
                        type="checkbox"
                        id="allResults"
                        name="allResults"
                        value={resType}
                        defaultChecked={resType}
                        className={styles.checkbox_inp}
                        onClick={() => toggleCurrentResultsType()} />
                    <label htmlFor="allResults"></label>
                    {togglText}
                </div>}
 *///chId={id} challengerId={activeChallenger} title={chsTitle} description={chsDesc} link={chsLink} active={active}