import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAbility } from '../../../shared/api/endpoints/abilities.js';

export const useUpdateAbility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAbility,
        onSuccess: (_updatedAbility, variables) => {
            const abilityId = variables?.abilityId;
            if (!abilityId) return;

            queryClient.invalidateQueries({
                queryKey: ['myAbilities'],
            });

            queryClient.invalidateQueries({
                queryKey: ['myStartedAbilities'],
            });

            queryClient.invalidateQueries({
                queryKey: ['abilities', 'catalog'],
            });

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'detail'],
            });

            queryClient.invalidateQueries({
                queryKey: ['profile'],
            });
        },
    });
};
