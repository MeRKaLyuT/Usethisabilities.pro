import React, {useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as styles from './createLesson2.module.css';
import { useCreateAbility } from '../../../features/abilities/hooks/useCreateAbility.js';
import { useUpdateAbility } from '../../../features/abilities/hooks/useUpdateAbility.js';
import { useAbilityDetail } from '../../../features/abilities/hooks/useAbilityDetail.js';
import { useAbilityLessons } from '../../../features/lessons/hooks/useAbilitiyLessons.js';
import { useCreateAbilityLesson } from '../../../features/lessons/hooks/useCreateAbilityLesson.js';
import { useUpdateAbilityLesson } from '../../../features/lessons/hooks/useUpdateAbilityLesson.js';
import { useDeleteAbilityLesson } from '../../../features/lessons/hooks/useDeleteAbilityLesson.js';
import { SignForm } from '../../../widgets/signform/index.jsx';
import { MainBtn } from '../../../shared/ui/mainBtn/index.jsx';

const MAX_LESSONS = 8;
const AUTOSAVE_INTERVAL_MS = 10000;

let localLessonCounter = 0;

const nextLocalLessonId = () => {
    localLessonCounter += 1;
    return `local-lesson-${localLessonCounter}`;
};

const normalizeLessonsPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.lessons)) return payload.lessons;
    if (Array.isArray(payload?.course_lessons)) return payload.course_lessons;
    if (Array.isArray(payload?.ability_lessons)) return payload.ability_lessons;
    if (Array.isArray(payload?.lesson_set)) return payload.lesson_set;
    if (Array.isArray(payload?.modules)) {
        return payload.modules.flatMap((module) => normalizeLessonsPayload(module?.lessons));
    }
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.results)) return payload.data.results;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.data?.lessons)) return payload.data.lessons;
    if (Array.isArray(payload?.data?.course_lessons)) return payload.data.course_lessons;
    if (Array.isArray(payload?.data?.ability_lessons)) return payload.data.ability_lessons;
    if (Array.isArray(payload?.data?.lesson_set)) return payload.data.lesson_set;
    if (Array.isArray(payload?.data?.modules)) {
        return payload.data.modules.flatMap((module) => normalizeLessonsPayload(module?.lessons));
    }
    return [];
};

const normalizeAbilityPayload = (payload) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload[0] || null;
    if (Array.isArray(payload?.data)) return payload.data[0] || null;
    if (payload?.data && typeof payload.data === 'object') return payload.data;
    if (Array.isArray(payload?.results)) return payload.results[0] || null;
    if (Array.isArray(payload?.items)) return payload.items[0] || null;
    if (payload?.item) return payload.item;
    return payload;
};

const extractId = (entity) => {
    const raw = entity?.id ?? entity?.lesson_id ?? entity?.pk ?? null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
};

const EMPTY_TIPTAP_DOC = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const normalizeEditorDoc = (value) => {
    if (isPlainObject(value) && typeof value.type === 'string') {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            if (isPlainObject(parsed) && typeof parsed.type === 'string') {
                return parsed;
            }
        } catch (_) {}
    }

    return EMPTY_TIPTAP_DOC;
};

const safeClone = (value) => {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (_) {
        return EMPTY_TIPTAP_DOC;
    }
};

const docsEqual = (a, b) => {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch (_) {
        return false;
    }
};

const buildLocalLesson = (index) => {
    return {
        localId: nextLocalLessonId(),
        id: null,
        title: `Урок ${index}`,
        body: safeClone(EMPTY_TIPTAP_DOC),
        isDirty: false,
        isSaving: false,
        saveError: '',
        lastSavedAt: null,
    };
};

const mapServerLesson = (lesson, index) => {
    return {
        localId: nextLocalLessonId(),
        id: extractId(lesson),
        title: lesson?.title || `Урок ${index + 1}`,
        body: normalizeEditorDoc(lesson?.body),
        isDirty: false,
        isSaving: false,
        saveError: '',
        lastSavedAt: lesson?.updated_at || lesson?.updatedAt || null,
    };
};

const formatSavedTime = (value) => {
    if (!value) return 'Еще не сохранено';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Сохранено';

    return `Сохранено в ${new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date)}`;
};

const normalizePublicationStatus = (value) => {
    return String(value || '').trim().toLowerCase() === 'published' ? 'published' : 'draft';
};

const CreateLesson2 = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [initialCourseId] = React.useState(() => {
        const raw = searchParams.get('courseId') || searchParams.get('abilityId');
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    });

    const [courseId, setCourseId] = React.useState(initialCourseId);
    const [courseTitle, setCourseTitle] = React.useState('');
    const [abilityLastSavedTitle, setAbilityLastSavedTitle] = React.useState('');
    const [isAbilityTitleSaving, setIsAbilityTitleSaving] = React.useState(false);
    const [publicationStatus, setPublicationStatus] = React.useState('draft');
    const [isPublishingCourse, setIsPublishingCourse] = React.useState(false);
    const [abilityTitleError, setAbilityTitleError] = React.useState('');
    const [pageError, setPageError] = React.useState('');

    const firstLessonRef = React.useRef(buildLocalLesson(1));
    const [lessons, setLessons] = React.useState([firstLessonRef.current]);
    const [activeLessonLocalId, setActiveLessonLocalId] = React.useState(firstLessonRef.current.localId);
    const [isHydratedFromServer, setIsHydratedFromServer] = React.useState(false);

    const lessonsRef = React.useRef(lessons);
    const activeLessonIdRef = React.useRef(activeLessonLocalId);
    const courseIdRef = React.useRef(courseId);
    const courseTitleRef = React.useRef(courseTitle);
    const abilitySavedTitleRef = React.useRef(abilityLastSavedTitle);
    const publicationStatusRef = React.useRef(publicationStatus);
    const autosaveInFlightRef = React.useRef(false);
    const abilityTitleSaveInFlightRef = React.useRef(false);
    const isAbilityTitleHydratedRef = React.useRef(false);

    useEffect(() => {
        lessonsRef.current = lessons;
    }, [lessons]);

    useEffect(() => {
        activeLessonIdRef.current = activeLessonLocalId;
    }, [activeLessonLocalId]);

    useEffect(() => {
        courseIdRef.current = courseId;
    }, [courseId]);

    useEffect(() => {
        courseTitleRef.current = courseTitle;
    }, [courseTitle]);

    useEffect(() => {
        abilitySavedTitleRef.current = abilityLastSavedTitle;
    }, [abilityLastSavedTitle]);

    useEffect(() => {
        publicationStatusRef.current = publicationStatus;
    }, [publicationStatus]);

    const {
        data: lessonsResponse,
        isLoading: isLessonsLoading,
        isError: isLessonsError,
        error: lessonsError,
    } = useAbilityLessons(courseId);

    const {
        data: abilityResponse,
        isLoading: isAbilityLoading,
        isError: isAbilityError,
        error: abilityError,
    } = useAbilityDetail(courseId);

    const createAbilityMutation = useCreateAbility();
    const updateAbilityMutation = useUpdateAbility();
    const createLessonMutation = useCreateAbilityLesson();
    const updateLessonMutation = useUpdateAbilityLesson();
    const deleteLessonMutation = useDeleteAbilityLesson();

    const isExistingCourseMode = Boolean(initialCourseId);
    const ability = React.useMemo(() => normalizeAbilityPayload(abilityResponse), [abilityResponse]);

    const isAuthError = [lessonsError, abilityError].some((error) => {
        return error?.response?.status === 401 || error?.response?.status === 403;
    });

    useEffect(() => {
        if (!isExistingCourseMode || !ability || isAbilityTitleHydratedRef.current) return;

        const serverTitle = String(ability?.title || '').trim();
        if (!courseTitleRef.current.trim()) {
            setCourseTitle(serverTitle);
            courseTitleRef.current = serverTitle;
        }
        setAbilityLastSavedTitle(serverTitle);
        abilitySavedTitleRef.current = serverTitle;
        isAbilityTitleHydratedRef.current = true;
    }, [ability, isExistingCourseMode]);

    useEffect(() => {
        if (!ability) return;
        setPublicationStatus(normalizePublicationStatus(ability?.status));
    }, [ability]);

    useEffect(() => {
        if (!isExistingCourseMode || isHydratedFromServer || !courseId) return;
        if (isLessonsLoading || isLessonsError) return;

        const loadedLessons = normalizeLessonsPayload(lessonsResponse).slice(0, MAX_LESSONS);

        if (!loadedLessons.length) {
            const fallbackLesson = buildLocalLesson(1);
            setLessons([fallbackLesson]);
            setActiveLessonLocalId(fallbackLesson.localId);
            setIsHydratedFromServer(true);
            return;
        }

        const mappedLessons = loadedLessons.map((lesson, index) => mapServerLesson(lesson, index));
        setLessons(mappedLessons);
        setActiveLessonLocalId(mappedLessons[0].localId);
        setIsHydratedFromServer(true);
    }, [
        courseId,
        isExistingCourseMode,
        isHydratedFromServer,
        isLessonsError,
        isLessonsLoading,
        lessonsResponse,
    ]);

    useEffect(() => {
        if (!lessons.length) return;
        if (lessons.some((lesson) => lesson.localId === activeLessonLocalId)) return;
        setActiveLessonLocalId(lessons[0].localId);
    }, [activeLessonLocalId, lessons]);

    const activeLesson = React.useMemo(() => {
        return lessons.find((lesson) => lesson.localId === activeLessonLocalId) || lessons[0] || null;
    }, [activeLessonLocalId, lessons]);

    const ensureCourseId = React.useCallback(async () => {
        if (courseIdRef.current) return courseIdRef.current;

        const safeTitle = courseTitleRef.current.trim() || `Новая Ability ${new Date().toISOString().slice(0, 10)}`;
        const createdAbility = await createAbilityMutation.mutateAsync({ title: safeTitle });
        const createdCourseId = extractId(createdAbility);

        if (!createdCourseId) {
            throw new Error('Сервер не вернул id Ability.');
        }

        setCourseId(createdCourseId);
        setAbilityLastSavedTitle(safeTitle);
        setPublicationStatus(normalizePublicationStatus(createdAbility?.status));
        setAbilityTitleError('');
        courseTitleRef.current = safeTitle;
        abilitySavedTitleRef.current = safeTitle;
        return createdCourseId;
    }, [createAbilityMutation]);

    const saveAbilityTitle = React.useCallback(async (targetCourseId = null) => {
        const abilityId = targetCourseId ?? courseIdRef.current;
        if (!abilityId || abilityTitleSaveInFlightRef.current) return null;

        const currentTitle = courseTitleRef.current.trim();
        const savedTitle = abilitySavedTitleRef.current.trim();
        const payloadTitle = currentTitle || `Ability ${abilityId}`;

        if (payloadTitle === savedTitle) return payloadTitle;

        abilityTitleSaveInFlightRef.current = true;
        setIsAbilityTitleSaving(true);
        setAbilityTitleError('');

        try {
            const updatedAbility = await updateAbilityMutation.mutateAsync({
                abilityId,
                payload: { title: payloadTitle },
            });

            if (updatedAbility?.status !== undefined) {
                setPublicationStatus(normalizePublicationStatus(updatedAbility?.status));
            }
            const nextSavedTitle = String(updatedAbility?.title || payloadTitle);
            setCourseTitle(nextSavedTitle);
            setAbilityLastSavedTitle(nextSavedTitle);
            setPageError('');
            courseTitleRef.current = nextSavedTitle;
            abilitySavedTitleRef.current = nextSavedTitle;
            return nextSavedTitle;
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось сохранить название Ability.';

            setAbilityTitleError(message);
            setPageError(message);
            throw error;
        } finally {
            setIsAbilityTitleSaving(false);
            abilityTitleSaveInFlightRef.current = false;
        }
    }, [updateAbilityMutation]);

    const saveLesson = React.useCallback(async (localId) => {
        const firstSnapshot = lessonsRef.current.find((lesson) => lesson.localId === localId);
        if (!firstSnapshot || firstSnapshot.isSaving) return null;

        setLessons((prev) => prev.map((lesson) => {
            if (lesson.localId !== localId) return lesson;
            return { ...lesson, isSaving: true, saveError: '' };
        }));

        try {
            const currentCourseId = await ensureCourseId();
            if (courseTitleRef.current.trim() !== abilitySavedTitleRef.current.trim()) {
                await saveAbilityTitle(currentCourseId).catch(() => {});
            }

            const snapshot = lessonsRef.current.find((lesson) => lesson.localId === localId);
            if (!snapshot) return null;

            const lessonIndex = lessonsRef.current.findIndex((lesson) => lesson.localId === localId);

            const payload = {
                title: snapshot.title?.trim() || `Урок ${lessonIndex + 1}`,
                body: normalizeEditorDoc(snapshot.body), 
                order: lessonIndex + 1,
                ...(publicationStatusRef.current === 'published' ? { status: 'published' } : {}),
            };

            const savedLesson = snapshot.id
                ? await updateLessonMutation.mutateAsync({
                    courseId: currentCourseId,
                    lessonId: snapshot.id,
                    payload,
                })
                : await createLessonMutation.mutateAsync({
                    courseId: currentCourseId,
                    payload,
                });

            const savedLessonId = extractId(savedLesson) || snapshot.id;

            setLessons((prev) => prev.map((lesson) => {
                if (lesson.localId !== localId) return lesson;
                return {
                    ...lesson,
                    id: savedLessonId,
                    title: savedLesson?.title || payload.title,
                    body: normalizeEditorDoc(savedLesson?.body ?? payload.body),
                    isDirty: false,
                    isSaving: false,
                    saveError: '',
                    lastSavedAt: savedLesson?.updated_at || savedLesson?.updatedAt || Date.now(),
                };
            }));

            setPageError('');
            return savedLessonId;
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось сохранить урок.';

            setLessons((prev) => prev.map((lesson) => {
                if (lesson.localId !== localId) return lesson;
                return {
                    ...lesson,
                    isSaving: false,
                    saveError: message,
                };
            }));

            setPageError(message);
            throw error;
        }
    }, [createLessonMutation, ensureCourseId, saveAbilityTitle, updateLessonMutation]);

    const saveDirtyLessons = React.useCallback(async () => {
        if (autosaveInFlightRef.current) return;

        const hasDirtyAbilityTitle =
            Boolean(courseIdRef.current) &&
            courseTitleRef.current.trim() !== abilitySavedTitleRef.current.trim();
        const dirtyLessons = lessonsRef.current.filter((lesson) => lesson.isDirty && !lesson.isSaving);
        if (!dirtyLessons.length && !hasDirtyAbilityTitle) return;

        autosaveInFlightRef.current = true;
        try {
            if (hasDirtyAbilityTitle) {
                await saveAbilityTitle(courseIdRef.current).catch(() => {});
            }

            for (const lesson of dirtyLessons) {
                await saveLesson(lesson.localId);
            }
        } finally {
            autosaveInFlightRef.current = false;
        }
    }, [saveAbilityTitle, saveLesson]);

    useEffect(() => {
        const timerId = window.setInterval(() => {
            saveDirtyLessons().catch(() => {});
        }, AUTOSAVE_INTERVAL_MS);

        return () => window.clearInterval(timerId);
    }, [saveDirtyLessons]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: normalizeEditorDoc(activeLesson?.body),
        editorProps: {
            attributes: {
                class: styles.editorSurface,
            },
        },
        onUpdate: ({ editor: tiptapEditor }) => {
            const nextDoc = tiptapEditor.getJSON();
            const targetLocalId = activeLessonIdRef.current;

            setLessons((prev) => prev.map((lesson) => {
                if (lesson.localId !== targetLocalId) return lesson;
                if (docsEqual(lesson.body, nextDoc)) return lesson;

                return {
                    ...lesson,
                    body: nextDoc,
                    isDirty: true,
                    saveError: '',
                };
            }));
        },
    });

    useEffect(() => {
        if (!editor || !activeLesson) return;

        const nextDoc = normalizeEditorDoc(activeLesson.body);
        const currentDoc = editor.getJSON();

        if (!docsEqual(currentDoc, nextDoc)) {
            editor.commands.setContent(nextDoc, false);
        }
    }, [activeLesson, editor]);

    const handleAddLesson = React.useCallback(() => {
        const currentLessons = lessonsRef.current;
        if (currentLessons.length >= MAX_LESSONS) return;

        const nextLesson = buildLocalLesson(currentLessons.length + 1);
        setLessons([...currentLessons, nextLesson]);
        setActiveLessonLocalId(nextLesson.localId);
    }, []);

    const handleDeleteActiveLesson = React.useCallback(async () => {
        const snapshot = lessonsRef.current;
        const targetLesson = snapshot.find((lesson) => lesson.localId === activeLessonIdRef.current);
        if (!targetLesson) return;

        const isConfirmed = window.confirm('Удалить этот урок?');
        if (!isConfirmed) return;

        try {
            if (targetLesson.id && courseIdRef.current) {
                await deleteLessonMutation.mutateAsync({
                    courseId: courseIdRef.current,
                    lessonId: targetLesson.id,
                });
            }

            const targetIndex = snapshot.findIndex((lesson) => lesson.localId === targetLesson.localId);
            const filtered = snapshot.filter((lesson) => lesson.localId !== targetLesson.localId);

            const normalized = filtered.length
                ? filtered.map((lesson, index) => {
                    const isDefaultTitle = /^(Lesson|Урок) \d+$/i.test(lesson.title || '');
                    if (!isDefaultTitle) return lesson;

                    return {
                        ...lesson,
                        title: `Урок ${index + 1}`,
                    };
                })
                : [buildLocalLesson(1)];

            const nextActiveLesson =
                normalized[targetIndex] ||
                normalized[targetIndex - 1] ||
                normalized[0];

            setLessons(normalized);

            if (nextActiveLesson) {
                setActiveLessonLocalId(nextActiveLesson.localId);
            }

            setPageError('');
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось удалить урок.';

            setPageError(message);
        }
    }, [deleteLessonMutation]);

    const handleSaveActiveLesson = React.useCallback(() => {
        if (!activeLesson) return;
        saveLesson(activeLesson.localId).catch(() => {});
    }, [activeLesson, saveLesson]);

    const handleCourseTitleChange = React.useCallback((event) => {
        const nextTitle = event.target.value;
        setCourseTitle(nextTitle);
        setAbilityTitleError('');
        courseTitleRef.current = nextTitle;
    }, []);

    const handleSaveAbilityTitle = React.useCallback(async () => {
        try {
            const currentCourseId = await ensureCourseId();
            await saveAbilityTitle(currentCourseId);
        } catch {}
    }, [ensureCourseId, saveAbilityTitle]);

    const saveLessonsForPublication = React.useCallback(async () => {
        const lessonsSnapshot = lessonsRef.current.filter((lesson) => !lesson.isSaving);
        const persistedLessons = [];

        for (const lesson of lessonsSnapshot) {
            if (!lesson.id || lesson.isDirty) {
                const savedLessonId = await saveLesson(lesson.localId);
                const resolvedId = savedLessonId ?? lesson.id;
                if (resolvedId) {
                    persistedLessons.push({
                        localId: lesson.localId,
                        lessonId: resolvedId,
                    });
                }
                continue;
            }

            persistedLessons.push({
                localId: lesson.localId,
                lessonId: lesson.id,
            });
        }

        return persistedLessons;
    }, [saveLesson]);

    const handlePublishCourse = React.useCallback(async () => {
        if (isPublishingCourse) return;

        setIsPublishingCourse(true);
        setPageError('');

        try {
            const currentCourseId = await ensureCourseId();

            if (courseTitleRef.current.trim() !== abilitySavedTitleRef.current.trim()) {
                await saveAbilityTitle(currentCourseId);
            }

            const persistedLessons = await saveLessonsForPublication();

            for (const lesson of persistedLessons) {
                await updateLessonMutation.mutateAsync({
                    courseId: currentCourseId,
                    lessonId: lesson.lessonId,
                    payload: { status: 'published' },
                });
            }

            const updatedAbility = await updateAbilityMutation.mutateAsync({
                abilityId: currentCourseId,
                payload: { status: 'published' },
            });

            setPublicationStatus(normalizePublicationStatus(updatedAbility?.status));
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось опубликовать Ability.';
            setPageError(message);
        } finally {
            setIsPublishingCourse(false);
        }
    }, [ensureCourseId, isPublishingCourse, saveAbilityTitle, saveLessonsForPublication, updateAbilityMutation]);

    const handleLessonTitleChange = React.useCallback((event) => {
        const nextTitle = event.target.value;
        const targetLocalId = activeLessonIdRef.current;

        setLessons((prev) => prev.map((lesson) => {
            if (lesson.localId !== targetLocalId) return lesson;
            return {
                ...lesson,
                title: nextTitle,
                isDirty: true,
                saveError: '',
            };
        }));
    }, []);

    const hasMaxLessons = lessons.length >= MAX_LESSONS;
    const isSavingNow = Boolean(activeLesson?.isSaving);
    const isAnyLessonSaving = lessons.some((lesson) => lesson.isSaving);
    const isAbilityTitleDirty =
        Boolean(courseId) && courseTitle.trim() !== abilityLastSavedTitle.trim();
    const isPublishedCourse = publicationStatus === 'published';
    const isPublishDisabled =
        isPublishingCourse ||
        isAbilityTitleSaving ||
        createAbilityMutation.isPending ||
        isAnyLessonSaving;
    const backTarget = isExistingCourseMode && (courseId || initialCourseId)
        ? `/abilities/${courseId || initialCourseId}`
        : '/abilities/my';

    const renderToolbarButton = (label, onClick, isActive = false) => {
        return (
            <button
                type="button"
                className={`${styles.toolbarButton} ${isActive ? styles.toolbarButtonActive : ''}`}
                onClick={onClick}
                disabled={!editor}
            >
                {label}
            </button>
        );
    };

    if (isExistingCourseMode && (isLessonsLoading || isAbilityLoading) && !isHydratedFromServer) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>Загрузка уроков...</div>
            </div>
        );
    }

    if (isAuthError) {
        return <SignForm />;
    }

    if (isExistingCourseMode && isAbilityError) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>Не удалось загрузить Ability для редактирования.</div>
            </div>
        );
    }

    if (isExistingCourseMode && isLessonsError) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>Не удалось загрузить уроки для этой Ability.</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerMain}>
                        <h1 className={styles.title}>
                            {isExistingCourseMode ? 'Редактировать Ability' : 'Создать Ability'}
                        </h1>
                        {/* <p className={styles.subtitle}>
                            Страница сохраняет изменения вручную и автоматически каждые 10 секунд.
                        </p> */}
                    </div>
                    <div className={styles.headerActions}>
                        <MainBtn type="button" onClick={() => navigate(backTarget)}>Назад</MainBtn>
                    </div>
                </header>

                <section className={styles.courseCard}>
                    <label className={styles.fieldLabel} htmlFor="course-title">
                        Название Ability
                    </label>
                    <input
                        id="course-title"
                        className={styles.courseInput}
                        value={courseTitle}
                        onChange={handleCourseTitleChange}
                        onBlur={() => {
                            if (!courseId) return;
                            saveAbilityTitle().catch(() => {});
                        }}
                        placeholder="Например: Основы React"
                        disabled={isAbilityTitleSaving}
                    />
                    <div className={styles.courseActions}>
                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={handleSaveAbilityTitle}
                            disabled={isAbilityTitleSaving || createAbilityMutation.isPending}
                        >
                            {isAbilityTitleSaving
                                ? 'Сохранение...'
                                : courseId
                                    ? 'Сохранить название'
                                    : 'Создать Ability'}
                        </button>
                        <button
                            type="button"
                            className={`${styles.saveButton} ${styles.publishButton}`}
                            onClick={handlePublishCourse}
                            disabled={isPublishDisabled}
                        >
                            {isPublishingCourse
                                ? 'Публикация...'
                                : isPublishedCourse
                                    ? 'Сохранить и перепубликовать'
                                    : 'Сохранить и опубликовать'}
                        </button>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>
                            {courseId ? `ID Ability: ${courseId}` : 'ID появится после создания Ability'}
                        </span>
                        <span className={styles.metaItem}>
                            {courseId
                                ? (isAbilityTitleDirty ? 'Название изменено, но не сохранено' : 'Название сохранено')
                                : 'Название сохранится при создании Ability'}
                        </span>
                        <span className={styles.metaItem}>
                            {isPublishedCourse ? 'Статус: опубликован' : 'Статус: черновик'}
                        </span>
                        <span className={styles.metaItem}>Лимит уроков: {MAX_LESSONS}</span>
                    </div>
                    {abilityTitleError ? <div className={styles.errorText}>{abilityTitleError}</div> : null}
                </section>

                <section className={styles.lessonCard}>
                    <div className={styles.tabsBar} role="tablist" aria-label="Уроки">
                        {lessons.map((lesson, index) => (
                            <button
                                key={lesson.localId}
                                type="button"
                                role="tab"
                                aria-selected={lesson.localId === activeLessonLocalId}
                                className={`${styles.lessonTab} ${lesson.localId === activeLessonLocalId ? styles.lessonTabActive : ''}`}
                                onClick={() => setActiveLessonLocalId(lesson.localId)}
                            >
                                {`Урок ${index + 1}`}
                            </button>
                        ))}
                        <button
                            type="button"
                            className={`${styles.lessonTab} ${styles.addTab}`}
                            onClick={handleAddLesson}
                            disabled={hasMaxLessons}
                            aria-label="Добавить урок"
                        >
                            +
                        </button>
                    </div>

                    {activeLesson ? (
                        <div className={styles.editorBlock}>
                            <div className={styles.editorTopRow}>
                                <input
                                    className={styles.lessonTitleInput}
                                    value={activeLesson.title}
                                    onChange={handleLessonTitleChange}
                                    placeholder="Название урока"
                                />
                                <div className={styles.lessonActions}>
                                    <button
                                        type="button"
                                        className={styles.saveButton}
                                        onClick={handleSaveActiveLesson}
                                        disabled={isSavingNow}
                                    >
                                        {isSavingNow ? 'Сохранение...' : 'Сохранить урок'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={handleDeleteActiveLesson}
                                        disabled={isSavingNow}
                                    >
                                        Удалить урок
                                    </button>
                                </div>
                            </div>

                            <div className={styles.toolbar}>
                                {renderToolbarButton(
                                    'B',
                                    () => editor?.chain().focus().toggleBold().run(),
                                    editor?.isActive('bold'),
                                )}
                                {renderToolbarButton(
                                    'I',
                                    () => editor?.chain().focus().toggleItalic().run(),
                                    editor?.isActive('italic'),
                                )}
                                {renderToolbarButton(
                                    'Пунктовый список',
                                    () => editor?.chain().focus().toggleBulletList().run(),
                                    editor?.isActive('bulletList'),
                                )}
                                {renderToolbarButton(
                                    'Номерной список',
                                    () => editor?.chain().focus().toggleOrderedList().run(),
                                    editor?.isActive('orderedList'),
                                )}
                                {renderToolbarButton(
                                    'H2',
                                    () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                                    editor?.isActive('heading', { level: 2 }),
                                )}
                                {renderToolbarButton('Отменить', () => editor?.chain().focus().undo().run())}
                                {renderToolbarButton('Повторить', () => editor?.chain().focus().redo().run())}
                            </div>

                            <EditorContent editor={editor} />

                            <div className={styles.statusRow}>
                                <span className={styles.statusText}>
                                    {activeLesson.isSaving ? 'Сохранение...' : formatSavedTime(activeLesson.lastSavedAt)}
                                </span>
                                {activeLesson.isDirty ? (
                                    <span className={styles.statusDirty}>Есть несохраненные изменения</span>
                                ) : null}
                            </div>

                            {activeLesson.saveError ? (
                                <div className={styles.errorText}>{activeLesson.saveError}</div>
                            ) : null}
                        </div>
                    ) : null}
                </section>

                {pageError ? <div className={styles.errorText}>{pageError}</div> : null}
            </div>
        </div>
    );
};

export default CreateLesson2;
