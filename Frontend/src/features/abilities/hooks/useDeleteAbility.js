import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAbility } from '../../../shared/api/endpoints/abilities.js';

export const useDeleteAbility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAbility,
        onSuccess: (_result, abilityId) => {
            queryClient.invalidateQueries({
                queryKey: ['myAbilities'],
            });

            queryClient.invalidateQueries({
                queryKey: ['abilities', 'catalog'],
            });

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'detail'],
            });
        },
    });
};
