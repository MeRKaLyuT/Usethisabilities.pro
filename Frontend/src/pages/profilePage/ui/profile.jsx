import React, { useState, useEffect } from 'react';
import * as styles from './profile.module.css';
import { useLogout } from '../../../features/auth/hooks/useLogout.js';
import { useMe } from '../../../features/auth/hooks/useMe.js';
import { SignForm } from '../../../widgets/signform/index.jsx';


const Profile = () => {
    const { mutate: doLogout, isPending: isLogoutPending} = useLogout();
    const { data: me, isLoading, isFetching, isError} = useMe();

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>
    }
    if (!me || isError) {
        return (
            <div className={styles.main}>
                <SignForm />
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
