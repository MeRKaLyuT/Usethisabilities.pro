import React, {useRef, useEffect} from 'react';
import * as styles from './starfieldBackground.module.css';

// do a calculation of the star's traectory in advance

const StarfieldBackground = () => {
    const ref = useRef(null);

    useEffect(()=> {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        let centerX = 0;
        let centerY = 0;
        let maxDist = 0;

        const setSize = () => {
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            centerX = canvas.clientWidth - 24;
            centerY = 24;
            maxDist = Math.hypot(centerX, canvas.clientHeight) + 100;
            ctx.scale(dpr, dpr);
        };

        setSize(); 
        const observer = new ResizeObserver(setSize);
        observer.observe(canvas);

        const stars = [];
        const numStars = Math.round(
            (canvas.clientWidth * canvas.clientHeight) / 3000,
        );

        for (let i = 0; i < numStars; ++i) {
            stars.push({
                distance: Math.random() * maxDist,
                alpha: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.0002 + 0.00002,
                size: Math.random() * 2 + 0.5,
                angle: Math.random() * Math.PI * 2,
            });
        }

        function updateStars() {
            for (const s of stars) {
                s.angle += s.speed;
                if (s.angle >= Math.PI * 2) s.angle -= Math.PI * 2;
                s.x = centerX + s.distance * Math.cos(s.angle);
                s.y = centerY + s.distance * Math.sin(s.angle);
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            for (const s of stars) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.fill();
            }
        }

        let animationId;
        function animate() {
            animationId = requestAnimationFrame(animate);
            updateStars();
            drawStars();
        }
        animate();

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
