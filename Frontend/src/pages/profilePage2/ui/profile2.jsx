import React from 'react';
import * as styles from './profile2.module.css';
import { useMe } from '../../../features/auth/hooks/useMe.js';
import { SignForm } from '../../../widgets/signform/index.jsx';

const Profile2 = () => {
    const { data: me, isLoading, isFetching, isError} = useMe();

    if (isLoading) return <div className={styles.loading}>Loading...</div>
    if (!me || isError) return <SignForm />
    if (me) return (
        <div className={styles.page}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.avatar} aria-hidden="true">
                        <span className={styles.avatarLabel}>Avatar</span>
                    </div>
                    <div className={styles.titleBlock}>
                        <h1 className={styles.title}>Profile</h1>
                        <p className={styles.subtitle}>Your personal details</p>
                    </div>
                </header>

                <div className={styles.fields}>
                    <label className={styles.field}>
                        <span className={styles.label}>Username</span>
                        <input className={styles.input} type="text" placeholder={me.username} />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>Email</span>
                        <input className={styles.input} type="email" placeholder={me.email} />
                    </label>

                    <label className={`${styles.field} ${styles.fieldWide}`}>
                        <span className={styles.label}>Bio</span>
                        <textarea className={styles.textarea} rows={4} placeholder="Short bio" />
                    </label>
                </div>
                <div>
                    <p>Test UI. No backend</p>
                </div>
            </div>
        </div>
    );
};

export default Profile2;
