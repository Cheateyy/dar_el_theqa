/**
 * @typedef {Object} Listing
 * @property {number} id - Unique ID of the property.
 * @property {string} slug - URL-friendly identifier for the property.
 * @property {string} title - Display title of the property listing.
 * @property {"BUY" | "RENT"} transaction_type - Type of transaction.
 * @property {number} price - Price of the property.
 * @property {string|null} rent_unit - Rent unit (e.g. "month"), null if not applicable.
 * @property {string} wilaya - Region or province where the property is located.
 * @property {string} cover_image - URL of the main image for the property.
 * @property {"VERIFIED" | "PARTIAL" | "NONE"} verification_status - Verification status of the listing.
 * @property {boolean} is_liked
 */