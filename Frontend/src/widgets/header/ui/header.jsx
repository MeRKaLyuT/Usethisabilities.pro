import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as styles from './header.module.css';


export default function Header() {
  const [moonState, setMoonState] = useState(false);
  const items = [
      {label: 'Main', to: '/'},
      {label: 'Trips', to: 'roadmaps'},
      {label: 'Profile', to: 'profile'},
    ];

  return (
    <div
      className={styles.header}
      onMouseEnter={() => setMoonState(true)}
      onMouseLeave={() => setMoonState(false)}
      >
      <div className={`${styles.moon} ${moonState ? styles.paused : ''}`}>
      </div>
      <div className={`${styles.menu} ${moonState ? styles.open : ''}`}>
        <ul className={styles.menuList}>
          {items.map(({label, to}) => (
            <li key={to}>
              <Link className={styles.menuButton} to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
