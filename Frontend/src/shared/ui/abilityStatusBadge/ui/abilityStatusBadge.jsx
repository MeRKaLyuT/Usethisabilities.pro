import React from 'react';
import * as styles from './abilityStatusBadge.module.css';

const getVariantClassName = (status) => {
    if (status === 'published' || status === 'active' || status === 'approved' || status === 'completed') {
        return styles.success;
    }
    if (
        status === 'draft' ||
        status === 'pending' ||
        status === 'review' ||
        status === 'started' ||
        status === 'in_progress' ||
        status === 'in-progress'
    ) {
        return styles.warning;
    }
    return styles.neutral;
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
    unknown: 'Неизвестно',
};

const AbilityStatusBadge = ({ status }) => {
    const normalizedStatus = typeof status === 'string' && status.trim()
        ? status.trim().toLowerCase()
        : 'unknown';
    const variantClassName = getVariantClassName(normalizedStatus);
    const displayStatus = statusLabels[normalizedStatus] || status || statusLabels.unknown;

    return (
        <span className={`${styles.badge} ${variantClassName}`}>
            {displayStatus}
        </span>
    );
};

export default AbilityStatusBadge;
