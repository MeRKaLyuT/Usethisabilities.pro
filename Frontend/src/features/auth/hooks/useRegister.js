import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../../shared/api/endpoints/auth.js";

export const useRegister = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ["me"] }),
                qc.invalidateQueries({ queryKey: ["profile"] }),
            ]);
        }
    });
}
