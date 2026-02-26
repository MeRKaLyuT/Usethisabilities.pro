import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAbility } from '../../../shared/api/endpoints/abilities.js';

export const useCreateAbility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAbility,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['myAbilities'],
            });
        },
    });
};
