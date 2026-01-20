import React from 'react';
import * as styles from './abilities2.module.css';

const courseExample = {
    header: 'Frontend старт',
    mainText: 'База по HTML, CSS и React с логикой роста без перегруза.',
    tags: ['Roadmap', 'Frontend', 'Junior'],
};

const courses = [courseExample]; // replace with server data

const Abilities2 = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.slogan}>Здесь ты найдешь то, что нужно</h1>
                    <div className={styles.searchRow}>
                        <input
                            className={styles.searchInput}
                            type="search"
                            placeholder="Поиск по навыкам, темам, курсам"
                        />
                        <select className={styles.filterSelect} aria-label="Фильтр">
                            <option value="date">По дате</option>
                            <option value="name">По названию</option>
                            <option value="tags">По тегам</option>
                        </select>
                    </div>
                </header>

                <section className={styles.courses}>
                    <div className={styles.courseGrid}>
                        {courses.map((course, index) => (
                            <article key={`${course.header}-${index}`} className={styles.courseCard}>
                                <div className={styles.courseTags}>
                                    {course.tags.map((tag, tagIndex) => (
                                        <span
                                            key={`${tag}-${tagIndex}`}
                                            className={`${styles.tag} ${tagIndex === 0 ? styles.tagAccent : ''}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className={styles.courseTitle}>{course.header}</h2>
                                <p className={styles.courseText}>{course.mainText}</p>
                                <button className={styles.courseBtn} type="button">Открыть</button>
                            </article>
                        ))}
                    </div>

                    {/* Pagination placeholder */}
                    <div className={styles.pagination}>
                        <button className={styles.pageBtn} type="button" disabled>Назад</button>
                        <span className={styles.pageInfo}>1 / 5</span>
                        <button className={styles.pageBtn} type="button" disabled>Вперед</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Abilities2;
