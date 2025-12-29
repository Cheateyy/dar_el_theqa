import { API_BASE_URL } from "@/config/env";
import { TokenManager } from "@/services/authService";

const authFetch = (url, options = {}) => {
  const token = TokenManager.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};


export async function getAdminListingDetails(id) {
  const res = await authFetch(`${API_BASE_URL}/api/admin/listings/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch admin listing details");
  return res.json();
}

async function fetchListingDocuments(id) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/documents/${id}/fetch/`);
  if (!res.ok) throw new Error("Failed to fetch listing documents");
  return res.json();
}

export function getListingDocuments(id) {
  return fetchListingDocuments(id);
}

export function getAdminListingDocuments(id) {
  return fetchListingDocuments(id);
}

export async function approveAdminListingDocument(id, docId, reason) {
  const res = await authFetch(
    `${API_BASE_URL}/api//admin/listings/${id}/documents/${docId}/approve/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to approve document (${res.status}): ${text}`);
  }

  return res.json();
}

export async function rejectAdminListingDocument(id, docId, reason) {
  const res = await authFetch(
    `${API_BASE_URL}/api//admin/listings/${id}/documents/${docId}/reject/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to reject document (${res.status}): ${text}`);
  }

  return res.json();
}

export async function rejectAdminListing(id, reason = "") {
  const payload = reason ? { reason } : {};
  const res = await authFetch(
    `${API_BASE_URL}/api/admin/listings/${id}/reject-anyways/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to reject listing (${res.status}): ${text}`);
  }

  return res.json();
}




export async function approveAdminListing(id, force_fields = {}) {
  const body = force_fields ? { force_fields } : {};
  const res = await authFetch(`${API_BASE_URL}/api/admin/listings/${id}/approve/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to approve listing");
  return res.json();
}

export async function deleteAdminListing(id, reason = "") {
  const res = await authFetch(`${API_BASE_URL}/api/admin/listings/${id}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  if (res.status === 204) {
    return { status: "deleted" };
  }

  try {
    return await res.json();
  } catch (_error) {
    return { status: "deleted" };
  }
}

export async function getAdminListingTopReviews(id) {
  const res = await authFetch(`${API_BASE_URL}/api/admin/listings/${id}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch admin listing reviews");
  return res.json();
}

export async function getAdminListingAllReviews(id) {
  const res = await authFetch(`${API_BASE_URL}/api/admin/listings/${id}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch complete admin reviews");
  return res.json();
}

export async function deleteAdminReview(reviewId) {
  const res = await authFetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/delete/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json();
}


export async function getListingDetails(id) {
    const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch listing details");
    return res.json();
}

export async function getListingReviews(id) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/reviews/`);
  if (!res.ok) throw new Error("Failed to fetch listing reviews");

  const payload = await res.json();

  const computeStats = (items = []) => {
    const total = items.length;
    if (!total) return { total: 0, average: 0 };
    const sum = items.reduce((acc, review) => acc + (Number(review?.rating) || 0), 0);
    return { total, average: sum / total };
  };

  const normalizedArray = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.reviews)
        ? payload.reviews
        : [];

  const stats = computeStats(normalizedArray);
  return {
    average_rating: payload?.average_rating ?? stats.average,
    total_reviews: payload?.total_reviews ?? stats.total,
    results: normalizedArray,
  };
}

export async function submitListingReview(id, { rating, comment }) {
  const payload = { rating, comment };
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/reviews/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit review");
  return res.json(); 
}

export async function sendListingInterest(id, message) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/interest/`, {
    method: "POST",
    body: JSON.stringify({ listing: id, message }),
  });

  if (!res.ok) throw new Error("Failed to send interest message");
  return res.json(); 
}

export async function toggleListingFavorite(id) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/favorite/`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to update favorite state");
  return res.json(); 
}


export async function getSimilarListings(id) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/similar/`);

  if (!res.ok) throw new Error("Failed to fetch similar listings");
  return res.json(); 
}

export async function getMyListings({ page = 1, status } = {}) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (status) params.append("status", status);

  const url = `${API_BASE_URL}/api/listings/my-listings/${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const res = await authFetch(url);

  if (!res.ok) throw new Error("Failed to fetch my listings");
  return res.json(); 
}

export async function pauseSellerListing(id, { reason, auto_activate_date } = {}) {
  const body = { reason };
  if (auto_activate_date) body.auto_activate_date = auto_activate_date;

  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/pause/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to pause listing");
  const payload = await res.json();
  if (payload) {
    if (payload.new_status && payload.new_status !== payload.status) {
      payload.status = payload.new_status;
    } else if (!payload.status && payload.listing_status) {
      payload.status = payload.listing_status;
    }
  }
  return payload;
}

export async function activateSellerListing(id) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/activate/`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to activate listing");
  const payload = await res.json();
  if (payload) {
    if (payload.new_status && payload.new_status !== payload.status) {
      payload.status = payload.new_status;
    } else if (!payload.status && payload.listing_status) {
      payload.status = payload.listing_status;
    }
  }
  return payload; 
}

export async function deleteSellerListing(id, reason = "SOLD") {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/`, {
    method: "DELETE",
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) throw new Error("Failed to delete listing");
  return { status: "deleted" };
}

export async function updateSellerListing(id, payload) {
  const res = await authFetch(`${API_BASE_URL}/api/listings/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update listing");
  return res.json(); 
}