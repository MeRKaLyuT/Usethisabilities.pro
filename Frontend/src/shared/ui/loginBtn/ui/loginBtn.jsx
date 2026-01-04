import React from "react";
import * as styles from './loginBtn.module.css';


const LoginBtn = ({children, onClick, disabled}) => {
    return (
        <button onClick={onClick} disabled={disabled} className={styles.main} type="submit">
            {children}
        </button>
    )
}

export default LoginBtn;