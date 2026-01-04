import React from "react";
import * as styles from './notregisteredyet.module.css';

const NotRegisteredYed = ({children, onClick}) => {
    return (
        <div className={styles.notregisteredyet}>
            <a onClick={onClick}>{children}</a>
        </div>
    )
}

export default NotRegisteredYed;