import React from 'react';
import * as styles from './abilities2.module.css';

const courseExample = {
    slug: 'http-requests-basics',
    header: 'Основы HTTP',
    mainText: 'База по HTTP запросам',
    tags: ['Roadmap', 'Fullstack', 'Junior'],
};

const courses = [courseExample]; 

const Abilities2 = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.slogan}>Здесь ты найдешь то, что нужно</h1>
                        <button className={styles.createCourseBtn} type="button" onClick={() => window.location.href = `/abilities/my/`}>
                            Создать свой курс
                        </button>
                    </div>
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
                                <button
                                    className={styles.courseBtn}
                                    type="button"
                                    onClick={() => {
                                        window.location.href = `/abilities/${course.slug}`;
                                    }}
                                >
                                    Открыть
                                </button>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
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
