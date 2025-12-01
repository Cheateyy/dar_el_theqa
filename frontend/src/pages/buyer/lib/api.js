import { api } from "@/lib/api_client";

/**@typedef {import('@/types/ListingModel')}*/

export async function get_listings() {
    const res = await api.get("/api/listings/featured");
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json();
    console.log("Listings fetch in the provider", data);
    /**@type {Listing[]} */
    return data;
};

/**
 * @typedef {Object} ToggleLikeResponse
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

/**@typedef {import('@/types/common')}*/

/**@returns {Promise<Option[]>} */
export async function get_property_types() {
    const res = await api.get("/api/choices/property-types");
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    const data = await res.json()
    return data;
}

/**@returns {Promise<Wilaya[]>} */
export async function get_wilayas() {
    const res = await api.get("/api/choices/wilayas");
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json()
    return data;
}

/**
 * @param {SearchPayload} search_payload
 * @returns {Promise<SearchResponse>}
 */
export async function search(search_payload) {
    const res = await api.post("/api/listings/search", search_payload);
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json()
    return data;
}

/**@type {import('@/types/PartnerModel')} */
/**@returns {Promise<Partner[]>} */
export async function get_partners() {
    const res = await api.get("/api/partners")
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json()
    return data;
}

/**@returns {Promise<Region[]>} */
export async function get_regions() {
    const res = await api.get("/api/choices/regions")
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }
    const data = await res.json()
    return data;
}