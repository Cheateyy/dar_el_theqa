import { api } from "@/lib/api_client";

export async function fetch_listings() {
    const res = await api.get("/api/listings/featured");
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json();
    console.log("Listings fetch in the provider", data);
    return data;
};

/**
 * @typedef ToggleLikeResponse
 * @property {"added" | "removed"} status
 * @property {string} message
 */

export async function toggle_like(listing_id) {
    const res = await api.post(`/api/listings/${listing_id}/favorite`);
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    /**@type {ToggleLikeResponse} */
    const data = await res.json();
    console.log(`Listing like is ${data.status}`)
    return data;
}