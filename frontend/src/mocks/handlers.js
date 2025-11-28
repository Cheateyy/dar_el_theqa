import { API_BASE_URL } from "@/config/env";
import { HttpResponse, http } from "msw";
import listings from './listings_mock.json'; // works because Vite supports JSON imports
import property_types from './property_types_mock.json';

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
    })
]