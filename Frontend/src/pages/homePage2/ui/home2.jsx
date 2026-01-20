import React from 'react';
import * as styles from './home2.module.css';

const Home2 = () => {
    return (
        <div className={styles.page}>
            <main className={styles.hero}>
                <p className={styles.greeting}>Привет!</p>
                <h1 className={styles.title}>Найди то, что тебе надо</h1>
                <p className={styles.subtitle}>
                    Маркетплейс навыков и дорожных карт. Навигация по обучению без лишнего шума.
                </p>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>+35%</span>
                        <span className={styles.statLabel}>эффективность при структурированном обучении</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>3</span>
                        <span className={styles.statLabel}>шага до твоей цели</span>
                    </div>
                </div>
                <a className={styles.cta} href="/abilities">Начать путь</a>
            </main>
        </div>
    );
};

export default Home2;
