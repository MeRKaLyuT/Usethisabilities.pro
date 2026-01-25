import React, { useState, useEffect } from 'react';
import * as styles from './profile.module.css';
import { useLogout } from '../../../features/auth/hooks/useLogout.js';
import { useMe } from '../../../features/auth/hooks/useMe.js';
import { SignForm } from '../../../widgets/signform/index.jsx';
import { LoginBtn } from '../../../shared/ui/loginBtn/index.jsx';


const Profile = () => {
    const { mutate: doLogout, isPending: isLogoutPending} = useLogout();
    const { data: me, isLoading, isFetching, isError} = useMe();

    if (isLoading) return <div className={styles.loading}>Loading...</div>
    if (!me || isError) return <SignForm />
    if (me) {
        return (
            <div className={styles.main}>
                <div className={styles.info}>
                    <h1>{me.email}</h1>
                </div>
                <button onClick={() => doLogout()} disabled={isLogoutPending} className={styles.logoutbtn}>Logout</button>
            </div>
        )
    }
}

export default Profile;
