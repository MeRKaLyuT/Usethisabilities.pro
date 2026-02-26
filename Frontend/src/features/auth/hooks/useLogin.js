import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../../shared/api/endpoints/auth.js";

export const useLogin = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["me"] }),
                qc.invalidateQueries({ queryKey: ["profile"] }),
            ]);
        },
    })
}
