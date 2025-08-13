import React, {useEffect, useState} from "react";
import {Ping} from "../api/ping.js";
import * as styles from './ping.module.css';


export default function PingServer() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const timer = setTimeout(() => {
            setError(null);
            setData(null);
        }, 2000)

        return () => clearTimeout(timer);
    }, [error, data]);

    const handleClick = async () => {
        try {
            const result = await Ping();
            setData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    return(
        <div className={styles.ping}>
            <button onClick={handleClick} className={styles.btn}>Ping server</button>
            {error && <p style={{color: "red"}}>{error}</p>}
            {data && <p style={{color: "#a5ff30"}}>{data}</p>}
        </div>
    );

};
