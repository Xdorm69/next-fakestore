"use client";
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TanstackProvider = ({children}: {children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 1000, // 5 seconds
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <ReactQueryClientProvider client={queryClient}>
            {children}
        </ReactQueryClientProvider>
    )
}

export default TanstackProvider;