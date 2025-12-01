import { API_BASE_URL } from "@/config/env";
import { HttpResponse, http } from "msw";

import listings from './listings_mock.json'; // works because Vite supports JSON imports
import property_types from './property_types_mock.json';
import wilayas from './wilayas_mock.json';
import search_listings from './search_listings_mock.json';
import partners from './partners_mock.json';

/**@type {import("@/pages/buyer/types/common")} */

export const handlers = [
    http.get(API_BASE_URL + "/api/listings/featured", async () => {
        console.log("Mock listings executed")
        let data = listings;
        return HttpResponse.json(data)
    }),

    http.post(API_BASE_URL + "/api/listings/:id/favorite", async (req) => {
        const { id } = req.params
        console.log(`Mock like toggle for listing #${id}`)
        return HttpResponse.json({ status: "added", message: "Added to favorites", })
    }),

    http.get(API_BASE_URL + "/api/choices/property-types", async () => {
        return HttpResponse.json(property_types);
    }),

    http.get(API_BASE_URL + "/api/choices/wilayas", async () => {
        return HttpResponse.json(wilayas);
    }),

    http.post(API_BASE_URL + "/api/listings/search", async ({ request }) => {
        /**@type {SearchPayload} */
        const body = await request.clone().json()
        console.log("MOCKING: search filters payload is: ", body)

        const page = body.page
        const next = API_BASE_URL + "/api/listings/search" + `?page=${page ?? 0 + 1}`
        const previous = page ? page - 1 : null
        // debugger;
        return HttpResponse.json({ count: '12', next, previous, results: search_listings })
    }),

    http.get(API_BASE_URL + "/api/partners", async () => {
        return HttpResponse.json(partners)
    }),
]