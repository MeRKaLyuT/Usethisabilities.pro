import axios from 'axios';

export async function Ping() {
    const request = await axios.get('http://127.0.0.1:8000/api/ping/');
    return request.data;
}
