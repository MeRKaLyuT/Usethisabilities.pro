import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import * as styles from './header.module.css';


export default function Header() {
  const menuRef = useRef(null);
  const [moonState, setMoonState] = useState(false);
  const items = [
      {label: 'Main', to: '/'},
      {label: 'Abilities', to: '/skills'},
      {label: 'Profile', to: '/profile'},
  ];

  useEffect(() => {
    if (!moonState) return;

    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) { 
        setMoonState(false);
      }
    };

    const onKeyDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMoonState(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moonState])

  return (
    <div
      className={styles.header}
      onMouseEnter={() => setMoonState(true)}
      onMouseLeave={() => setMoonState(false)}
      onClick={() => setMoonState(!moonState)}
      onFocus={() => setMoonState(true)}
      onBlur={() => setMoonState(false)}
      >
      <div className={`${styles.moon} ${moonState ? styles.paused : ''}`} tabIndex={0} ref={menuRef}>
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
