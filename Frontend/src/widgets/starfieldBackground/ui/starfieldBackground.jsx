import React, {useRef, useEffect} from 'react';
import * as styles from './starfieldBackground.module.css';

// do a calculation of the star's traectory in advance

const StarfieldBackground = () => {
    const ref = useRef(null);

    useEffect(()=> {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1; // important for different screens

        let maxStars;
        const density = 1 / 4000;  
        let startTime = performance.now();
        const ease = t => t * t * (3 - 2 * t); // smooth appereance of the star

        let centerX = 0;
        let centerY = 0;
        let maxDist = 0;

        let viewW = 0;
        let viewH = 0;

        const setSize = () => {
            ctx.resetTransform();
            viewW = canvas.clientWidth * dpr;
            viewH = canvas.clientHeight * dpr;
            canvas.width = viewW * dpr;
            canvas.height = viewH * dpr;
            ctx.scale(dpr, dpr);

            centerX = viewW - 48;
            centerY = 48;
            maxDist = Math.hypot(centerX, canvas.clientHeight) + 100;

            maxStars = Math.round(canvas.clientWidth * canvas.clientHeight * density);
        };

        setSize(); 
        const observer = new ResizeObserver(setSize);
        observer.observe(canvas);
        
        function spawnStar() {
            const distance = Math.random() * maxDist;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.013 + 0.001;
            const now = performance.now();
            
            return {
                vx: distance * Math.cos(angle),
                vy: distance * Math.sin(angle),
                
                speed,
                bornAt: now,
                fadeIn: 300 + Math.random() * 1700,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.4,
            };
        }

        const stars = [];

        function drawStars(dt, now) {
            ctx.clearRect(0, 0, viewW, viewH);
            ctx.fillStyle = '#fff';

            for (const s of stars) {
                const delta = s.speed * dt;
                const cosd = Math.cos(delta);
                const sind = Math.sin(delta);
                
                const nx = s.vx * cosd - s.vy * sind;
                const ny = s.vx * sind + s.vy * cosd;
                s.vx = nx;
                s.vy = ny;

                const x = centerX + s.vx;
                const y = centerY + s.vy;

                const age = now - s.bornAt;
                let t = age / s.fadeIn;
                if (t < 0) t = 0;
                if (t > 1) t = 1;

                let alpha = s.alpha * ease(t);  

                ctx.beginPath();
                ctx.arc(x, y, s.size, 0, Math.PI * 2);
                ctx.globalAlpha = alpha;
                ctx.fill();
            }
            ctx.globalAlpha = 1; 
        }

        const maxSpawnPerFrame = 30;
        let animationId;
        let prev = performance.now();

        function animate(now) {
            let dt = (now - prev) / 1000;
            if (dt > 0.05) dt = 0.05;
            prev = now;

            const elapsed = (now - startTime) / 1000;
            const desired = Math.min(
                maxStars, 
                Math.floor(maxStars * (1 - Math.exp(-elapsed))),
            );

            let need = desired - stars.length;
            if (need > 0) {
                const toSpawn = Math.min(need, maxSpawnPerFrame);
                for (let i = 0; i < toSpawn; ++i) {
                    stars.push(spawnStar());
                }
            }

            drawStars(dt, now);
            animationId = requestAnimationFrame(animate);
        }
        animationId = requestAnimationFrame(animate);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas ref={ref} className={styles.canvas} />
    );
};

export default StarfieldBackground;
