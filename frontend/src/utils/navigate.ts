// utils/navigation.ts
import type { NavigateFunction, NavigateOptions, To } from "react-router-dom"; // <-- Fix here

let navigateFn: NavigateFunction | null = null;

/**
 * Sets the global navigate function from useNavigate hook.
 * Call this once in a root component.
 */
export const setNavigate = (fn: NavigateFunction): void => {
    if (typeof fn === "function") {
        navigateFn = fn;
    } else {
        console.error("Invalid navigate function");
    }
};

/**
 * Globally accessible navigate function that works from anywhere (e.g. Axios interceptors).
 */
export const navigate = (to: To, options?: NavigateOptions): void => {
    if (!navigateFn) {
        console.error("Navigate function is not set. Make sure to call setNavigate() in your app.");
        return;
    }

    navigateFn(to, options);
};