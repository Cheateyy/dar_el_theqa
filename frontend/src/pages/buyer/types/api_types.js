/**
 * @typedef SearchPayload
 * @property {"BUY" | "RENT"} transaction_type
 * @property {int} wilaya_id
 * @property {int} region_id
 * @property {string} property_type
 * @property {double} price_min
 * @property {double} price_max
 * @property {double | null} rent_time_unit
 * @property {boolean} is_verified_only
 * @property {int} area_min
 * @property {int} area_max
 * @property {int} floors
 * @property {int} bedrooms 
 * @property {int} bathrooms
 * @property {int} page
 */

/**
 * @typedef SearchResponse
 * @property {int} count
 * @property {string} next
 * @property {string} previous
 * @property {Listing[]} results
 */