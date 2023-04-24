/**
 * Constants file with all server error codes
 * Add new codes here
 *
 * @author Pim Meijer - @edited Mick Veenman
 */

module.exports = {
    // Ok Codes
    HTTP_OK_CODE: 200,
    HTTP_CREATED_CODE: 201,
    HTTP_ACCEPTED_CODE: 202,
    HTTP_NO_CONTENT_CODE: 204,

    // Redirection Codes
    TEMP_REDIRECT: 307,
    PERM_REDIRECT: 308,

    // Client error responses
    BAD_REQUEST_CODE: 400,
    AUTHORIZATION_ERROR_CODE: 401,
    ROUTE_NOT_FOUND_CODE: 404,
    METHOD_NOW_ALLOWED: 405,
}