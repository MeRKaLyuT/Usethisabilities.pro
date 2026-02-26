import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './myAbilities2.module.css';
import { MyAbilitiesGrid } from '../../../widgets/myAbilitiesGrid/index.js';
import { useMyAbilities } from '../../../features/abilities/hooks/useMyAbilities.js';
import { SignForm } from '../../../widgets/signform/index.jsx';
import { MainBtn } from '../../../shared/ui/mainBtn/index.jsx';

const MyAbilities2 = () => {
    const navigate = useNavigate();
    const {
        data,
        isLoading,
        isError,
        error,
    } = useMyAbilities();

    const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;

    if (isLoading) {
        return <div className={styles.stateCard}>Загрузка твоих Abilities...</div>;
    }

    if (isAuthError) {
        return <SignForm />;
    }

    if (isError) {
        return (
            <div className={styles.stateCard}>
                Не удалось загрузить Abilities. Обнови страницу или попробуй позже.
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>Мои Abilities</h1>
                    <MainBtn type="button" onClick={() => navigate("/abilities/my/create/")}>Создать Ability</MainBtn>
                </div>
                <MyAbilitiesGrid data={data} />
            </div>
        </div>
    );
};

export default MyAbilities2;
