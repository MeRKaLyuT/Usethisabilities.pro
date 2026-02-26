import React from "react";
import { Link } from "react-router-dom";
import * as styles from './mainBtn.module.css';

const MainBtn = ({children, type="button", ...rest}) => {
    return (
        <button className={styles.createButton} type={type} {...rest}>
            {children}
        </button>
    )
}

export default MainBtn;