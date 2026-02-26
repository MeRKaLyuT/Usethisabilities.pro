import { useQuery } from '@tanstack/react-query';
import { fetchAbilityLessons } from '../../../shared/api/endpoints/lessons.js';

export const useAbilityLessons = (abilityId) => {
    return useQuery({
        queryKey: ['abilities', abilityId, 'lessons'],
        queryFn: () => fetchAbilityLessons(abilityId),
        enabled: Boolean(abilityId),
        retry: false,
        refetchOnWindowFocus: false,
    });
};

