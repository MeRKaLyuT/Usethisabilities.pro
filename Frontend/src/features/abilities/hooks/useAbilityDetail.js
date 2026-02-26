import { useQuery } from '@tanstack/react-query';
import { fetchAbilityDetail } from '../../../shared/api/endpoints/abilities.js';

export const useAbilityDetail = (abilityId) => {
    return useQuery({
        queryKey: ['abilities', abilityId, 'detail'],
        queryFn: () => fetchAbilityDetail(abilityId),
        enabled: Boolean(abilityId),
        retry: false,
        refetchOnWindowFocus: false,
    });
};
