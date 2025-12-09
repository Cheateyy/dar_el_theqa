import { API_BASE_URL } from "@/config/env";


export async function getAdminListingDetails(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch listing details");
  return res.json();
}

export async function getAdminListingDocuments(id) {
  const res = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/documents/`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch listing documents");
  return res.json();
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
  return res.json(); // returns {average_rating, total_reviews, results}
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
  return res.json(); // {status: "success", message, new_status}
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
  return res.json(); // 200 OK (we assume JSON status/message)
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