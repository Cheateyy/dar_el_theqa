import { API_BASE_URL } from "@/config/env";


export async function getAdminListingDetails(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch admin listing details");
  return res.json();
}

async function fetchListingDocuments(id) {
  const res = await fetch(`${API_BASE_URL}/api/listings/documents/${id}/fetch`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch listing documents");
  return res.json();
}

export function getListingDocuments(id) {
  return fetchListingDocuments(id);
}

export function getAdminListingDocuments(id) {
  return fetchListingDocuments(id);
}
// Reject a document
export async function rejectAdminListingDocument(id, docId, reason) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/documents/${docId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to reject document");
  return res.json();
}

// Approve a listing
export async function approveAdminListing(id, force_fields = {}) {
  const body = force_fields ? { force_fields } : {};
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to approve listing");
  return res.json();
}

// Delete a listing
export async function deleteAdminListing(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.status === 204 ? { status: "deleted" } : res.json();
}

export async function getAdminListingTopReviews(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/reviews/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch admin listing reviews");
  return res.json();
}

export async function getAdminListingAllReviews(id) {
  const res = await fetch(`${API_BASE_URL}/api/listings/admin/${id}/reviews/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch complete admin reviews");
  return res.json();
}

export async function deleteAdminReview(reviewId) {
  const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/delete/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
}


export async function getListingDetails(id) {
    const res = await fetch(`${API_BASE_URL}/api/listings/${id}/`, {
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch listing details");
    return res.json();
}

export async function getListingReviews(id) {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/reviews/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch listing reviews");

  const payload = await res.json();

  const computeStats = (items = []) => {
    const total = items.length;
    if (!total) return { total: 0, average: 0 };
    const sum = items.reduce((acc, review) => acc + (Number(review?.rating) || 0), 0);
    return { total, average: sum / total };
  };

  if (Array.isArray(payload)) {
    const stats = computeStats(payload);
    return {
      average_rating: stats.average,
      total_reviews: stats.total,
      results: payload,
    };
  }

  const results = Array.isArray(payload?.results) ? payload.results : [];
  const stats = computeStats(results);
  return {
    average_rating: payload?.average_rating ?? stats.average,
    total_reviews: payload?.total_reviews ?? stats.total,
    results,
  };
}

/**
 * POST /api/listings/:id/reviews/
 * body: { rating: number (1-5), comment: string }
 */
export async function submitListingReview(id, { rating, comment }) {
  const payload = { rating, comment };
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit review");
  return res.json(); // { status:"success", message:"Review posted." }
}

/**
 * POST /api/listings/:id/interest/
 */
export async function sendListingInterest(id, message) {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/interest/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to send interest message");
  return res.json(); // { status:"success", message:"Message sent..." }
}

/**
 * POST /api/listings/:id/favorite/
 */
export async function toggleListingFavorite(id) {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/favorite/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to update favorite state");
  return res.json(); // { status:"added"|"removed", message }
}

/**
 * GET /api/listings/:id/similar/
 */
export async function getSimilarListings(id) {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/similar/`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch similar listings");
  return res.json(); // array of listing cards
}


/* According to Seller Journey API contract */

/**
 * GET /api/listings/my-listings/?page=&status=
 */
export async function getMyListings({ page = 1, status } = {}) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (status) params.append("status", status);

  const url = `${API_BASE_URL}/api/listings/my-listings/${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch my listings");
  return res.json(); // {count, next, results: [...]}
}

/**
 * POST /api/listings/:id/pause/
 * body: { reason: "RENTED" | "OTHER", auto_activate_date?: "YYYY-MM-DD" }
 */
export async function pauseSellerListing(id, { reason, auto_activate_date } = {}) {
  const body = { reason };
  if (auto_activate_date) body.auto_activate_date = auto_activate_date;

  const res = await fetch(
    `${API_BASE_URL}/api/listings/${id}/pause/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error("Failed to pause listing");
  const payload = await res.json();
  if (payload && !payload.new_status && payload.listing_status) {
    payload.new_status = payload.listing_status;
  }
  return payload;
}

/**
 * POST /api/listings/:id/activate/
 */
export async function activateSellerListing(id) {
  const res = await fetch(
    `${API_BASE_URL}/api/listings/${id}/activate/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to activate listing");
  const payload = await res.json();
  if (payload && !payload.new_status && payload.listing_status) {
    payload.new_status = payload.listing_status;
  }
  return payload; // 200 OK (we assume JSON status/message)
}

/**
 * DELETE /api/listings/:id/
 * body: { reason: "SOLD" | ... }
 */
export async function deleteSellerListing(id, reason = "SOLD") {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) throw new Error("Failed to delete listing");
  // 204 No Content per contract; return a simple object for FE
  return { status: "deleted" };
}

/**
 * PUT /api/listings/:id/
 * body: full listing payload (same as Create)
 */
export async function updateSellerListing(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/listings/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update listing");
  return res.json(); // {status: "success", message, new_status}
}