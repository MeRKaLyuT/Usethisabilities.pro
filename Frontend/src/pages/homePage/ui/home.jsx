import React from 'react';
import {Link} from 'react-router-dom';
import { SignForm } from '../../../widgets/signform/index.jsx';
import * as styles from './home.module.css';

// оцени вариант с директориями под главной надписью

const Home = () => {
  return (
    <div className={styles.main}>
      <SignForm />
    </div>
  );
};

export default Home;
