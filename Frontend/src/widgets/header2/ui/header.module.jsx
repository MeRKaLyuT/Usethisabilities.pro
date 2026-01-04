import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import CallMadeIcon from '@mui/icons-material/CallMade';
import * as styles from './header.module.css';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#000',
  menuColor = '#fff',
  buttonBgColor = '#18181b',
  buttonTextColor = '#fff'
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 230;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(`.${styles['card-nav-content']}`);
      if (contentEl) {
        const old = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height
        };

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const height = 60 + contentEl.scrollHeight + 16;

        contentEl.style.visibility = old.visibility;
        contentEl.style.pointerEvents = old.pointerEvents;
        contentEl.style.position = old.position;
        contentEl.style.height = old.height;

        return height;
      }
    }

    return 230;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      '-=0.1'
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => tl?.kill();
  }, [items, ease]);

  useLayoutEffect(() => {
    const handler = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        newTl.progress(1);
        tlRef.current = newTl;
      } else {
        tlRef.current.kill();
        tlRef.current = createTimeline();
      }
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`${styles['card-nav-container']} ${className}`}>
      <nav
        ref={navRef}
        className={`${styles['card-nav']} ${isExpanded ? styles.open : ''}`}
        style={{ backgroundColor: baseColor }}
      >
        <div className={styles['card-nav-top']}>
          <button
            type="button"
            className={`${styles['hamburger-menu']} ${isHamburgerOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{ color: menuColor }}
          >
            <span className={styles['hamburger-line']} />
            <span className={styles['hamburger-line']} />
          </button>

          <div className={styles['logo-container']}>
            <img src={logo} alt={logoAlt} width="" className={styles['logo']} />
            <h1 className={styles['title']}>Use This Abilities</h1>
          </div>

          <button
            type="button"
            className={styles['card-nav-cta-button']}
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        <div
          className={styles['card-nav-content']}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              ref={setCardRef(idx)}
              className={styles['nav-card']}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className={styles['nav-card-label']}>{item.label}</div>
              <div className={styles['nav-card-links']}>
                {item.links?.map((lnk, i) => (
                  <a key={`${lnk.label}-${i}`} className={styles['nav-card-link']} href={lnk.href} aria-label={lnk.ariaLabel}>
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
