import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAbilityLesson } from '../../../shared/api/endpoints/lessons.js';

export const useUpdateAbilityLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAbilityLesson,
        onSuccess: (_updatedLesson, variables) => {
            const abilityId = variables?.courseId ?? variables?.abilityId;
            if (!abilityId) return;

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'lessons'],
            });

            queryClient.invalidateQueries({
                queryKey: ['abilities', abilityId, 'lessons', variables.lessonId],
            });
        },
    });
};
