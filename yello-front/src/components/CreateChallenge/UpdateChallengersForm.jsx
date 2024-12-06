import React, { useEffect, useState } from "react";

import styles from "../../styles/CreateChallengeForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addChallenger, setChallengerData, toggleChallengerId, toggleChallengersForm, updateChallenger } from "../../store/challenge/challengeSlice";


const UpdateChallengersForm = () => {

    const dispatch = useDispatch();
    const { showChallengersForm, activeChallenger, challengerData, challengeId } = useSelector(({ challenge }) => challenge);

    const closeForm = () => {
        dispatch(toggleChallengerId(""))
        dispatch(toggleChallengersForm(false));
        dispatch(setChallengerData({title: "",desc: "",link: ""}));
        setValues({
            title: "",
            description: "",
            link: "",
        })
       
    }
   
    const [values, setValues] = useState({
        id: challengeId,
        activeChallenger: "",
        title: "",
        description: "",
        link: "",
    });

    useEffect(() => {
        if (!activeChallenger) return;
        setValues({
            id: challengeId,
            
            title: challengerData.title,
            description: challengerData.desc,
            link: challengerData.link,
        });
    }, [activeChallenger]);

    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       
        const isNotEmpty = Object.values(values).every(val => val);
        if (!isNotEmpty) return;
        if (activeChallenger) {
            
            dispatch(updateChallenger(values));
        } else {
            console.log('chId ' + challengeId)
            console.log('values ' + values)
            dispatch(addChallenger(values));
           }
        closeForm();
    };

    return showChallengersForm ? (
        <>
            <div className={styles.overlay} onClick={closeForm} />

            <div className={styles.wrapper}>
                <div className={styles.close} onClick={closeForm}>
                    x
                </div>
                {activeChallenger ? <div className={styles.title}>Изменить данные для {activeChallenger}</div> : <div className={styles.title}>Добавить участника вызова</div>}
                <form className={styles.form} onSubmit={handleSubmit} >
                    <div className={styles.group}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Название"
                            value={values.title}
                            autoComplete="off"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.group}>
                        <input
                            type="text"
                            name="link"
                            placeholder="Ссылка"
                            value={values.link}
                            autoComplete="off"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <input
                            type="text"
                            name="description"
                            placeholder="Описание"
                            value={values.description}
                            autoComplete="off"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {activeChallenger ? <button type="submit" className={styles.submit}>Изменить</button> : <button type="submit" className={styles.submit}>Добавить</button>}
                </form>
            </div>
        </>
    ) : (<></>);
};

export default UpdateChallengersForm;
//<form className={styles.form} onSubmit={handleSubmit} >
/**
 * <div className={styles.close} onClick={closeForm}>
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`} />
                    </svg>
                </div>
 */
//chId, challengerId, props.chsTitle, chsDesc, chsLink, active