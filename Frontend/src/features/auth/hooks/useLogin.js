import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../../shared/api/endpoints/auth.js";

export const useLogin = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            qc.invalidateQueries({queryKey: ["me"]});
        },
    })
}