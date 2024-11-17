import { createContext, useContext, useState } from "react";
import Loader from "../components/Loader";

// Create Loading Context
const LoadingContext = createContext();

// Loading Provider
export default function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

// Custom hook to access loading state and setLoading function
export function useLoadingContext() {
    return useContext(LoadingContext);
}

// Hook to wrap a component with loading
export function useLoading(component) {
    const { loading } = useLoadingContext();
    return loading ? <Loader /> : component;
}
