import { api } from '../client.js';

export const fetchAbilityLessons = async (abilityId) => {
    const { data } = await api.get(`/abilities/${abilityId}/lessons/`)
    return data;
}

export const createAbilityLesson = async ({ courseId, payload }) => {
    const { data } = await api.post(`/abilities/${courseId}/lessons/`, payload);
    return data;
};

export const fetchAbilityLessonDetail = async ({ courseId, lessonId }) => {
    const { data } = await api.get(`/abilities/${courseId}/lessons/${lessonId}/`);
    return data;
};

export const updateAbilityLesson = async ({ courseId, lessonId, payload }) => {
    const { data } = await api.patch(`/abilities/${courseId}/lessons/${lessonId}/`, payload);
    return data;
};

export const deleteAbilityLesson = async ({ courseId, lessonId }) => {
    const { data } = await api.delete(`/abilities/${courseId}/lessons/${lessonId}/`);
    return data;
};