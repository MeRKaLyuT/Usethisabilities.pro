import React from 'react';
import * as styles from './abilityFieldItem.module.css';

const AbilityFieldItem = ({ label, value }) => {
    const displayValue = (value === null) || (value === undefined) || (value === '' ? '-' : String(value));

    return (
        <div className={styles.item}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value} title={displayValue}>{displayValue}</span>
        </div>
    );
};

export default AbilityFieldItem;
