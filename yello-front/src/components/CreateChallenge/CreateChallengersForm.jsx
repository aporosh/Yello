import React, { useState } from "react";

import styles from "../../styles/CreateChallengeForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addChallengers, toggleChallengersForm } from "../../store/challenge/challengeSlice";


const CreateChallengersForm = () => {
    const dispatch = useDispatch();
    const { showChallengersForm } = useSelector(({ challenge }) => challenge);
   
    const closeForm = () => dispatch(toggleChallengersForm(false));

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
       // dispatch(addChallengers(values));
        closeForm();
    };

    return showChallengersForm ? (
        <>
            <div className={styles.overlay} onClick={closeForm} />

            <div className={styles.wrapper}>
                <div className={styles.close} onClick={closeForm}>
                    x
                </div>
                <div className={styles.title}>Добавить участника вызова</div>
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
                    <button type="submit" className={styles.submit}>Добавить</button>
                </form>
            </div>
        </>
    ) : (<></>);
};

export default CreateChallengersForm;
//<form className={styles.form} onSubmit={handleSubmit} >
/**
 * <div className={styles.close} onClick={closeForm}>
                    <svg className="icon">
                        <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`} />
                    </svg>
                </div>
 */