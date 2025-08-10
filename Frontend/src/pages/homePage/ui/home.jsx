import React from 'react';
import {Link} from 'react-router-dom';
import * as styles from './home.module.css';

// сделай появление звезд плавным

// найди как убрать отступы сверху у кнопок heroh1

// оцени вариант с директориями под главной надписью, а также
// определить заголовок в shared, если сделать такое

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.heroh1}>
        <h1>Use this abilities!</h1>
      </div>
      <div className={styles.hero}>
        <div className={styles.heroMain}>
          <Link to={'/skills'} className={styles.heroMain1}>
            <h3>Find any skill</h3>
          </Link>
          <div className={styles.sep}></div>
          <Link to={'/skills'} className={styles.heroMain2}>
            <h3>Create your own</h3>
          </Link>
        </div>
        <div className={styles.heroCards}>

        </div>
      </div>
    </div>
  );
};

export default Home;
