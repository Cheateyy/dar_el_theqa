/**
 * @typedef LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef LoginResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef RegisterPayload
 * @property {string} full_name
 * @property {string} email
 * @property {string} phone_number
 * @property {string} password
 * @property {string} re_password
 * @property {boolean} accepted_terms
 */

/**
 * @typedef RegisterResponse
 * @property {number} id
 * @property {string} email
 * @property {string} full_name
 * @property {string} message
 */

/**
 * @typedef User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {"USER" | "PARTNER" | "ADMIN"} role
 * @property {boolean} is_staff
 */

/**
 * @typedef AuthUserResponse
 * @property {boolean} isAuthenticated
 * @property {User} [user]
 */

/**
 * @typedef PasswordResetPayload
 * @property {string} email
 */

/**
 * @typedef PasswordResetResponse
 * @property {string} status
 * @property {string} message
 */

/**
 * @typedef PasswordResetConfirmPayload
 * @property {string} uid
 * @property {string} token
 * @property {string} new_password
 * @property {string} re_new_password
 */

/**
 * @typedef PasswordResetConfirmResponse
 * @property {string} status
 * @property {string} message
 */

/**
 * @typedef ActivationPayload
 * @property {string} email
 * @property {string} code
 */

/**
 * @typedef ActivationResponse
 * @property {string} status
 * @property {string} message
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef ResendActivationPayload
 * @property {string} email
 */

/**
 * @typedef ResendActivationResponse
 * @property {string} status
 * @property {string} message
 */

/**
 * @typedef LogoutResponse
 * @property {string} status
 * @property {string} message
 */