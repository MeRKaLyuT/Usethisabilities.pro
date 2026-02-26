import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as styles from './abilities2.module.css';
import { useAbilitiesCatalog } from '../../../features/abilities/hooks/useAbilitiesCatalog.js';
import { SignForm } from '../../../widgets/signform/index.jsx';
import { AbilityStatusBadge } from '../../../shared/ui/abilityStatusBadge/index.js';

const normalizeAbilitiesPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

const resolveAuthorLabel = (ability) => {
    return (
        ability?.author?.username ??
        ability?.author_username ??
        ability?.author_name ??
        ability?.author_id ??
        'не указан'
    );
};

const matchesSearch = (ability, value) => {
    if (!value) return true;
    const normalizedSearch = value.toLowerCase();
    const fields = [
        ability?.title,
        ability?.description,
        resolveAuthorLabel(ability),
    ];

    return fields.some((field) => String(field || '').toLowerCase().includes(normalizedSearch));
};

const getPrefillSearch = (state) => {
    if (typeof state?.prefillSearch !== 'string') return '';
    return state.prefillSearch.trim();
};

const Abilities2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchValue, setSearchValue] = React.useState(() => getPrefillSearch(location.state));
    const [sortBy, setSortBy] = React.useState('date');

    const {
        data,
        isLoading,
        isError,
        error,
    } = useAbilitiesCatalog({ status: 'published' });

    const abilities = React.useMemo(() => normalizeAbilitiesPayload(data), [data]);
    const isAuthError = error?.response?.status === 401 || error?.response?.status === 403;

    React.useEffect(() => {
        const nextValue = getPrefillSearch(location.state);
        if (nextValue) {
            setSearchValue(nextValue);
        }
    }, [location.state]);

    const visibleAbilities = React.useMemo(() => {
        const filtered = abilities.filter((ability) => matchesSearch(ability, searchValue));
        const sorted = [...filtered];

        sorted.sort((firstAbility, secondAbility) => {
            if (sortBy === 'name') {
                return String(firstAbility?.title || '').localeCompare(String(secondAbility?.title || ''), 'ru');
            }

            const secondDate = new Date(secondAbility?.updated_at || secondAbility?.created_at || 0).getTime();
            const firstDate = new Date(firstAbility?.updated_at || firstAbility?.created_at || 0).getTime();
            return secondDate - firstDate;
        });

        return sorted;
    }, [abilities, searchValue, sortBy]);

    if (isLoading) {
        return <div className={styles.stateCard}>Загрузка Abilities...</div>;
    }

    if (isAuthError) {
        return <SignForm />;
    }

    if (isError) {
        return (
            <div className={styles.stateCard}>
                Не удалось загрузить каталог Ability. Обнови страницу и попробуй снова.
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.slogan}>Здесь ты найдешь то, что нужно</h1>
                        <button
                            className={styles.createAbilityBtn}
                            type="button"
                            onClick={() => navigate('/abilities/my/')}
                        >
                            Создай Ability!
                        </button>
                    </div>
                    <div className={styles.searchRow}>
                        <input
                            className={styles.searchInput}
                            type="search"
                            placeholder="Поиск по Ability или автору"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                        <select
                            className={styles.filterSelect}
                            aria-label="Фильтр"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                        >
                            <option value="date">По дате</option>
                            <option value="name">По названию</option>
                        </select>
                    </div>
                </header>

                <section className={styles.abilities}>
                    {!visibleAbilities.length ? (
                        <div className={styles.emptyState}>По этому фильтру пока ничего не найдено.</div>
                    ) : null}

                    <div className={styles.abilityGrid}>
                        {visibleAbilities.map((ability, index) => (
                            <article key={ability?.id ?? `ability-${index}`} className={styles.abilityCard}>
                                <div className={styles.cardTopRow}>
                                    <span className={styles.cardMetaChip}>ID: {ability?.id ?? '-'}</span>
                                    <AbilityStatusBadge status={ability?.status ?? 'published'} />
                                </div>

                                <h2 className={styles.abilityTitle}>
                                    {ability?.title || `Ability #${ability?.id ?? index + 1}`}
                                </h2>
                                <p className={styles.abilityText}>
                                    {ability?.description || ability?.summary || 'Описание пока не добавлено.'}
                                </p>

                                <div className={styles.cardMetaRow}>
                                    <span className={styles.cardMetaChip}>Автор: {resolveAuthorLabel(ability)}</span>
                                    <span className={styles.cardMetaChip}>
                                        Обновлено: {formatDate(ability?.updated_at || ability?.created_at)}
                                    </span>
                                </div>

                                <button
                                    className={styles.abilityBtn}
                                    type="button"
                                    onClick={() => navigate(`/abilities/${ability?.id}`)}
                                    disabled={!ability?.id}
                                >
                                    Открыть Ability
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Abilities2;
