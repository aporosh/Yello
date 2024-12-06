import React, { useState } from "react";

import styles from "../../styles/CreateChallengeForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createChallenge, toggleChallengeForm, toggleChallengersForm } from "../../store/challenge/challengeSlice";


const CreateChallengeForm = () => {
    const dispatch = useDispatch();
    const { showChallengeForm, showChallengersForm } = useSelector(({ challenge }) => challenge);
   
    const closeForm = () => dispatch(toggleChallengeForm(false));

    const [values, setValues] = useState({
        title: "",
        description: "",
    });
    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit")
        const isNotEmpty = Object.values(values).every(val => val);
        if (!isNotEmpty) return;
        dispatch(createChallenge(values));
        setValues("", "")
        closeForm();
        dispatch(toggleChallengersForm(true));
    };

    return showChallengeForm ? (
        <>
            <div className={styles.overlay} onClick={closeForm} />

            <div className={styles.wrapper}>
                <div className={styles.close} onClick={closeForm}>
                    x
                </div>
                <div className={styles.title}>Создание нового Challenge</div>
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
                            name="description"
                            placeholder="Описание"
                            value={values.description}
                            autoComplete="off"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submit}>Создать</button>
                </form>
            </div>
        </>
    ) : (<></>);
};

export default CreateChallengeForm;
//<form className={styles.form} onSubmit={handleSubmit} >
/**
 * <div className={styles.close} onClick={closeForm}>
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`} />
                    </svg>
                </div>
 */