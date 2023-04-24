/**
 * Constants file with all server error codes
 * Add new codes here
 *
 * @author Pim Meijer
 */

// Ok Codes
const HTTP_OK_CODE = 200;
const HTTP_CREATED_CODE = 201;
const HTTP_ACCEPTED_CODE = 202;

// Redirection Codes
const TEMP_REDIRECT = 307;
const PERM_REDIRECT = 308;

// Client error responses
const BAD_REQUEST_CODE = 400;
const AUTHORIZATION_ERROR_CODE = 401;
const ROUTE_NOT_FOUND_CODE = 404;
const METHOD_NOW_ALLOWED = 405;

module.exports = {
    HTTP_OK_CODE, BAD_REQUEST_CODE, AUTHORIZATION_ERROR_CODE, ROUTE_NOT_FOUND_CODE
}