import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAbilityLesson } from '../../../shared/api/endpoints/lessons.js';

export const useDeleteAbilityLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAbilityLesson,
        onSuccess: (_, variables) => {
            const abilityId = variables?.courseId ?? variables?.abilityId;
            if (!abilityId) return;

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'lessons'],
            });
        },
    });
};
