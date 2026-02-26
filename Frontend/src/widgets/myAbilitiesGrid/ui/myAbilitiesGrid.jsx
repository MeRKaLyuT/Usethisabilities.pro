import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './myAbilitiesGrid.module.css';
import { AbilityFieldItem } from '../../../shared/ui/abilityFieldItem/index.js';
import { AbilityStatusBadge } from '../../../shared/ui/abilityStatusBadge/index.js';
import { useDeleteAbility } from '../../../features/abilities/hooks/useDeleteAbility.js';

const normalizeAbilitiesPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
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

const AbilityCard = ({ ability, index, onOpen, onDelete, isDeleting }) => {
    const title = ability?.title || `Ability #${ability?.id ?? index + 1}`;
    const fields = [
        { label: 'ID', value: ability?.id },
        { label: 'Название', value: ability?.title },
        { label: 'Автор', value: ability?.author_id },
        { label: 'Статус', value: formatStatus(ability?.status) },
        { label: 'Создан', value: formatDateTime(ability?.created_at) },
        { label: 'Обновлен', value: formatDateTime(ability?.updated_at) },
    ];

    return (
        <article className={styles.card} style={{ animationDelay: `${Math.min(index * 70, 280)}ms` }}>
            <header className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{title}</h2>
                <AbilityStatusBadge status={ability?.status} />
            </header>

            <div className={styles.fields}>
                {fields.map((field) => (
                    <AbilityFieldItem
                        key={`${ability?.id ?? index}-${field.label}`}
                        label={field.label}
                        value={field.value}
                    />
                ))}
            </div>

            <div className={styles.cardActions}>
                <div className={styles.actionGroup}>
                    <button
                        type="button"
                        className={styles.openButton}
                        onClick={() => onOpen(ability?.id)}
                        disabled={!ability?.id || isDeleting}
                    >
                        Открыть Ability
                    </button>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => onDelete(ability)}
                        disabled={!ability?.id || isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </button>
                </div>
            </div>
        </article>
    );
};

const MyAbilitiesGrid = ({ data }) => {
    const navigate = useNavigate();
    const abilities = React.useMemo(() => normalizeAbilitiesPayload(data), [data]);
    const deleteAbilityMutation = useDeleteAbility();
    const [deleteError, setDeleteError] = React.useState('');

    const handleOpenAbility = React.useCallback((abilityId) => {
        if (!abilityId) return;
        navigate(`/abilities/${abilityId}`);
    }, [navigate]);

    const handleDeleteAbility = React.useCallback(async (ability) => {
        const abilityId = ability?.id;
        if (!abilityId) return;

        const abilityTitle = ability?.title?.trim() || `Ability #${abilityId}`;
        const isConfirmed = window.confirm(
            `Удалить "${abilityTitle}"? Это действие необратимо.`,
        );

        if (!isConfirmed) return;

        try {
            setDeleteError('');
            await deleteAbilityMutation.mutateAsync(abilityId);
        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors?.[0] ||
                error?.message ||
                'Не удалось удалить Ability.';
            setDeleteError(message);
        }
    }, [deleteAbilityMutation]);

    if (!abilities.length) {
        return (
            <div className={styles.stateCard}>
                Пока здесь пусто. Как только добавишь Ability, он появится на этой странице.
            </div>
        );
    }

    const gridClassName = abilities.length === 1
        ? `${styles.grid} ${styles.gridSingle}`
        : styles.grid;

    return (
        <section className={styles.section}>
            {deleteError ? <div className={styles.errorText}>{deleteError}</div> : null}
            <div className={gridClassName}>
                {abilities.map((ability, index) => (
                    <AbilityCard
                        key={ability?.id ?? `ability-${index}`}
                        ability={ability}
                        index={index}
                        onOpen={handleOpenAbility}
                        onDelete={handleDeleteAbility}
                        isDeleting={
                            deleteAbilityMutation.isPending &&
                            String(deleteAbilityMutation.variables) === String(ability?.id)
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default MyAbilitiesGrid;
