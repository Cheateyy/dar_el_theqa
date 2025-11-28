// Made by Chatgpt

import { API_BASE_URL } from "@/config/env";

/**
 * Single configured api client to be used across the application
 * 
 * Examples:
 * 
 * ```js
 * import {api} from "@/lib/api_client.js"
 * api.get("/users");
 * api.post("/users", { name: "Alice" });
 * ```
 */
export function createApiClient({ baseURL, defaultHeaders = {} }) {
    return {
        async request(path, options = {}) {
            return await fetch(baseURL + path, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...defaultHeaders,
                    ...options.headers,
                },
            });
        },

        get(path, options = {}) {
            return this.request(path, { ...options, method: "GET" });
        },

        post(path, body, options = {}) {
            return this.request(path, {
                ...options,
                method: "POST",
                body: JSON.stringify(body),
            });
        },

        put(path, body, options = {}) {
            return this.request(path, {
                ...options,
                method: "PUT",
                body: JSON.stringify(body),
            });
        },

        delete(path, options = {}) {
            return this.request(path, { ...options, method: "DELETE" });
        },
    };
}


export const api = createApiClient({
    baseURL: API_BASE_URL,
});