import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAbilityLesson } from '../../../shared/api/endpoints/lessons.js';

export const useCreateAbilityLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAbilityLesson,
        onSuccess: (_createdLesson, variables) => {
            const abilityId = variables?.courseId ?? variables?.abilityId;
            if (!abilityId) return;

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'lessons'],
            });
        },
    });
};
