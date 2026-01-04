import {api} from '../client.js';

export const fetchMe = async () => {
    const {data} = await api.get("/auth/me");
    return data;
}

export const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/sign-in/", {email, password});
    return data;
}

export const logout = async () => {
    const { data } = await api.post("/auth/logout/");
    return data;
}
