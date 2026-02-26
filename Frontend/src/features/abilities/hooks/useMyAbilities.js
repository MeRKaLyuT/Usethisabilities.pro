import { useQuery } from "@tanstack/react-query";
import { fetchMyAbilities } from "../../../shared/api/endpoints/abilities.js";

export const useMyAbilities = (options = {}) => {
    const enabled = options?.enabled ?? true;

    return useQuery({
        queryKey: ["myAbilities"],
        queryFn: fetchMyAbilities,
        retry: false,
        refetchOnWindowFocus: false,
        enabled,
    })
}
