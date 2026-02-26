import { api } from '../client.js';

export const fetchAbilitiesCatalog = async (params = {}) => {
    const { data } = await api.get('/abilities/', { params });
    return data;
};

export const fetchMyAbilities = async () => {
    const { data } = await api.get("/abilities/my/");
    return data;
};

export const fetchMyStartedAbilities = async () => {
    const { data } = await api.get("/abilities/my/started/");
    return data;
};

export const fetchAbilityDetail = async (abilityId) => {
    const { data } = await api.get(`/abilities/${abilityId}/`);
    return data;
};

export const createAbility = async (payload) => {
    const { data } = await api.post('/abilities/', payload);
    return data;
};

export const updateAbility = async ({ abilityId, payload }) => {
    const { data } = await api.patch(`/abilities/${abilityId}/`, payload);
    return data;
};

export const startAbility = async (abilityId) => {
    const { data } = await api.post(`/abilities/${abilityId}/start/`);
    return data;
};

export const deleteAbility = async (abilityId) => {
    const { data } = await api.delete(`/abilities/${abilityId}/delete/`);
    return data;
};
