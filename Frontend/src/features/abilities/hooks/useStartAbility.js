import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startAbility } from '../../../shared/api/endpoints/abilities.js';

export const useStartAbility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: startAbility,
        onSuccess: (_result, abilityId) => {
            if (!abilityId) return;

            queryClient.invalidateQueries({
                queryKey: ['profile'],
            });

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
        },
    });
};
