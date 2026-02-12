import { useQuery } from "@tanstack/react-query";
import { fetchProfileMe } from "../../../shared/api/endpoints/auth.js";

export const useProfile = () => {
    return useQuery({
        queryKey: ["Profile"],
        queryFn: fetchProfileMe,
        retry: false,
        refetchOnWindowFocus: false,
    })
}