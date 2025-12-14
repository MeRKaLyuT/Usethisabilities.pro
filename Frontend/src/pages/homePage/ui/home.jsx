import React from 'react';
import {Link} from 'react-router-dom';
import * as styles from './home.module.css';

// оцени вариант с директориями под главной надписью, а также
// определить заголовок в shared, если сделать такое везде

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroMain}>
          <Link to={'/skills'} className={styles.heroMain1}>
            <span>Find any skill</span>
          </Link>
          <div className={styles.sep}></div>
          <Link to={'/skills'} className={styles.heroMain2}>
            <span>Create your own</span>
          </Link>
        </div>
        <div className={styles.heroCards}>
        </div>
      </div>
    </div>
  );
};

export default Home;
