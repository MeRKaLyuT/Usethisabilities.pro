import React from 'react';
import * as styles from './courseDetailPage.module.css';
import {
    Button,
    Checkbox,
    Chip,
    Collapse,
    Divider,
    FormControlLabel,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';

const course = {
    slug: 'http-requests-basics',
    title: 'HTTP Requests: база',
    subtitle: 'Коротко, понятно, с примерами и мини-проверками',
    tags: ['http', 'rest', 'backend', 'networking'],
    level: 'Beginner',
    duration: '45 min',
    updatedAt: '2026-01-25',
    cover: 'https://picsum.photos/seed/http-requests/1200/800',
    modules: [
        {
            id: 'http-basics',
            title: 'Что такое HTTP-запрос',
            summary: 'Базовые элементы общения клиента и сервера.',
            blocks: [
                {
                    type: 'paragraph',
                    text:
                        'HTTP связывает клиента и сервер простым диалогом: запрос → ответ. ' +
                        'Клиент задает адрес и действие, сервер возвращает результат и статус.',
                },
                {
                    type: 'image',
                    src: 'https://picsum.photos/seed/request-flow/1000/560',
                    caption: 'Поток запроса: клиент → сервер → ответ',
                },
                {
                    type: 'callout',
                    variant: 'info',
                    title: 'Небольшой факт',
                    text: 'HTTP — это протокол, а не магия.',
                },
                {
                    type: 'paragraph',
                    text:
                        'Внутри запроса есть URL, метод, заголовки и иногда тело. ' +
                        'Эти части помогают серверу понять, что именно вы хотите получить или изменить.',
                },
                {
                    type: 'checklist',
                    id: 'request-parts',
                    title: 'Из чего состоит запрос',
                    items: ['URL', 'Method', 'Headers', 'Body'],
                },
                {
                    type: 'code',
                    label: 'Raw HTTP пример',
                    code:
                        'GET /api/planets HTTP/1.1\n' +
                        'Host: api.space.dev\n' +
                        'Accept: application/json\n' +
                        'User-Agent: UseThisAbilities\n',
                },
            ],
        },
        {
            id: 'http-methods',
            title: 'Методы: GET/POST/PUT/PATCH/DELETE',
            summary: 'Разные действия с ресурсом.',
            blocks: [
                {
                    type: 'paragraph',
                    text:
                        'GET берёт данные, POST создаёт, PUT обновляет целиком, PATCH изменяет часть, DELETE удаляет. ' +
                        'Обычно метод отражает намерение клиента и влияет на то, как сервер обработает запрос.',
                },
                {
                    type: 'callout',
                    variant: 'success',
                    title: 'Про повторные запросы',
                    text:
                        'Если вы отправите один и тот же запрос несколько раз и результат не меняется — ' +
                        'значит, такой запрос безопасно повторять, когда сеть прерывается.',
                },
                {
                    type: 'image',
                    src: 'https://picsum.photos/seed/http-methods/1000/560',
                    caption: 'Методы — как разные действия над одним ресурсом',
                },
                {
                    type: 'code',
                    label: 'GET и POST (коротко)',
                    code:
                        'GET /api/articles HTTP/1.1\n' +
                        'Host: api.space.dev\n' +
                        'Accept: application/json\n\n' +
                        'POST /api/articles HTTP/1.1\n' +
                        'Host: api.space.dev\n' +
                        'Content-Type: application/json\n\n' +
                        '{"title":"Первый материал"}\n',
                },
                {
                    type: 'code',
                    label: 'Пример curl',
                    code:
                        'curl -X POST https://api.space.dev/articles \\\n' +
                        '  -H "Content-Type: application/json" \\\n' +
                        '  -d "{\\"title\\":\\"Первый материал\\"}"',
                },
                {
                    type: 'quiz',
                    id: 'quiz-create-method',
                    question: 'Какой метод обычно используют для создания ресурса?',
                    options: ['GET', 'POST', 'DELETE', 'PATCH'],
                    correctIndex: 1,
                    explanation: 'POST отправляет данные для создания нового ресурса на сервере.',
                },
            ],
        },
        {
            id: 'headers-body',
            title: 'Заголовки и тело запроса',
            summary: 'Как сервер понимает формат и доступ.',
            blocks: [
                {
                    type: 'paragraph',
                    text:
                        'Заголовки описывают формат данных и правила доступа. ' +
                        'Content-Type говорит, что внутри JSON, Accept — что вы хотите получить, Authorization — кто вы.',
                },
                {
                    type: 'callout',
                    variant: 'warning',
                    title: 'Безопасность',
                    text: 'Не клади токены в localStorage в боевом проекте.',
                },
                {
                    type: 'code',
                    label: 'Пример fetch',
                    code:
                        'fetch("https://api.space.dev/login", {\n' +
                        '  method: "POST",\n' +
                        '  headers: {\n' +
                        '    "Content-Type": "application/json",\n' +
                        '    "Accept": "application/json",\n' +
                        '    "Authorization": "Bearer <token>"\n' +
                        '  },\n' +
                        '  body: JSON.stringify({ email: "pilot@space.dev", password: "secret" })\n' +
                        '});\n',
                },
                {
                    type: 'checklist',
                    id: 'headers-checklist',
                    title: 'Ключевые заголовки',
                    items: ['Content-Type', 'Accept', 'Authorization'],
                },
                {
                    type: 'paragraph',
                    text:
                        'Тело запроса нужно, когда мы отправляем новые данные. ' +
                        'Если тела нет, сервер обрабатывает только мета-информацию из URL и заголовков.',
                },
            ],
        },
        {
            id: 'status-codes',
            title: 'Коды ответов и ошибки',
            summary: 'Как читать ответы сервера.',
            blocks: [
                {
                    type: 'paragraph',
                    text:
                        '2xx означают успех, 3xx — перенаправление, 4xx — ошибка клиента, 5xx — ошибка сервера. ' +
                        'Примеры: 200 OK, 201 Created, 204 No Content, 301/302 Redirect, 400 Bad Request, 401 Unauthorized, ' +
                        '403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error.',
                },
                {
                    type: 'image',
                    src: 'https://picsum.photos/seed/status-codes/1000/560',
                    caption: 'Коды ответов помогают быстро понять результат запроса',
                },
                {
                    type: 'bullets',
                    title: 'Типичные ошибки новичков',
                    items: [
                        'Путать 401 (нужна авторизация) и 403 (доступ запрещён).',
                        'Не обрабатывать ошибки 4xx и показывать пустой экран.',
                        'Считать, что 500 всегда означает «сервер умер», а не сбой в обработке запроса.',
                    ],
                },
                {
                    type: 'quiz',
                    id: 'quiz-401',
                    question: 'Что означает 401?',
                    options: ['Not Found', 'Unauthorized', 'Forbidden', 'Bad Request'],
                    correctIndex: 1,
                    explanation: '401 — неавторизован: нужен корректный токен или логин.',
                },
            ],
        },
    ],
};

const calloutVariants = {
    info: styles.calloutInfo,
    warning: styles.calloutWarning,
    success: styles.calloutSuccess,
};

const Hero = ({ course, onTagClick }) => (
    <section className={styles.hero}>
        <div className={styles.heroBody}>
            <span className={styles.heroEyebrow}>Курс</span>
            <Typography variant="h3" component="h1" className={styles.title}>
                {course.title}
            </Typography>
            <Typography variant="body1" className={styles.subtitle}>
                {course.subtitle}
            </Typography>
            <div className={styles.tagRow}>
                {course.tags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        className={styles.tagChip}
                        onClick={() => onTagClick(tag)}
                    />
                ))}
            </div>
            <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Уровень</span>
                    <span className={styles.metaValue}>{course.level}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Длительность</span>
                    <span className={styles.metaValue}>{course.duration}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Обновлено</span>
                    <span className={styles.metaValue}>{course.updatedAt}</span>
                </div>
            </div>
        </div>
        <div className={styles.heroCover}>
            <img className={styles.heroImage} src={course.cover} alt="Course cover" loading="lazy" />
        </div>
    </section>
);

const Sidebar = ({ modules, activeModuleId, onSelect, variant = 'desktop' }) => (
    <Paper elevation={0} className={`${styles.sidebarCard} ${variant === 'mobile' ? styles.sidebarCardCompact : ''}`}>
        <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Оглавление</span>
            <span className={styles.sidebarCount}>{modules.length} модуля</span>
        </div>
        <List className={styles.sidebarList} dense={variant === 'mobile'}>
            {modules.map((module, index) => (
                <ListItemButton
                    key={module.id}
                    className={styles.listItem}
                    selected={module.id === activeModuleId}
                    onClick={() => onSelect(module.id)}
                >
                    <ListItemText
                        primary={`Модуль ${index + 1}. ${module.title}`}
                        secondary={module.summary}
                        className={styles.listItemText}
                    />
                </ListItemButton>
            ))}
        </List>
    </Paper>
);

const CodeBlock = ({ code, label }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(async () => {
        if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch (error) {
            setCopied(false);
        }
    }, [code]);

    return (
        <Paper elevation={0} className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={styles.codeLabel}>{label}</span>
                <Button
                    size="small"
                    variant="outlined"
                    className={styles.copyButton}
                    onClick={handleCopy}
                    aria-label="Copy code"
                >
                    {copied ? 'Скопировано' : 'Copy'}
                </Button>
            </div>
            <pre className={styles.codePre}>
                <code>{code}</code>
            </pre>
        </Paper>
    );
};

const ContentBlockRenderer = ({ block, checklistState, onToggleChecklist, quizState, onAnswerQuiz }) => {
    if (block.type === 'paragraph') {
        return <p className={`${styles.block} ${styles.paragraph}`}>{block.text}</p>;
    }

    if (block.type === 'callout') {
        return (
            <div className={`${styles.block} ${styles.callout} ${calloutVariants[block.variant]}`}>
                <div className={styles.calloutTitle}>{block.title}</div>
                <p className={styles.calloutText}>{block.text}</p>
            </div>
        );
    }

    if (block.type === 'checklist') {
        const state = checklistState[block.id] || [];
        return (
            <div className={`${styles.block} ${styles.checklistCard}`}>
                <div className={styles.blockTitle}>{block.title}</div>
                <div className={styles.checklistItems}>
                    {block.items.map((item, index) => (
                        <FormControlLabel
                            key={`${block.id}-${item}`}
                            className={styles.checklistItem}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={state[index] || false}
                                    onChange={() => onToggleChecklist(block.id, index)}
                                />
                            }
                            label={item}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (block.type === 'quiz') {
        const selectedIndex = quizState[block.id];
        const answered = selectedIndex !== null && selectedIndex !== undefined;
        return (
            <div className={`${styles.block} ${styles.quizCard}`}>
                <div className={styles.blockTitle}>Мини-квиз</div>
                <div className={styles.quizQuestion}>{block.question}</div>
                <div className={styles.quizOptions}>
                    {block.options.map((option, index) => {
                        const optionClasses = [
                            styles.quizOption,
                            selectedIndex === index ? styles.quizOptionSelected : '',
                            answered && block.correctIndex === index ? styles.quizOptionCorrect : '',
                            answered && selectedIndex === index && block.correctIndex !== index ? styles.quizOptionWrong : '',
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <Button
                                key={`${block.id}-${option}`}
                                variant="outlined"
                                className={optionClasses}
                                onClick={() => onAnswerQuiz(block.id, index)}
                            >
                                {option}
                            </Button>
                        );
                    })}
                </div>
                {answered && (
                    <div className={styles.quizExplanation}>
                        Правильный ответ: {block.options[block.correctIndex]}. {block.explanation}
                    </div>
                )}
            </div>
        );
    }

    if (block.type === 'bullets') {
        return (
            <div className={`${styles.block} ${styles.bulletsCard}`}>
                <div className={styles.blockTitle}>{block.title}</div>
                <ul className={styles.bulletsList}>
                    {block.items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    }

    if (block.type === 'image') {
        return (
            <figure className={`${styles.block} ${styles.imageFigure}`}>
                <img className={styles.image} src={block.src} alt={block.caption} loading="lazy" />
                <figcaption className={styles.imageCaption}>{block.caption}</figcaption>
            </figure>
        );
    }

    if (block.type === 'code') {
        return (
            <div className={styles.block}>
                <CodeBlock code={block.code} label={block.label} />
            </div>
        );
    }

    return null;
};

const CourseDetailPage = ({ onBack }) => {
    const [activeModuleId, setActiveModuleId] = React.useState(course.modules[0].id);
    const [tocOpen, setTocOpen] = React.useState(false);
    const [checklistState, setChecklistState] = React.useState(() => {
        const initialState = {};
        course.modules.forEach((module) => {
            module.blocks.forEach((block) => {
                if (block.type === 'checklist') {
                    initialState[block.id] = block.items.map(() => false);
                }
            });
        });
        return initialState;
    });
    const [quizState, setQuizState] = React.useState(() => {
        const initialState = {};
        course.modules.forEach((module) => {
            module.blocks.forEach((block) => {
                if (block.type === 'quiz') {
                    initialState[block.id] = null;
                }
            });
        });
        return initialState;
    });

    const activeIndex = course.modules.findIndex((module) => module.id === activeModuleId);
    const activeModule = course.modules[activeIndex] || course.modules[0];

    const { totalItems, completedItems, progressValue } = React.useMemo(() => {
        const checklistTotal = course.modules.reduce((acc, module) => {
            const moduleCount = module.blocks.reduce((sum, block) => {
                if (block.type !== 'checklist') return sum;
                return sum + block.items.length;
            }, 0);
            return acc + moduleCount;
        }, 0);
        const quizTotal = course.modules.reduce((acc, module) => {
            const moduleCount = module.blocks.filter((block) => block.type === 'quiz').length;
            return acc + moduleCount;
        }, 0);
        const total = checklistTotal + quizTotal;
        const checkedCount = Object.values(checklistState).reduce(
            (acc, list) => acc + list.filter(Boolean).length,
            0,
        );
        const completedQuizCount = Object.values(quizState).filter((value) => value !== null).length;
        const completed = checkedCount + completedQuizCount;
        const progress = total ? Math.round((completed / total) * 100) : 0;
        return {
            totalItems: total,
            completedItems: completed,
            progressValue: progress,
        };
    }, [checklistState, quizState]);

    const handleChecklistToggle = React.useCallback((checklistId, index) => {
        setChecklistState((prev) => {
            const next = { ...prev };
            const list = [...(next[checklistId] || [])];
            list[index] = !list[index];
            next[checklistId] = list;
            return next;
        });
    }, []);

    const handleQuizAnswer = React.useCallback((quizId, optionIndex) => {
        setQuizState((prev) => ({
            ...prev,
            [quizId]: optionIndex,
        }));
    }, []);

    const handleBack = React.useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    }, [onBack]);

    const handleNext = React.useCallback(() => {
        if (activeIndex < course.modules.length - 1) {
            setActiveModuleId(course.modules[activeIndex + 1].id);
        }
    }, [activeIndex]);

    const handlePrev = React.useCallback(() => {
        if (activeIndex > 0) {
            setActiveModuleId(course.modules[activeIndex - 1].id);
        }
    }, [activeIndex]);

    const handleTagClick = React.useCallback((tag) => {
        window.location.href = `/courses?tag=${encodeURIComponent(tag)}`;
    }, []);

    const handleModuleSelect = React.useCallback((moduleId) => {
        setActiveModuleId(moduleId);
        setTocOpen(false);
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Hero course={course} onTagClick={handleTagClick} />

                <Paper elevation={0} className={styles.progressCard}>
                    <div className={styles.progressHeader}>
                        <span className={styles.progressTitle}>Прогресс курса</span>
                        <span className={styles.progressValue}>
                            {completedItems}/{totalItems} • {progressValue}%
                        </span>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        className={styles.progressBar}
                    />
                </Paper>

                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <Sidebar
                            modules={course.modules}
                            activeModuleId={activeModuleId}
                            onSelect={handleModuleSelect}
                        />
                    </aside>

                    <main className={styles.main}>
                        <div className={styles.mobileToc}>
                            <Button
                                variant="outlined"
                                className={styles.mobileTocButton}
                                onClick={() => setTocOpen((prev) => !prev)}
                            >
                                {tocOpen ? 'Скрыть оглавление' : 'Показать оглавление'}
                            </Button>
                            <Collapse in={tocOpen}>
                                <Sidebar
                                    modules={course.modules}
                                    activeModuleId={activeModuleId}
                                    onSelect={handleModuleSelect}
                                    variant="mobile"
                                />
                            </Collapse>
                        </div>

                        <Paper elevation={0} className={styles.moduleCard} key={activeModule.id}>
                            <Typography variant="h4" component="h2" className={styles.moduleTitle}>
                                {activeModule.title}
                            </Typography>
                            <Typography variant="body2" className={styles.moduleSummary}>
                                {activeModule.summary}
                            </Typography>
                            <Divider className={styles.moduleDivider} />
                            <div className={styles.moduleContent}>
                                {activeModule.blocks.map((block, index) => (
                                    <ContentBlockRenderer
                                        key={`${block.type}-${block.id || index}`}
                                        block={block}
                                        checklistState={checklistState}
                                        onToggleChecklist={handleChecklistToggle}
                                        quizState={quizState}
                                        onAnswerQuiz={handleQuizAnswer}
                                    />
                                ))}
                            </div>
                        </Paper>

                        <div className={styles.navigation}>
                            <Button
                                variant="outlined"
                                className={styles.navButton}
                                onClick={handleBack}
                            >
                                Назад
                            </Button>
                            <div className={styles.navGroup}>
                                <Button
                                    variant="outlined"
                                    className={styles.navButton}
                                    onClick={handlePrev}
                                    disabled={activeIndex === 0}
                                >
                                    Предыдущий модуль
                                </Button>
                                <Button
                                    variant="contained"
                                    className={styles.navButtonPrimary}
                                    onClick={handleNext}
                                    disabled={activeIndex === course.modules.length - 1}
                                >
                                    Следующий модуль
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
