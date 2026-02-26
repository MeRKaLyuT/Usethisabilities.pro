import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../../../shared/api/endpoints/auth.js';

export const useLogout = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ['me'] }),
                qc.invalidateQueries({ queryKey: ['profile'] }),
            ]);
        },
        retry: false,
    });
};
