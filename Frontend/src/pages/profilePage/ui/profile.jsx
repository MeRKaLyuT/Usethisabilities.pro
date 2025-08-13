import React, { useState } from 'react';
import * as styles from './profile.module.css';
import {Ping} from '../../../features/ping/index.js';


const Profile = () => {



    return (
        <div className={styles.profile}>
            <Ping />
            <h1>HELLO</h1>
        </div>
    );
};

export default Profile;
