import { useQuery } from "@tanstack/react-query";
import { fetchUserMe } from "../../../shared/api/endpoints/auth.js";

// useQuery - smart useEffect + useState + cache + retry + abort
// take necessary data from the server and don't touch it again

export const useMe = () => {
    return useQuery({
        queryKey: ["me"], // unique name 
        queryFn: fetchUserMe,
        retry: false, // if 401 - don't repeat
        refetchOnWindowFocus: false,
    })
}