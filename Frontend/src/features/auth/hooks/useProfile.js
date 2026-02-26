import { useQuery } from "@tanstack/react-query";
import { fetchProfileMe } from "../../../shared/api/endpoints/auth.js";

export const useProfile = (options = {}) => {
    const enabled = options?.enabled ?? true;

    return useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfileMe,
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
    })
}
