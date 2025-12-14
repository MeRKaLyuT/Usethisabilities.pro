import {api} from '../client.js';

export const fetchMe = async () => {
    const {data} = await api.get("/auth/me");
    return data;
}