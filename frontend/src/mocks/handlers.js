import { API_BASE_URL } from "@/config/api";
import { HttpHandler, HttpResponse, http } from "msw";
import listings from '@/mocks/listings_fake.json'; // works because Vite supports JSON imports


export const handlers = [
    http.get(API_BASE_URL + "/api/listings/featured", async () => {
        console.log("Mock handler executed")
        let data = listings;
        return HttpResponse.json(data)
    })
]