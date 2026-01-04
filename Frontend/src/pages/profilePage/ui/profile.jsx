import React, { useState, useEffect } from 'react';
import * as styles from './profile.module.css';
import { useLogin } from '../../../features/auth/hooks/useLogin.js';
import { useLogout } from '../../../features/auth/hooks/useLogout.js';
import { useMe } from '../../../features/auth/hooks/useMe.js';
import { SignForm } from '../../../widgets/signform/index.jsx';


const Profile = () => {
    const { mutate: doLogout, isPending: isLogoutPending} = useLogout();
    const { data: me, isLoading, isFetching} = useMe();

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (!me) {
        return (
            <div className={styles.main}>
                <div>
                    <SignForm />
                </div>
            </div>
        );
    }
    if (me) {
        return (
            <div className={styles.main}>
                <h1>{me.email}</h1>
                <button onClick={() => doLogout()} disabled={isLogoutPending}>Logout</button>
            </div>
        )
    }
}

export default Profile;
