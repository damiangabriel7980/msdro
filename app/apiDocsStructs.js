/**
 * @apiDefine admin Only users with admin rights can access this route
 */
/**
 * @apiDefine medic Only users with medic rights can access this route
 */
/**
 * @apiDefine streamAdmin Only users with streamAdmin rights can access this route
 */
/**
 * @apiDefine None Any user can access this route
 */
/**
 * @apiDefine HeaderAuthorization A token is necessary in order to access this route
 * @apiHeader {String} Bearer a Bearer token included in "Authorization" HTTP Header
 */
/**
 * @apiDefine ErrorOnServer
 * @apiError (Error 500) {Object} ServerError The requested operation could not be executed
 */
/**
 * @apiDefine BadRequest
 * @apiError (Error 4xx) {Object} BadRequest Error - Bad request
 */
/**
 * @apiDefine EntityNotFound
 * @apiError (Error 4xx) {Object} EntityNotFound Error - Entity not found
 */