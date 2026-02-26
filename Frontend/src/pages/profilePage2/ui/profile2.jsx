import React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './profile2.module.css';
import { useProfile } from '../../../features/auth/hooks/useProfile.js';
import { useMyAbilities } from '../../../features/abilities/hooks/useMyAbilities.js';
import { useMyStartedAbilities } from '../../../features/abilities/hooks/useMyStartedAbilities.js';
import { useLogout } from '../../../features/auth/hooks/useLogout.js';
import { SignForm } from '../../../widgets/signform/index.jsx';

const tabs = [
    { id: 'personal', label: 'Личные данные' },
    { id: 'authorship', label: 'Авторство' },
    { id: 'started', label: 'Начатые Abilities' },
];

const normalizeListPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

const normalizeAuthoredAbilitiesPayload = (payload) => {
    if (Array.isArray(payload?.authored_abilities)) return payload.authored_abilities;
    if (Array.isArray(payload?.created_abilities)) return payload.created_abilities;
    if (Array.isArray(payload?.my_abilities)) return payload.my_abilities;
    if (Array.isArray(payload?.abilities)) return payload.abilities;
    if (Array.isArray(payload?.courses)) return payload.courses;
    if (Array.isArray(payload?.data?.authored_abilities)) return payload.data.authored_abilities;
    if (Array.isArray(payload?.data?.created_abilities)) return payload.data.created_abilities;
    if (Array.isArray(payload?.data?.my_abilities)) return payload.data.my_abilities;
    if (Array.isArray(payload?.data?.abilities)) return payload.data.abilities;
    if (Array.isArray(payload?.data?.courses)) return payload.data.courses;
    return normalizeListPayload(payload);
};

const normalizeStartedAbilityEntity = (entity) => {
    if (entity === null || entity === undefined) return null;

    if (typeof entity === 'number' || typeof entity === 'string') {
        return { id: entity, title: `Ability #${entity}`, status: 'started' };
    }

    if (typeof entity !== 'object') return null;

    const nestedAbility =
        (entity?.course && typeof entity.course === 'object' ? entity.course : null) ||
        (entity?.ability && typeof entity.ability === 'object' ? entity.ability : null) ||
        (entity?.course_data && typeof entity.course_data === 'object' ? entity.course_data : null) ||
        (entity?.ability_data && typeof entity.ability_data === 'object' ? entity.ability_data : null);

    const id =
        nestedAbility?.id ??
        nestedAbility?.course_id ??
        nestedAbility?.ability_id ??
        entity?.course_id ??
        entity?.ability_id ??
        entity?.id ??
        null;

    if (id === null || id === undefined || id === '') return null;

    return {
        ...nestedAbility,
        ...entity,
        id,
        title:
            nestedAbility?.title ??
            nestedAbility?.name ??
            entity?.title ??
            entity?.course_title ??
            entity?.ability_title ??
            `Ability #${id}`,
        status:
            entity?.status ??
            entity?.study_status ??
            entity?.learning_status ??
            entity?.progress_status ??
            nestedAbility?.status ??
            'started',
        updated_at:
            nestedAbility?.updated_at ??
            entity?.updated_at ??
            nestedAbility?.created_at ??
            entity?.created_at ??
            null,
    };
};

const dedupeAbilities = (list = []) => {
    const uniqueList = [];
    const seen = new Set();

    list.forEach((ability, index) => {
        if (!ability || typeof ability !== 'object') return;
        const key = String(
            ability?.id ??
            ability?.ability_id ??
            ability?.course_id ??
            `idx-${index}`,
        );
        if (seen.has(key)) return;
        seen.add(key);
        uniqueList.push(ability);
    });

    return uniqueList;
};

const normalizeStartedAbilitiesPayload = (payload) => {
    const sourceList = normalizeListPayload(payload);
    return dedupeAbilities(sourceList.map(normalizeStartedAbilityEntity).filter(Boolean));
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
};

const statusLabels = {
    published: 'Опубликован',
    active: 'Активен',
    approved: 'Одобрен',
    completed: 'Завершен',
    draft: 'Черновик',
    pending: 'Ожидает',
    review: 'На ревью',
    started: 'Начат',
    in_progress: 'В процессе',
    'in-progress': 'В процессе',
    archived: 'В архиве',
    rejected: 'Отклонен',
};

const formatStatus = (value) => {
    if (!value) return '-';
    const normalizedValue = String(value).trim().toLowerCase();
    return statusLabels[normalizedValue] || String(value);
};

const Profile2 = () => {
    const [activeTab, setActiveTab] = React.useState('personal');

    const { data: me, isLoading, isFetching, isError } = useProfile();
    const canLoadAbilities = Boolean(me);
    const {
        data: authoredResponse,
        isLoading: isAuthoredLoading,
        isFetching: isAuthoredFetching,
        isError: isAuthoredError,
    } = useMyAbilities({ enabled: canLoadAbilities });
    const {
        data: startedResponse,
        isLoading: isStartedLoading,
        isFetching: isStartedFetching,
        isError: isStartedError,
    } = useMyStartedAbilities({ enabled: canLoadAbilities });
    const { mutate: doLogout, isPending: isLogoutPending } = useLogout();

    const authoredAbilities = React.useMemo(() => {
        return normalizeAuthoredAbilitiesPayload(authoredResponse);
    }, [authoredResponse]);

    const startedAbilities = React.useMemo(() => {
        return normalizeStartedAbilitiesPayload(startedResponse);
    }, [startedResponse]);

    if (isLoading || isFetching) return <div className={styles.loading}>Загрузка...</div>;
    if (!me || isError) return <SignForm />;

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.avatar} aria-hidden="true">
                        <span className={styles.avatarLabel}>Аватар</span>
                    </div>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>Профиль</h1>
                        <p className={styles.subtitle}>Управляйте аккаунтом и Abilities</p>
                    </div>
                </header>

                <div className={styles.topActions}>
                    <Link className={styles.authorPageBtn} to="/abilities/my/">
                        Страница автора
                    </Link>
                    <button
                        type="button"
                        onClick={() => doLogout()}
                        className={styles.logoutBtn}
                        disabled={isLogoutPending}
                    >
                        {isLogoutPending ? 'Выход...' : 'Выйти'}
                    </button>
                </div>

                <div className={styles.tabs} role="tablist" aria-label="Разделы профиля">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'personal' && (
                    <section className={styles.panel} role="tabpanel">
                        <h2 className={styles.panelTitle}>Личные данные</h2>
                        <div className={styles.fields}>
                            <label className={styles.field}>
                                <span className={styles.label}>Имя пользователя</span>
                                <input className={styles.input} type="text" value={me.username || ''} readOnly />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Электронная почта</span>
                                <input className={styles.input} type="email" value={me.email || ''} readOnly />
                            </label>

                            <label className={`${styles.field} ${styles.fieldWide}`}>
                                <span className={styles.label}>О себе</span>
                                <textarea
                                    className={styles.textarea}
                                    rows={4}
                                    value={me.bio || 'Пока нет био'}
                                    readOnly
                                />
                            </label>
                        </div>
                    </section>
                )}

                {activeTab === 'authorship' && (
                    <section className={styles.panel} role="tabpanel">
                        <h2 className={styles.panelTitle}>Авторство</h2>
                        <p className={styles.panelLead}>Все созданные вами Abilities.</p>
                        {isAuthoredLoading || isAuthoredFetching ? (
                            <p className={styles.stateText}>Загрузка Abilities...</p>
                        ) : null}
                        {isAuthoredError ? (
                            <p className={styles.stateText}>Не удалось загрузить Abilities.</p>
                        ) : null}
                        {!isAuthoredLoading && !isAuthoredFetching && !isAuthoredError && authoredAbilities.length === 0 ? (
                            <p className={styles.stateText}>Пока нет созданных Abilities.</p>
                        ) : null}
                        {!isAuthoredLoading && !isAuthoredFetching && !isAuthoredError && authoredAbilities.length > 0 ? (
                            <ul className={styles.abilitiesList}>
                                {authoredAbilities.map((ability, index) => (
                                    <li key={ability?.id ?? `author-${index}`} className={styles.abilityItem}>
                                        <span className={styles.abilityLine}><b>ID:</b> {ability?.id ?? '-'}</span>
                                        <span className={styles.abilityLine}><b>Название:</b> {ability?.title || '-'}</span>
                                        <span className={styles.abilityLine}><b>Обновлено:</b> {formatDate(ability?.updated_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                )}

                {activeTab === 'started' && (
                    <section className={styles.panel} role="tabpanel">
                        <h2 className={styles.panelTitle}>Начатые Abilities</h2>
                        <p className={styles.panelLead}>Abilities, которые сейчас в процессе.</p>
                        {isStartedLoading || isStartedFetching ? (
                            <p className={styles.stateText}>Загрузка Abilities...</p>
                        ) : null}
                        {isStartedError ? (
                            <p className={styles.stateText}>Не удалось загрузить начатые Abilities.</p>
                        ) : null}
                        {!isStartedLoading && !isStartedFetching && !isStartedError && startedAbilities.length === 0 ? (
                            <p className={styles.stateText}>Пока нет начатых Abilities.</p>
                        ) : null}
                        {!isStartedLoading && !isStartedFetching && !isStartedError && startedAbilities.length > 0 ? (
                            <ul className={styles.abilitiesList}>
                                {startedAbilities.map((ability, index) => (
                                    <li key={ability?.id ?? `started-${index}`} className={styles.abilityItem}>
                                        <span className={styles.abilityLine}><b>ID:</b> {ability?.id ?? '-'}</span>
                                        <span className={styles.abilityLine}><b>Название:</b> {ability?.title || '-'}</span>
                                        <span className={styles.abilityLine}><b>Статус:</b> {formatStatus(ability?.status)}</span>
                                        <span className={styles.abilityLine}><b>Обновлено:</b> {formatDate(ability?.updated_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </section>
                )}
            </div>
        </div>
    );
};

export default Profile2;
