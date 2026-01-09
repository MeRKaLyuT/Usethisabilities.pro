import { api } from "./client.js";


let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
    r => r,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest?.url?.includes("/auth/refresh/")) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise(resolve => {
                queue.push({ resolve, reject, request: originalRequest });
            });
        }
        
        isRefreshing = true;

        try {
            await api.post("/auth/refresh/");
            queue.forEach(({ resolve, reject, request }) => {
                api(request).then(resolve).catch(reject);
            });
            queue = [];
            return api(originalRequest);
        } catch (e) {
            queue.forEach(({ reject }) => reject(e));
            queue = [];
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    } 
);