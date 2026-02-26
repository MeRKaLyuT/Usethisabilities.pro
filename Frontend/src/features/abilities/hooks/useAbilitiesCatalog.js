import { useQuery } from '@tanstack/react-query';
import { fetchAbilitiesCatalog } from '../../../shared/api/endpoints/abilities.js';

export const useAbilitiesCatalog = (params = {}) => {
    const normalizedStatus = typeof params?.status === 'string' ? params.status.trim().toLowerCase() : '';
    const querySuffix = normalizedStatus || 'all';

    return useQuery({
        queryKey: ['abilities', 'catalog', querySuffix],
        queryFn: () => fetchAbilitiesCatalog(params),
        retry: false,
        refetchOnWindowFocus: false,
    });
};
