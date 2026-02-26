import { useQuery } from '@tanstack/react-query';
import { fetchAbilityLessonDetail } from '../../../shared/api/endpoints/lessons.js';

export const useAbilityLessonDetail = ({ courseId, lessonId }) => {
    return useQuery({
        queryKey: ['abilities', courseId, 'lessons', lessonId, 'detail'],
        queryFn: () => fetchAbilityLessonDetail({ courseId, lessonId }),
        enabled: Boolean(courseId) && Boolean(lessonId),
        retry: false,
        refetchOnWindowFocus: false,
    });
};
