import { API_BASE_URL } from "@/config/api";
import { HttpResponse, http } from "msw";

// Mock JSON data
import listingDetail from '@/mocks/listing_detail_fake.json';
import listingDocuments from '@/mocks/listing_documents_fake.json';
import listingDetailbuyer from "@/mocks/listing_detail_rent_sell.json";
import listingReviews from "@/mocks/listing_reviews_rent.json";
import sellerMyListings from "@/mocks/seller_my_listings.json";


import listings from './listings_mock.json'; // works because Vite supports JSON imports
import property_types from './property_types_mock.json';
import wilayas from './wilayas_mock.json';
import search_listings from './search_listings_mock.json';
import partners from './partners_mock.json';
import regions from './regions_mock.json';
import favorites from './favorites_mock.json';


/**@type {import("@/pages/buyer/types/common")} */

export const handlers = [

    // GET listing details
    http.get(`${API_BASE_URL}/api/listings/:id/`, (req) => {
        const { id } = req.params;
        console.log(`Mock: fetch rent listing details for ID ${id}`);
        return HttpResponse.json(listingDetailbuyer);
    }),

    http.get(`${API_BASE_URL}/api/listings/my-listings/`, () => {
        console.log(`[MSW MOCK] Fetch seller dashboard listings`);
        return HttpResponse.json(sellerMyListings);
    }),

    http.get(`${API_BASE_URL}/api/listings/:id/reviews/`, (req) => {
        const { id } = req.params;
        console.log(`[MSW MOCK] Fetch listing reviews for ID ${id}`);
        return HttpResponse.json(listingReviews);
    }),

    http.get(`${API_BASE_URL}/api/admin/listings/:id/`, (req) => {
        const { id } = req.params;
        console.log(`Mock: fetch admin listing details for ID ${id}`);
        return HttpResponse.json(listingDetail);
    }),

    http.get(`${API_BASE_URL}/api/admin/listings/:id/documents/`, (req) => {
        const { id } = req.params;
        console.log(`Mock: fetch listing documents for ID ${id}`);

        return HttpResponse.json(listingDocuments);
    }),

    http.post(`${API_BASE_URL}/api/admin/listings/:id/documents/:docId/reject`, async (req) => {
        const { id, docId } = req.params;
        const body = await req.json();
        console.log(`Mock: reject document ${docId} for listing ${id}`, body);
        return HttpResponse.json({ status: "rejected", reason: body.reason });
    }),

    // Approve a listing
    http.post(`${API_BASE_URL}/api/admin/listings/:id/approve`, async (req) => {
        const { id } = req.params;
        const body = await req.json();
        console.log(`Mock: approve listing ${id}`, body);
        return HttpResponse.json({ status: "approved", force_fields: body.force_fields || {} });
    }),

    // Delete a listing
    http.delete(`${API_BASE_URL}/api/admin/listings/:id/`, (req) => {
        const { id } = req.params;
        console.log(`Mock: delete listing ${id}`);
        return HttpResponse.json({ status: "deleted" });
    }),

    /* ---------------------- SELLER ENDPOINTS ---------------------- */


    // POST /api/listings/:id/pause/
    http.post(`${API_BASE_URL}/api/listings/:id/pause/`, async (req) => {
        const { id } = req.params;
        const body = await req.json();
        console.log(`[MSW MOCK] Pause listing ${id}`, body);

        let newStatus;
        if (body.reason === "RENTED") {
            newStatus = "RENTED";
        } else {
            newStatus = "INACTIVE";
        }

        return HttpResponse.json({
            status: "success",
            message: "Listing paused.",
            new_status: newStatus,
        });
    }),

    // POST /api/listings/:id/activate/
    http.post(`${API_BASE_URL}/api/listings/:id/activate/`, async (req) => {
        const { id } = req.params;
        console.log(`[MSW MOCK] Activate listing ${id}`);
        // Contract says "status toggled back to APPROVED"
        return HttpResponse.json({
            status: "success",
            message: "Listing activated.",
            new_status: "APPROVED",
        });
    }),

    // PUT /api/listings/:id/
    http.put(`${API_BASE_URL}/api/listings/:id/`, async (req) => {
        const { id } = req.params;
        const body = await req.json();
        console.log(`[MSW MOCK] Update listing ${id}`, body);

        return HttpResponse.json({
            status: "success",
            message: "Changes saved. Waiting for Admin approval.",
            new_status: "APPROVED_AND_PENDING",
        });
    }),

    // DELETE /api/listings/:id/  (seller delete)
    http.delete(`${API_BASE_URL}/api/listings/:id/`, async (req) => {
        const { id } = req.params;
        const body = await req.json().catch(() => ({}));
        console.log(`[MSW MOCK] Delete seller listing ${id}`, body);

        // Backend returns 204 No Content; MSW can't send 204+body, so we just send 204.
        return new HttpResponse(null, { status: 204 });
    }),

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
        return HttpResponse.json({ count: search_listings.length, next, previous, results: search_listings })
    }),

    http.get(API_BASE_URL + "/api/partners", async () => {
        return HttpResponse.json(partners)
    }),

    http.get(API_BASE_URL + "/api/choices/regions", async () => {
        return HttpResponse.json(regions);
    }),

    http.get(API_BASE_URL + "/api/listings/favorites", async () => {
        /**@type {Paginated<Listing[]>} */
        // TODO : from where to get the page
        const page = 1
        const next = API_BASE_URL + "/api/listings/favorites" + `?page=${page ?? 0 + 1}`
        const previous = page ? page - 1 : null

        return HttpResponse.json({ count: favorites.length, next, previous, results: favorites })
    }),
]