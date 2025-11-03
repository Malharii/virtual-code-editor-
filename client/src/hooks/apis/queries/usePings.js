import pingAPI from "../../../apis/pings.js";
import { useQuery } from "@tanstack/react-query";
export default function usePing() {
  const { isLoading, data, error, isError } = useQuery({
    queryKey: "pings",
    queryFn: pingAPI,
    staleTime: 10000,
  });

  return { isLoading, data, error, isError };
}
