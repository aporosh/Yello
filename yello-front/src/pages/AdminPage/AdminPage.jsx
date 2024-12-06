import React from "react";
import styles from "../../styles/AdminPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleChallengeForm } from "../../store/challenge/challengeSlice";
import CreateChallengeForm from "../../components/CreateChallenge/CreateChallengeForm";



const AdminPage = () => {
    const dispatch = useDispatch();

    //const { showChallengeForm } = useSelector(({ challenge }) => challenge);

    const handleClick = () => {
        dispatch(toggleChallengeForm(true));
    };

    return (
        <div className={styles.admin_page}>
            <CreateChallengeForm />
            <div className={styles.container}>
                <div className={styles.market}>
                    <div className={styles.market_title}>Yello</div>
                    <div className={styles.head}>
                        <div className={styles.title}>Панель администратора</div>
                    </div>
                </div>

                <button
                    className={styles.btn_create}
                    onClick={handleClick}
                >
                    <div>+</div>
                    <div>Создать новый Challenge</div>
                </button>

            </div>

        </div >
    )
}

export default AdminPage;