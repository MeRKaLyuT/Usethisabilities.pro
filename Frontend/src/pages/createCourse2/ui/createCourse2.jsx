import React from 'react';
import * as styles from './createCourse2.module.css';

const myCourses = [
    {
        id: 'http-course-draft',
        title: 'Свой курс по HTTP',
        shortDescription: 'Практический курс по HTTP: запросы, заголовки, статусы, кэширование и работа с API.',
    },
];

const CreateCourse2 = () => {
    const isSingleCourse = myCourses.length === 1;

    return (
        <div className={styles.page}>
            <section className={styles.desktopLayout}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Твои Abilities</h1>
                    <div className={styles.actions}>
                        <button className={styles.createBtn} type="button">
                            Создать курс
                        </button>
                    </div>
                </header>

                <section className={styles.coursesSection}>
                    <div className={styles.coursesGrid}>
                        {myCourses.map((course) => (
                            <article
                                key={course.id}
                                className={`${styles.courseCard} ${isSingleCourse ? styles.courseCardSingle : ''}`}
                            >
                                <button className={styles.deleteBtn} type="button">
                                    Удалить
                                </button>
                                <h2 className={styles.courseTitle}>{course.title}</h2>
                                <p className={styles.courseDescription}>{course.shortDescription}</p>
                                <button className={styles.editBtn} type="button">
                                    Редактировать
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            </section>

            <section className={styles.mobileLayout}>
                <h1 className={styles.mobileTitle}>Страница пока недоступна на мобильных</h1>
                <button
                    className={styles.homeBtn}
                    type="button"
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    На главную
                </button>
            </section>
        </div>
    );
};

export default CreateCourse2;
