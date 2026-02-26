import { useQuery } from '@tanstack/react-query';
import { fetchMyStartedAbilities } from '../../../shared/api/endpoints/abilities.js';

export const useMyStartedAbilities = (options = {}) => {
    const enabled = options?.enabled ?? true;

    return useQuery({
        queryKey: ['myStartedAbilities'],
        queryFn: fetchMyStartedAbilities,
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
    });
};
