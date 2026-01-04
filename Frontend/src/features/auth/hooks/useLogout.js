import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {logout} from '../../../shared/api/endpoints/auth.js';

export const useLogout = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"]}); // or removeQuaries (just delete), but for logout inval. is better
        }, // invalidate - пометить как устаревший
        retry: false,
    })
}