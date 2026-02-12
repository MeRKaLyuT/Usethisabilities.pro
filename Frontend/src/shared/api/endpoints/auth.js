import {api} from '../client.js';

export const fetchUserMe = async () => {
    const {data} = await api.get("/auth/me/");
    return data;
}

export const fetchProfileMe = async () => {
    const {data} = await api.get("profile/me/");
    return data;
}

export const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/sign-in/", {email, password});
    return data;
}

export const register = async ({username, email, password, confirmPassword}) => {
    const { data } = await api.post("/auth/sign-up/", {username, email, password, password_confirm: confirmPassword});
    return data;
}

export const logout = async () => {
    const { data } = await api.post("/auth/logout/");
    return data;
}
