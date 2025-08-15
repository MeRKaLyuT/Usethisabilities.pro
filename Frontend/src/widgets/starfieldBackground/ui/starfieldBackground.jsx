import React, {useRef, useEffect} from 'react';
import * as styles from './starfieldBackground.module.css';


const StarfieldBackground = () => {
    const ref = useRef(null);

    useEffect(()=> {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1; // important for different screens

        let centerX = 0;
        let centerY = 0;
        let maxDist = 0; // path from the top right corner to the bottom left corner

        const setSize = () => {
            ctx.setTransform(1, 0, 0, 1, 0 , 0);
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            centerX = canvas.clientWidth - 48;
            centerY = 48;
            maxDist = Math.hypot(centerX, canvas.clientHeight) + 100;
            ctx.scale(dpr, dpr);
        };

        setSize(); 
        
        
        function spawnStar() {
            const distance = Math.random() * maxDist;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.0002 + 0.00002;
            
            return {
                vx: distance * Math.cos(angle),
                vy: distance * Math.sin(angle),
                
                cosd: Math.cos(speed),
                sind: Math.sin(speed),
                
                distance,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.5,
            };
        }
        
        const stars = [];
        const numStars = Math.round((canvas.clientWidth * canvas.clientHeight) / 5000);
        for (let i = 0; i < numStars; ++i) stars.push(spawnStar());

        const observer = new ResizeObserver(setSize);
        observer.observe(canvas);

        function drawStars() {
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            for (const s of stars) {
                const nx = s.vx * s.cosd - s.vy * s.sind;
                const ny = s.vx * s.sind + s.vy * s.cosd;
                s.vx = nx;
                s.vy = ny;

                const x = centerX + s.vx;
                const y = centerY + s.vy;

                if (Math.hypot(s.vx, s.vy) > maxDist + 200) {
                    Object.assign(s, spawnStar());
                    continue;
                }

                ctx.beginPath();
                ctx.arc(x, y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
                ctx.fill();
            }
        }

        let animationId;

        function animate() {
            animationId = requestAnimationFrame(animate);
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
