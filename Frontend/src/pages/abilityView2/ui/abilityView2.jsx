import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as styles from './abilityView2.module.css';
import { useAbilityLessons } from '../../../features/lessons/hooks/useAbilitiyLessons.js';
import { useAbilityLessonDetail } from '../../../features/lessons/hooks/useAbilityLessonDetail.js';
import { useAbilityDetail } from '../../../features/abilities/hooks/useAbilityDetail.js';
import { useUpdateAbility } from '../../../features/abilities/hooks/useUpdateAbility.js';
import { useStartAbility } from '../../../features/abilities/hooks/useStartAbility.js';
import { useMyStartedAbilities } from '../../../features/abilities/hooks/useMyStartedAbilities.js';
import { useMe } from '../../../features/auth/hooks/useMe.js';
import { SignForm } from '../../../widgets/signform/index.jsx';
import { MainBtn } from '../../../shared/ui/mainBtn/index.jsx';
import { AbilityStatusBadge } from '../../../shared/ui/abilityStatusBadge/index.js';

let localLessonCounter = 0;

const nextLocalLessonId = () => {
    localLessonCounter += 1;
    return `view-lesson-${localLessonCounter}`;
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

const normalizeLessonPayload = (payload) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload[0] || null;
    if (Array.isArray(payload?.data)) return payload.data[0] || null;
    if (payload?.data && typeof payload.data === 'object') return payload.data;
    if (Array.isArray(payload?.results)) return payload.results[0] || null;
    if (Array.isArray(payload?.items)) return payload.items[0] || null;
    if (payload?.item) return payload.item;
    return payload;
};

const EMPTY_TIPTAP_DOC = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};

const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const normalizeEditorContent = (value) => {
    if (isPlainObject(value) && typeof value.type === 'string') {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            if (isPlainObject(parsed) && typeof parsed.type === 'string') {
                return parsed;
            }
        } catch {
            return value;
        }
    }

    return EMPTY_TIPTAP_DOC;
};

const docsEqual = (a, b) => {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
};

const normalizeEntityId = (raw) => {
    if (raw === null || raw === undefined || raw === '') return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : raw;
};

const extractId = (entity) => {
    const raw =
        entity?.id ??
        entity?.lesson_id ??
        entity?.ability_lesson_id ??
        entity?.course_lesson_id ??
        entity?.ability_id ??
        entity?.user_id ??
        entity?.pk ??
        null;
    return normalizeEntityId(raw);
};

const extractAbilityEntityId = (ability) => {
    const raw =
        ability?.id ??
        ability?.ability_id ??
        ability?.abilityId ??
        ability?.course_id ??
        ability?.courseId ??
        ability?.course?.id ??
        ability?.course?.pk ??
        null;
    return normalizeEntityId(raw);
};

const extractAuthorId = (ability) => {
    return (
        ability?.author_id ??
        ability?.authorId ??
        ability?.author?.id ??
        ability?.author?.pk ??
        ability?.owner_id ??
        null
    );
};

const resolveAuthorLabel = (ability) => {
    return (
        ability?.author?.username ??
        ability?.author_username ??
        ability?.author_name ??
        ability?.author ??
        ability?.author_id ??
        ability?.owner_id ??
        'не указан'
    );
};

const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const formatSavedTime = (value) => {
    if (!value) return 'Нет информации о сохранении';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Сохранено';

    return `Сохранено в ${new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)}`;
};

const normalizePublicationStatus = (value) => {
    return String(value || '').trim().toLowerCase() === 'published' ? 'published' : 'draft';
};

const normalizeLearningStatus = (value) => {
    return String(value || '').trim().toLowerCase();
};

const isLearningStartedStatus = (value) => {
    const normalizedValue = normalizeLearningStatus(value);
    return (
        normalizedValue === 'started' ||
        normalizedValue === 'in_progress' ||
        normalizedValue === 'in-progress' ||
        normalizedValue === 'active'
    );
};

const mapServerLesson = (lesson, index) => {
    return {
        localId: nextLocalLessonId(),
        id: extractId(lesson),
        title: lesson?.title || `Урок ${index + 1}`,
        body: normalizeEditorContent(lesson?.body ?? lesson?.content),
        updatedAt: lesson?.updated_at || lesson?.updatedAt || lesson?.created_at || null,
    };
};

const mapResolvedLesson = (lesson, index) => {
    return mapServerLesson({
        ...lesson,
        id:
            lesson?.id ??
            lesson?.lesson_id ??
            lesson?.ability_lesson_id ??
            lesson?.course_lesson_id,
        title:
            lesson?.title ??
            lesson?.name ??
            lesson?.lesson_title ??
            lesson?.heading,
        body:
            lesson?.body ??
            lesson?.content ??
            lesson?.lesson_body ??
            lesson?.text ??
            lesson?.description,
    }, index);
};

const extractAbilityLessons = (ability) => {
    if (!ability || typeof ability !== 'object') return [];
    return normalizeLessonsPayload(
        ability?.lessons ??
        ability?.course_lessons ??
        ability?.ability_lessons ??
        ability?.lesson_set ??
        ability?.modules ??
        ability,
    );
};

const normalizeStartedAbilitiesPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

const extractStartedAbilityId = (entity) => {
    if (entity === null || entity === undefined) return null;

    if (typeof entity === 'number' || typeof entity === 'string') {
        return normalizeEntityId(entity);
    }

    if (typeof entity !== 'object') return null;

    return normalizeEntityId(
        entity?.course?.id ??
        entity?.ability?.id ??
        entity?.course_id ??
        entity?.ability_id ??
        entity?.id ??
        null,
    );
};


const AbilityView2 = () => {
    const navigate = useNavigate();
    const { abilityId: abilityIdParam } = useParams();
    const parsedAbilityId = Number(abilityIdParam);
    const abilityId = Number.isFinite(parsedAbilityId) && parsedAbilityId > 0 ? parsedAbilityId : null;
    const lessonsSectionRef = React.useRef(null);

    const {
        data: abilityResponse,
        isLoading: isAbilityLoading,
        error: abilityError,
    } = useAbilityDetail(abilityId);

    const ability = React.useMemo(() => normalizeAbilityPayload(abilityResponse), [abilityResponse]);
    const resolvedAbilityId = React.useMemo(() => extractAbilityEntityId(ability), [ability]);
    const fallbackLessonsAbilityId = React.useMemo(() => {
        if (!abilityId || resolvedAbilityId === null || String(resolvedAbilityId) === String(abilityId)) {
            return null;
        }
        return resolvedAbilityId;
    }, [abilityId, resolvedAbilityId]);

    const {
        data: primaryLessonsResponse,
        isLoading: isPrimaryLessonsLoading,
        isError: isPrimaryLessonsError,
        error: primaryLessonsError,
    } = useAbilityLessons(abilityId);

    const {
        data: fallbackLessonsResponse,
        isLoading: isFallbackLessonsLoading,
        isError: isFallbackLessonsError,
        error: fallbackLessonsError,
    } = useAbilityLessons(fallbackLessonsAbilityId);

    const updateAbilityMutation = useUpdateAbility();
    const startAbilityMutation = useStartAbility();
    const { data: me } = useMe();
    const { data: startedAbilitiesResponse } = useMyStartedAbilities({ enabled: Boolean(me) });
    const [publicationActionError, setPublicationActionError] = React.useState('');
    const [learningActionError, setLearningActionError] = React.useState('');

    const primaryLessons = React.useMemo(() => normalizeLessonsPayload(primaryLessonsResponse), [primaryLessonsResponse]);
    const fallbackLessons = React.useMemo(() => normalizeLessonsPayload(fallbackLessonsResponse), [fallbackLessonsResponse]);
    const shouldUseFallbackLessons = Boolean(fallbackLessonsAbilityId) && !primaryLessons.length;
    const selectedLessonsFromEndpoint = shouldUseFallbackLessons ? fallbackLessons : primaryLessons;
    const selectedLessonsEndpointId = shouldUseFallbackLessons && fallbackLessonsAbilityId
        ? fallbackLessonsAbilityId
        : abilityId;
    const isLessonsLoading = isPrimaryLessonsLoading || (shouldUseFallbackLessons && isFallbackLessonsLoading);
    const isLessonsError = selectedLessonsFromEndpoint.length === 0 && (
        shouldUseFallbackLessons
            ? isPrimaryLessonsError && isFallbackLessonsError
            : isPrimaryLessonsError
    );
    const lessonsError = shouldUseFallbackLessons
        ? (fallbackLessonsError || primaryLessonsError)
        : primaryLessonsError;

    const lessons = React.useMemo(() => {
        const sourceLessons = selectedLessonsFromEndpoint.length
            ? selectedLessonsFromEndpoint
            : extractAbilityLessons(ability);
        return sourceLessons.map(mapResolvedLesson);
    }, [ability, selectedLessonsFromEndpoint]);

    const [activeLessonLocalId, setActiveLessonLocalId] = React.useState(null);

    React.useEffect(() => {
        if (!lessons.length) {
            setActiveLessonLocalId(null);
            return;
        }

        if (lessons.some((lesson) => lesson.localId === activeLessonLocalId)) return;
        setActiveLessonLocalId(lessons[0].localId);
    }, [activeLessonLocalId, lessons]);

    const activeLesson = React.useMemo(() => {
        return lessons.find((lesson) => lesson.localId === activeLessonLocalId) || lessons[0] || null;
    }, [activeLessonLocalId, lessons]);

    const activeLessonIndex = React.useMemo(() => {
        return lessons.findIndex((lesson) => lesson.localId === activeLesson?.localId);
    }, [activeLesson, lessons]);

    const activeLessonId = extractId(activeLesson);

    const {
        data: activeLessonResponse,
        error: activeLessonError,
    } = useAbilityLessonDetail({
        courseId: selectedLessonsEndpointId,
        lessonId: activeLessonId,
    });

    const activeLessonDetail = React.useMemo(() => {
        return normalizeLessonPayload(activeLessonResponse);
    }, [activeLessonResponse]);

    const activeLessonContent = React.useMemo(() => {
        return normalizeEditorContent(
            activeLessonDetail?.body ??
            activeLessonDetail?.content ??
            activeLesson?.body,
        );
    }, [activeLesson?.body, activeLessonDetail]);

    const activeLessonUpdatedAt = React.useMemo(() => {
        return (
            activeLessonDetail?.updated_at ||
            activeLessonDetail?.updatedAt ||
            activeLessonDetail?.created_at ||
            activeLesson?.updatedAt ||
            null
        );
    }, [activeLesson?.updatedAt, activeLessonDetail]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: activeLessonContent,
        editable: false,
        editorProps: {
            attributes: {
                class: styles.editorSurface,
            },
        },
    });

    React.useEffect(() => {
        if (!editor || !activeLesson) return;

        const nextContent = activeLessonContent;

        if (typeof nextContent === 'string') {
            if (editor.getHTML() !== nextContent) {
                editor.commands.setContent(nextContent, false);
            }
            return;
        }

        if (!docsEqual(editor.getJSON(), nextContent)) {
            editor.commands.setContent(nextContent, false);
        }
    }, [activeLesson, activeLessonContent, editor]);

    const isAuthError = [abilityError, lessonsError, activeLessonError].some((error) => {
        return error?.response?.status === 401 || error?.response?.status === 403;
    });

    const abilityAuthorId = extractAuthorId(ability);
    const viewerId = extractId(me);
    const isAuthor = Boolean(
        ability?.is_author === true ||
        (viewerId !== null && viewerId !== undefined && String(viewerId) === String(abilityAuthorId)),
    );
    const publicationStatus = normalizePublicationStatus(ability?.status);
    const learningStatusFromAbility =
        ability?.learning_status ??
        ability?.user_status ??
        ability?.progress_status ??
        ability?.status;
    const targetAbilityId = resolvedAbilityId ?? abilityId;
    const startedAbilityIds = React.useMemo(() => {
        const ids = new Set();
        normalizeStartedAbilitiesPayload(startedAbilitiesResponse).forEach((entity) => {
            const id = extractStartedAbilityId(entity);
            if (id === null || id === undefined || id === '') return;
            ids.add(String(id));
        });
        return ids;
    }, [startedAbilitiesResponse]);
    const isStartedFromStartedList =
        targetAbilityId !== null &&
        targetAbilityId !== undefined &&
        startedAbilityIds.has(String(targetAbilityId));
    const isLearningStarted = isLearningStartedStatus(learningStatusFromAbility) || isStartedFromStartedList;
    const abilityTitle = ability?.title || `Ability #${abilityId}`;
    const abilityDescription =
        ability?.description ||
        ability?.summary ||
        ability?.short_description ||
        'Описание пока не добавлено.';

    const pageErrorMessage =
        abilityError?.response?.data?.detail ||
        lessonsError?.response?.data?.detail ||
        abilityError?.message ||
        lessonsError?.message ||
        'Не удалось загрузить Ability.';

    const handleStartLearning = React.useCallback(async () => {
        const firstLesson = lessons[0];
        if (!firstLesson) return;
        setLearningActionError('');

        if (!isLearningStarted) {
            if (!targetAbilityId) return;

            try {
                await startAbilityMutation.mutateAsync(targetAbilityId);
            } catch (error) {
                const message =
                    error?.response?.data?.detail ||
                    error?.response?.data?.non_field_errors?.[0] ||
                    error?.message ||
                    'Не удалось начать курс.';
                setLearningActionError(message);
                return;
            }
        }

        setActiveLessonLocalId(firstLesson.localId);
        window.requestAnimationFrame(() => {
            lessonsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [isLearningStarted, lessons, startAbilityMutation, targetAbilityId]);

    const handleUnpublishAbility = React.useCallback(async () => {
        const targetAbilityId = resolvedAbilityId ?? abilityId;
        if (!targetAbilityId || !isAuthor || publicationStatus !== 'published') return;

        const isConfirmed = window.confirm('Снять курс с публикации?');
        if (!isConfirmed) return;

        try {
            setPublicationActionError('');
            await updateAbilityMutation.mutateAsync({
                abilityId: targetAbilityId,
                payload: { status: 'draft' },
            });
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось снять курс с публикации.';
            setPublicationActionError(message);
        }
    }, [abilityId, isAuthor, publicationStatus, resolvedAbilityId, updateAbilityMutation]);

    if (!abilityId) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>Некорректный ID Ability.</div>
            </div>
        );
    }

    if (isAuthError) {
        return <SignForm />;
    }

    if ((isAbilityLoading || isLessonsLoading) && !lessons.length) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>Загрузка Ability...</div>
            </div>
        );
    }

    if (isLessonsError && !lessons.length) {
        return (
            <div className={styles.page}>
                <div className={styles.stateCard}>{pageErrorMessage}</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.hero}>
                    <div className={styles.heroTop}>
                        <span
                            className={`${styles.publicationBadge} ${
                                publicationStatus === 'published' ? styles.publicationBadgePublished : styles.publicationBadgeDraft
                            }`}
                        >
                            {publicationStatus}
                        </span>
                        <AbilityStatusBadge status={ability?.status} />
                    </div>

                    <h1 className={styles.title}>{abilityTitle}</h1>
                    <p className={styles.subtitle}>{abilityDescription}</p>

                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>ID: {ability?.id ?? abilityId}</span>
                        <span className={styles.metaItem}>Автор: {resolveAuthorLabel(ability)}</span>
                        <span className={styles.metaItem}>Уроков: {lessons.length}</span>
                        <span className={styles.metaItem}>Создано: {formatDateTime(ability?.created_at)}</span>
                        <span className={styles.metaItem}>Обновлено: {formatDateTime(ability?.updated_at)}</span>
                    </div>

                    <div className={styles.heroActions}>
                        <MainBtn type="button" onClick={() => navigate(-1)}>Назад</MainBtn>
                        {isAuthor ? (
                            <>
                                <MainBtn
                                    type="button"
                                    onClick={() => navigate(`/abilities/my/create?abilityId=${resolvedAbilityId ?? abilityId}`)}
                                >
                                    Редактировать
                                </MainBtn>
                                {publicationStatus === 'published' ? (
                                    <button
                                        type="button"
                                        className={styles.unpublishButton}
                                        onClick={handleUnpublishAbility}
                                        disabled={updateAbilityMutation.isPending}
                                    >
                                        {updateAbilityMutation.isPending
                                            ? 'Снимаем с публикации...'
                                            : 'Снять с публикации'}
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <button
                                type="button"
                                className={styles.startButton}
                                onClick={handleStartLearning}
                                disabled={!lessons.length || (!isLearningStarted && startAbilityMutation.isPending)}
                            >
                                {startAbilityMutation.isPending && !isLearningStarted
                                    ? 'Начинаем курс...'
                                    : (isLearningStarted ? 'Закончить курс' : 'Начать изучать')}
                            </button>
                        )}
                    </div>
                    {publicationActionError ? <div className={styles.errorText}>{publicationActionError}</div> : null}
                    {learningActionError ? <div className={styles.errorText}>{learningActionError}</div> : null}
                </header>

                <section className={styles.lessonCard} ref={lessonsSectionRef}>
                    <div className={styles.tabsBar} role="tablist" aria-label="Уроки Ability">
                        {lessons.map((lesson, index) => (
                            <button
                                key={lesson.localId}
                                type="button"
                                role="tab"
                                aria-selected={lesson.localId === activeLessonLocalId}
                                className={`${styles.lessonTab} ${
                                    lesson.localId === activeLessonLocalId ? styles.lessonTabActive : ''
                                }`}
                                onClick={() => setActiveLessonLocalId(lesson.localId)}
                            >
                                {lesson.title?.trim() || `Урок ${index + 1}`}
                            </button>
                        ))}
                    </div>

                    {!lessons.length ? (
                        <div className={styles.emptyState}>
                            Для этой Ability пока нет уроков.
                        </div>
                    ) : null}

                    {activeLesson ? (
                        <div className={styles.editorBlock}>
                            <div className={styles.editorTopRow}>
                                <h2 className={styles.lessonTitle}>{activeLesson.title}</h2>
                                <span className={styles.readonlyMark}>Только просмотр</span>
                            </div>

                            <EditorContent editor={editor} />

                            <div className={styles.statusRow}>
                                <span className={styles.statusText}>
                                    Урок {Math.max(activeLessonIndex + 1, 1)} из {lessons.length}
                                </span>
                                <span className={styles.statusText}>{formatSavedTime(activeLessonUpdatedAt)}</span>
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
};

export default AbilityView2;
